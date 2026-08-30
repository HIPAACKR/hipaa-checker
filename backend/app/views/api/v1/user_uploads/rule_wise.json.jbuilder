json.user_upload do
  json.partial! 'row', user_upload: @user_upload
  json.analyzed_results         @user_upload.reports_as_hash(@rules)
  json.pagination do
    json.current_page @rules.current_page
    json.next_page @rules.next_page
    json.prev_page @rules.previous_page
    json.total_pages @rules.total_pages
    json.total_entries @rules.total_entries
  end
end