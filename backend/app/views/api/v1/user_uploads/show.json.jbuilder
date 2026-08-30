json.user_upload do
  json.partial! 'api/v1/user_uploads/row',  :user_upload => @user_upload

  json.analyzed_results do
    json.partial! 'api/v1/analyzed_results/row', collection: @user_upload.analyzed_results, as: :analyzed_result
  end
end