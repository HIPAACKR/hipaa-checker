class AddUserUploadIdToMobileUserRequests < ActiveRecord::Migration[6.1]
  def change
    add_column :mobile_user_requests, :user_upload_id, :integer
  end
end
