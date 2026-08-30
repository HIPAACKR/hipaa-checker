class AddPromotionalCodeIdToOrganizations < ActiveRecord::Migration[6.1]
  def change
    add_column :organizations, :promotional_code_id, :integer
  end
end
