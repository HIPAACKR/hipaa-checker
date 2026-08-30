class AddProgressAndStatusToUserUploads < ActiveRecord::Migration[6.1]
  def change
    add_column :user_uploads, :extraction_progress, :integer
  end
end
