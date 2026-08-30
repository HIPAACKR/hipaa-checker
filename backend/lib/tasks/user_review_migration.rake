namespace :data do
  desc "Fix NULL user_review_status for existing analyzed results"
  task fix_review_status: :environment do
    puts "Starting data migration..."

    # Counters for the final report
    stats = { success: 0, errors: 0, skipped: 0 }
    error_log = []

    UserUpload.find_each do |upload|
      platform = (upload.platform == "apk") ? "android" : upload.platform

      # We only care about results where the status is currently nil
      upload.analyzed_results.find_each do |analyzed_result|
        begin
          rule_name = analyzed_result.rule_name
          subrule_id = analyzed_result.subrule_id

          file_path = "#{Rails.root}/patterns/released/#{platform}/#{rule_name}.yaml"

          # 1. Check if file exists before trying to open it
          if File.exist?(file_path)
            sub_rules = YAML.load_file(file_path)
            matching_sub_rule = sub_rules.find { |sr| sr["id"] == subrule_id }

            if matching_sub_rule
              status = (matching_sub_rule["manual_check"] == true) ? 't' : 'f'
              analyzed_result.update_columns(user_review_status: status)
              stats[:success] += 1
            else
              stats[:skipped] += 1 # Rule ID not found in YAML
            end
          else
            error_log << "Missing File: #{file_path} (Result ID: #{analyzed_result.id})"
            stats[:errors] += 1
          end

        rescue => e
          # 2. Rescue any unexpected errors (YAML parse error, DB lock, etc.)
          error_log << "Error on Result ##{analyzed_result.id}: #{e.message}"
          stats[:errors] += 1
        end
      end
    end

    # --- FINAL REPORT ---
    puts "\n" + "="*30
    puts "MIGRATION FINISHED"
    puts "Successfully Updated: #{stats[:success]}"
    puts "Skipped (No Match):  #{stats[:skipped]}"
    puts "Errors Encountered:  #{stats[:errors]}"

    if error_log.any?
      puts "\nERROR DETAILS:"
      error_log.each { |log| puts "- #{log}" }
    end
    puts "="*30
  end
end