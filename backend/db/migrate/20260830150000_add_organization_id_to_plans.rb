class AddOrganizationIdToPlans < ActiveRecord::Migration[6.1]
  def change
    add_column :plans, :organization_id, :bigint
    add_index :plans, :organization_id
  end
end
