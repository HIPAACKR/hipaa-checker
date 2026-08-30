class AddOrganizationNameToUsers < ActiveRecord::Migration[6.1]
  def change
    add_column :users, :organization_name, :string
  end
end
