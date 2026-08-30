class AddProjectIdentifierToUserUploads < ActiveRecord::Migration[6.1]
  def change
    add_column :user_uploads, :project_identifier, :string
  end
end
