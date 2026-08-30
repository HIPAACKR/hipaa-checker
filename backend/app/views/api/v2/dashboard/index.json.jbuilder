json.dashboard do
  json.user do
    json.id                       @user.id
    json.email                    @user.email
    json.first_name               @user.first_name
    json.last_name                @user.last_name
    json.app_checking_count       @user.app_checking_count
    json.created_at               @user.created_at
    json.is_accept_terms          @user.is_accept_terms
    json.user_uploads_count       @user.user_uploads.count

    cache_key = ["v1", @user.cache_key_with_version, params[:page]]

    json.cache! cache_key, skip_digest: true, expires_in: 1.month do
      # TotalHighRiskCount
      json.total_critical_risks @user.user_uploads.sum(:critical_risk)
      json.total_high_risks     @user.user_uploads.sum(:high_risk)
      json.total_medium_risks   @user.user_uploads.sum(:medium_risk)
      json.total_low_risks      @user.user_uploads.sum(:low_risk)
      json.total_no_risks       @user.user_uploads.sum(:no_risk)



      # User uploads
      json.user_uploads do
        json.partial! "api/v2/dashboard/row",
                      collection: @user_uploads,
                      as: :user_upload
      end
    end

    json.organization @user.organization.is_individual? ? nil : @user.organization

    json.pagination do
      json.current_page @user_uploads.current_page
      json.next_page @user_uploads.next_page
      json.prev_page @user_uploads.previous_page
      json.total_pages @user_uploads.total_pages
      json.total_entries @user_uploads.total_entries
    end
  end
end
