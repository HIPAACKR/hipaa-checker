class AddPlatformToUserUpload < ActiveRecord::Migration[6.1]
  def change
    add_column :user_uploads, :platform, :string, default: 'apk'
  end
end
