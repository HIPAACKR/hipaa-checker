json.id                       user_upload.id
json.user_id                  user_upload.user_id
json.name                     user_upload.ios? && user_upload.project_name.present? ? user_upload.project_name.titleize : user_upload.file.filename.to_s.gsub('.apk', '').gsub('.zip', '').humanize
json.upload_type              user_upload.upload_type
json.platform                 user_upload.platform
json.status                   user_upload.status
json.environment              user_upload.environment
json.created_at               user_upload.created_at
json.project_name             user_upload.project_name
json.project_identifier       user_upload.project_identifier
json.high_risk_percentage     user_upload.high_risk_percentage.round(2)
json.medium_risk_percentage   user_upload.medium_risk_percentage.round(2)
json.low_risk_percentage      user_upload.low_risk_percentage.round(2)
json.no_risk_percentage       user_upload.no_risk_percentage.round(2)
json.hipaa_score              user_upload.hipaa_score
json.hipaa_score_d            user_upload.hipaa_score

