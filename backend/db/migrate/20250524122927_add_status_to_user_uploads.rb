class AddStatusToUserUploads < ActiveRecord::Migration[6.1]
  def change
    add_column :user_uploads, :status, :integer, default: 0
  end
end
