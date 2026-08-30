class AddApkTypeToUserUploads < ActiveRecord::Migration[6.1]
  def change
    add_column :user_uploads, :apk_type, :string, default: 'Healthcare'
  end
end
