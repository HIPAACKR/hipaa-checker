class MoveStripeFromUserToOrganization < ActiveRecord::Migration[6.1]
  def change
    remove_column :users, :stripe_subscription_id, :string
    remove_column :users, :stripe_customer_id, :string
    add_column :organizations, :stripe_subscription_id, :string
    add_column :organizations, :stripe_customer_id, :string
  end
end
