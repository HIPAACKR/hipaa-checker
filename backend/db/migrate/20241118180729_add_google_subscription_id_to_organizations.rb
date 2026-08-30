class AddGoogleSubscriptionIdToOrganizations < ActiveRecord::Migration[6.1]
  def change
    add_column :organizations, :google_subscription_id, :string
  end
end
