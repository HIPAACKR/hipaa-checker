json.dashboard                    do
  json.user                       do
    json.id                       @user.id
    json.email                    @user.email
    json.first_name               @user.first_name
    json.last_name                @user.last_name
    json.app_checking_count       @user.app_checking_count
    json.created_at               @user.created_at
    json.is_accept_terms          @user.is_accept_terms
    json.user_uploads_count       @user.user_uploads.count
    json.total_high_risks         AnalyzedResult.high_risk.where(user_upload_id: @user.user_uploads.select(:id)).count
    json.total_medium_risks       AnalyzedResult.medium_risk.where(user_upload_id: @user.user_uploads.select(:id)).count
    json.total_low_risks          AnalyzedResult.low_risk.where(user_upload_id: @user.user_uploads.select(:id)).count
    json.total_no_risks           AnalyzedResult.no_risk.where(user_upload_id: @user.user_uploads.select(:id)).count
    json.user_uploads do
      json.partial! "api/v1/user_uploads/row", collection: @user.user_uploads.recent, as: :user_upload
    end
    json.organization @user.organization.is_individual? ? nil : @user.organization
  end
end
