class AddRiskCountsToUsers < ActiveRecord::Migration[6.1]
  def change
    add_column :users, :total_critical_risks, :integer
    add_column :users, :total_high_risks, :integer
    add_column :users, :total_medium_risks, :integer
    add_column :users, :total_low_risks, :integer
    add_column :users, :total_no_risks, :integer
  end
end
