json.user_upload do

  json.cache! @user_upload.rule_wise_cache_key(params[:page],current_user.id),  skip_digest: true, expires_in: 1.month do
    json.partial! "api/v2/user_uploads/row", user_upload: @user_upload
    json.analyzed_results         @user_upload.cvss_reports_as_hash(@rules)
  end

  json.pagination do
    json.current_page @rules.current_page
    json.next_page @rules.next_page
    json.prev_page @rules.previous_page
    json.total_pages @rules.total_pages
    json.total_entries @rules.total_entries
  end
end