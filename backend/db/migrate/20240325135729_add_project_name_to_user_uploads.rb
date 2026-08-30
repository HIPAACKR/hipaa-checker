class AddProjectNameToUserUploads < ActiveRecord::Migration[6.1]
  def change
    add_column :user_uploads, :project_name, :string
  end
end
