namespace :analyzed_results do
  desc "Generates CSV from the analyzed results"
  task :to_csv => :environment do
    require 'csv'

    filename = Rails.root.join('tmp', "sttr_dataset.csv")
    headers = ["ID", "Description", "Code Segment", "Label", "Rule", "Platform", "Severity", "Web_or_App", "Is Compliant"]
    records = AnalyzedResult.includes(:user_upload).order(id: :asc)
    records = records.where({user_uploads: {platform: 'apk'}})
    i = 0
    n = records.count

    CSV.open(filename, "wb", write_headers: true, headers: headers, force_quotes: true) do |csv|
      records.find_each do |analyzed_result|
        i = i+1
        analyzed_result.matched_data.each do |result|
          code_snippet = JSON.parse(result[0])["codeSegment"] rescue nil
          hipaa_rule_name = UserUpload::HIPAA_RULES.find{|hipaa_rule| hipaa_rule[:rule_id] == analyzed_result.rule_name  }[:rule_name]
          if code_snippet.present?
            csv << [analyzed_result.id, analyzed_result.description, code_snippet, analyzed_result.rule_name,hipaa_rule_name,analyzed_result.user_upload.platform, analyzed_result.severity,analyzed_result.user_upload.environment, 1]
          end
        end
        puts "Progress: #{i} of #{n} -  #{((i/n.to_f) * 100).round(2)}% are done..."
      end
    end

    puts "done"
  end

  desc "Generates CSV from the analyzed results for ML"
  task :to_csv_ML => :environment do
    require 'csv'

    filename = Rails.root.join('tmp', "sttr_dataset.csv")
    headers = ["description", "user_upload_id", "CodeSegment", "rule_name", "severity", "vulnerability_cat", "subrule_id", "platform","environment"]
    records = AnalyzedResult.includes(:user_upload).order(id: :asc)
    records = records.where({user_uploads: {platform: 'apk'}})
    i = 0
    n = records.count

    CSV.open(filename, "wb", write_headers: true, headers: headers, force_quotes: true) do |csv|
      records.find_each do |analyzed_result|
        i = i+1
        analyzed_result.matched_data.each do |result|
          code_snippet = JSON.parse(result[0])["codeSegment"] rescue nil
          hipaa_rule_name = UserUpload::HIPAA_RULES.find{|hipaa_rule| hipaa_rule[:rule_id] == analyzed_result.rule_name  }[:rule_name]
          if code_snippet.present?
            csv << [analyzed_result.description, analyzed_result.user_upload_id, code_snippet, hipaa_rule_name,analyzed_result.severity, analyzed_result.vulnerability_cat, analyzed_result.subrule_id, analyzed_result.user_upload.platform, analyzed_result.user_upload.environment]
          end
        end
        puts "Progress: #{i} of #{n} -  #{((i/n.to_f) * 100).round(2)}% are done..."
      end
    end

    puts "done"
  end

end