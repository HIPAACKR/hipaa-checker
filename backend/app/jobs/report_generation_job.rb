class ReportGenerationJob < ApplicationJob
  queue_as :report_generation
  include Analytics

  def perform(user_upload_id, file, extraction_filepath)
    user_upload = UserUpload.find(user_upload_id)
    android_rules = YAML.load_file(file)
    puts "Staring traverse and analysis... "
    traverse(user_upload, extraction_filepath, android_rules, file)
    puts "Traverse and analysis ended ... "
    user_upload.increment!(:completed_rules_count) # Thread safe as it runs in DB layer
    if user_upload.finished_generating_report?
      user_upload.report_generated!
      #Trigger upload codebase job after successful report generation
      UploadCodebaseJob.perform_later(user_upload.id)
      puts "All reports generated — UploadCodebaseJob enqueued!"
    end
  end
end