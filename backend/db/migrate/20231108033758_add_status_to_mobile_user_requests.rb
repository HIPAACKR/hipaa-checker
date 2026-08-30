class AddStatusToMobileUserRequests < ActiveRecord::Migration[6.1]
  def change
    add_column :mobile_user_requests, :status, :integer, default: 0
  end
end
