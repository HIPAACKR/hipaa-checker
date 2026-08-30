class AddOrganizationIdToUsers < ActiveRecord::Migration[6.1]
  def change
    add_column :users, :organization_id, :integer
    unless index_exists? :users, :organization_id
      add_index :users, :organization_id
    end
  end
end
