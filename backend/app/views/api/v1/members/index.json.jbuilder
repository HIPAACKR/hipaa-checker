json.members do
  json.partial! 'row', collection: @users, as: :user

end
json.pagination do
  json.current_page @users.current_page
  json.next_page @users.next_page
  json.prev_page @users.previous_page
  json.total_pages @users.total_pages
  json.total_entries @users.total_entries
end