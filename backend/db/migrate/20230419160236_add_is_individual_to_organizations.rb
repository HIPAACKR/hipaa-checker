class AddIsIndividualToOrganizations < ActiveRecord::Migration[6.1]
  def change
    add_column :organizations, :is_individual, :boolean, default: false
  end
end
