namespace :user_uploads do
  desc "Recalculate severity counts for all user uploads"
  task update_severity_counts: :environment do
    puts "Starting severity count update..."

    UserUpload.find_each do |user_upload|
      begin
        puts "Processing UserUpload ID: #{user_upload.id}"
        user_upload.count_severity(UserUpload::HIPAA_RULES.dup)
      rescue => e
        puts "Error processing UserUpload ID: #{user_upload.id} - #{e.message}"
      end
    end

    puts "Severity count update completed."
  end
end