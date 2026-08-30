json.user_uploads do
  json.partial! 'row', collection: @user_uploads, as: :user_upload
end