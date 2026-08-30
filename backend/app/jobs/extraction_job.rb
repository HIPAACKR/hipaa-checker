class ExtractionJob < ApplicationJob
  queue_as :extraction
  include Analytics

  def perform(user_upload_id)
    status = nil
    user_upload = UserUpload.find(user_upload_id)
    FileUtils.rm_rf("#{Rails.root}/extracted/#{user_upload.id}")
    if user_upload.app?
      if user_upload.ios?
        unzip_web_application(user_upload)
      else
        path = ActiveStorage::Blob.service.path_for(user_upload.file.key)
        filename = user_upload.file.filename.to_s.downcase
        puts "Path is #{filename}"
        if filename.end_with?('.zip')
          puts "ZIP FILE DETECTED"
          unzip_web_application(user_upload)
        else
          puts "APK FILE DETECTED"
          status = extract_apk(user_upload, path)
        end

      end
    elsif user_upload.web_application?
      unzip_web_application(user_upload)
    end
    if status.to_s == 'failed'
      puts "Failed!!!!!! HALT"
      if user_upload.extraction_progress >= 10
        puts "Failed!!!!!! BUT PROGRESSING WITH ERROR"
        user_upload.report_generating!
        generate_reports(user_upload)
      end


    else
      puts 'Success!!!!'
      user_upload.report_generating!
      generate_reports(user_upload)
    end
  end

  def generate_reports(user_upload)
    user_upload.analyzed_results.destroy_all
    extraction_filepath = "#{Rails.root}/extracted/#{user_upload.id}/java_sources"
    Dir.glob("#{Rails.root}/patterns/#{user_upload.pattern_path}/*").each do |file|
      ReportGenerationJob.perform_later(user_upload.id, file, extraction_filepath)
    end
  end

end