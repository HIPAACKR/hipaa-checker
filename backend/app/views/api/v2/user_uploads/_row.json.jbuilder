
json.id                       user_upload.id
json.user_id                  user_upload.user_id
json.name                     user_upload.ios? && user_upload.project_name.present? ? user_upload.project_name.titleize : user_upload.file.filename.to_s.gsub('.apk', '').gsub('.zip', '').humanize
json.upload_type              user_upload.upload_type
json.platform                 user_upload.platform
json.environment              user_upload.environment
json.created_at               user_upload.created_at
json.project_name             user_upload.project_name
json.project_identifier       user_upload.project_identifier


calculator = HipaaRiskScoreCalculator.new(user_upload)
calculator.show_reports
json.severity_counts user_upload.dashboard_report_as_hash[:severity_counts]
json.hipaa_risk_scores        calculator.generate_score_summary




