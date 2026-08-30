class AddAppCheckingCountToUsers < ActiveRecord::Migration[6.1]
  def change
    add_column :users, :app_checking_count, :integer, default: 0
  end
end
