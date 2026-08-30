require 'yaml'
module Analytics
  extend ActiveSupport::Concern

  JADX_ERROR_PATTERNS = ["OutOfMemoryError"

  ]
  def extract_apk(user_upload, apk_path)

    file = user_upload.file
    destination = file.filename.to_s.gsub('.file', '')
    file = ActiveStorage::Blob.service.path_for(file.key)
    jadx_target = "#{Rails.root}/extracted/#{user_upload.id}/java_sources"
    jadx_command = "#{JADX_PATH} -j #{JADX_THREADS_COUNT} --log-level error -ds #{jadx_target} -r --show-bad-code #{apk_path}"
    apktool_full_command = "cd extracted && mkdir #{user_upload.id} && cd #{user_upload.id} && #{APKTOOL_PATH} d #{file} -o #{destination}"
    jadx_full_command = "cd extracted && mkdir #{user_upload.id} && cd #{user_upload.id} && mkdir java_sources && cd java_sources && #{jadx_command}"
    puts "Running initial apk extraction via JADX...."
    # puts "Executing command : \n #{apktool_full_command}"
    # output = `#{apktool_full_command}`
    # unless $?.success?
    #   puts apktool_full_command
    #   puts "Apktool command failed: #{output}"
    #   raise "Apktool failed"
    # end
    # puts "Apktool Initian extraction done !"
    puts "Running reverse engineering compiled files to java files via jadx ...."
    puts "Executing command : \n #{jadx_full_command}"

    buffer = ""
    start_time = Time.now
    timeout_limit = 6.minutes
    last_progress = 0
    last_updated_at = Time.now


    Open3.popen3(jadx_command) do |_stdin, stdout, stderr, wait_thr|
      pid = wait_thr.pid
      puts "JADX PID: #{pid}"
      loop do
        begin
          char = stdout.readpartial(1)
          buffer << char

          if char == "\n" || char == "\r"
            if buffer.include?("progress:") && buffer.match(/\((\d+)%\)/)
              match = buffer.match(/\((\d+)%\)/)
              percent = match[1].to_i
              user_upload.reload.update_columns(extraction_progress: percent)

              if percent > last_progress
                last_progress = percent
                last_updated_at = Time.now
              end
            elsif JADX_ERROR_PATTERNS.any? { |pattern| buffer.match?(pattern) }
              user_upload.update_columns(failure_message: buffer.strip, status: UserUpload.statuses[:failed])
              Process.kill('KILL', wait_thr.pid) rescue nil
              Rails.logger.error("JADX error: #{buffer.strip}")
              return 'failed'
            end

            buffer.clear
          end

          # Still check these even if no new full line
          if Time.now - start_time > timeout_limit
            user_upload.update(status: :failed, failure_message: "Timed out after 5 minutes")
            Process.kill('KILL', wait_thr.pid) rescue nil
            return 'failed'
          end

          if Time.now - last_updated_at > 1.minute # tried with 2 minutes, but server hangs
            user_upload.update(status: :failed, failure_message: "Stalled at #{last_progress}%")
            Process.kill('KILL', wait_thr.pid) rescue nil
            return 'failed'
          end

          # puts "Current Time: #{Time.now}"
          # puts "Last Updated: #{last_updated_at}"
          # puts "Start Time: #{start_time}"

        rescue EOFError
          user_upload.update_columns(extraction_progress: 100, status: UserUpload.statuses[:extracted])
          break
        end
      end
    end
    puts "Finished reverse engineering ! Java files generated and ready for analysis!"
  end

  def unzip_web_application(user_upload)
    `cd extracted && mkdir -p #{user_upload.id}/java_sources`
    `unzip #{ActiveStorage::Blob.service.path_for(user_upload.file.key)} -d extracted/#{user_upload.id}/java_sources`
  end

  def traverse(user_upload, filepath, patterns, rule_file)
    if File.directory?(filepath)
      Dir.foreach(filepath) do |filename|
        if filename != '.' and filename != '..'
          traverse(user_upload, filepath + '/' + filename, patterns, rule_file)
        end
      end
    else
      analyze_file(user_upload, filepath, patterns, rule_file) #if filepath.match(ALLOWED_FILES)
    end
  end

  def analyze_file(user_upload, filepath, patterns, rule_file)
    return unless File.exists?(filepath)
    filename = filepath.split('/').last
    file_data = File.readlines(filepath).map(&:chomp)
    matching_data = patterns.map do |pattern|
      result = []
      pattern['pattern'].map do |item|
        begin
          res = file_data.grep(/#{item}/).map { |val| { lineNumber: file_data.index(val) + 1, codeSegment: val.squish }.to_json }
          next if res.blank?
          result << res if res
        rescue Exception => e
          puts e.message
        end

      end

      vulnerability_impact = HipaaRiskScoreCalculator::VULNERABILITIES.collect{|vul| vul[:name] if vul[:id] == (pattern["vulnerability_impacts"] || []).collect{|impact| impact["vulnerability_id"] }.first}.compact.first
      severity_comp = (pattern["vulnerability_impacts"] || []).collect { |impact|
        HipaaRiskScoreCalculator::SEVERITY_LABELS[impact["severity"].to_sym]
      }.first
      subrule_id = pattern["id"]
      { pattern: pattern['pattern'], matchData: result, description: pattern['description'], severity: severity_comp, vulnerability_cat: vulnerability_impact, subrule_id: subrule_id, manual_check: pattern['manual_check'] } if result.any?
    end.compact

    unless matching_data.blank?
      matching_data.map do |item|
        user_upload.analyzed_results.create(
          {
            filepath: filepath,
            filename: filename,
            rule_name: rule_file.split("/").last.gsub(".yaml", ""),
            pattern: item[:pattern],
            description: item[:description],
            matched_data: item[:matchData],
            severity: item[:severity].to_i,
            vulnerability_cat: item[:vulnerability_cat],
            subrule_id: item[:subrule_id],
            user_review_status: item[:manual_check],
          }
        ) if item[:matchData].flatten.any?
      end
    end
  end
end