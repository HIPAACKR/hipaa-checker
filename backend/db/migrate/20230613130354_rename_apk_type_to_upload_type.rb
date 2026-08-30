class RenameApkTypeToUploadType < ActiveRecord::Migration[6.1]
  def change
    rename_column :user_uploads, :apk_type, :upload_type
  end
end
