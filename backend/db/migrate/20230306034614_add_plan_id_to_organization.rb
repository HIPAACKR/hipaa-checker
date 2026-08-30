class AddPlanIdToOrganization < ActiveRecord::Migration[6.1]
  def change
    add_column :organizations, :plan_id, :integer
  end
end
