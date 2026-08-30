class AddEnvironmentToUserUploads < ActiveRecord::Migration[6.1]
  def change
    add_column :user_uploads, :environment, :string, default: 'app'
  end
end
