json.user_upload do
  json.cache! @user_upload.file_wise_cache_key(params[:page]),  skip_digest: true, expires_in: 1.month do
    json.partial! 'row',          user_upload: @user_upload
    json.analyzed_results         @user_upload.reports_file_wise(@analyzed_results, params[:severity])
  end

  json.pagination do
    json.current_page @analyzed_results.current_page
    json.next_page @analyzed_results.next_page
    json.prev_page @analyzed_results.previous_page
    json.total_pages @analyzed_results.total_pages
    json.total_entries @analyzed_results.total_entries
  end
end