require 'yaml' # or 'json' depending on your file format
namespace :db do
  desc "Populate severity, vulnerability_cat, and subrule_id from rule files"
  task populate_fields: :environment do
    puts "Populating fields for all records..."
    AnalyzedResult.where(vulnerability_cat: nil).find_each do |record|
      begin
        rule_file_name = record.rule_name
        description = record.description
        user_upload = record.user_upload
        type = user_upload.upload_type
        platform = user_upload.platform
        env = user_upload.environment

        is_healthcare = type == "Healthcare"
        is_app = env == "app"


        # Load the pattern file (YAML example)
        file_path = Rails.root.join("patterns", "#{pattern_path(is_healthcare,is_app,platform)}_cvss", "#{rule_file_name}.yaml")

        rule_data = YAML.load_file(file_path)

        matched_rule = rule_data.find do |rule|
          rule['description'] == description
        end


        if matched_rule
          # Extract the details
          subrule_id_found = matched_rule['id']
          vulnerability_impacts = matched_rule['vulnerability_impacts'] || []

          vulnerability_cat = vulnerability_impacts.map do |impact|
            HipaaRiskScoreCalculator::VULNERABILITIES.find do |vul|
              vul[:id] == impact["vulnerability_id"]
            end&.[](:name)
          end.compact.first

          severity_comp = vulnerability_impacts.map do |impact|
            HipaaRiskScoreCalculator::SEVERITY_LABELS[impact["severity"].to_sym]
          end.first

          # Update the record
          record.update_columns(
            severity: severity_comp,
            vulnerability_cat: vulnerability_cat,
            subrule_id: subrule_id_found
          )
          puts "Updated record ID #{record.id}: severity=#{severity_comp}, vulnerability_cat=#{vulnerability_cat}, subrule_id=#{subrule_id_found}"

        else
          puts "No matching rule found for record ID #{record.id} in file #{rule_file_name}"
        end

      rescue => e
        puts "Error processing record ID #{record.id}: #{e.message}"
      end

    end

  end
end

def pattern_path(is_healthcare , is_app, platform )
  path = ""
  if is_healthcare
    if is_app
      path = "released/android"
    else
      path = "released/#{platform}"
    end
  else
    path = "non_healthcare/#{platform}"
  end
  path
end
