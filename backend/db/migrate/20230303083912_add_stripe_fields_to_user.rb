class AddStripeFieldsToUser < ActiveRecord::Migration[6.1]
  def change
    add_column :users, :stripe_customer_id, :string, default: nil
    add_column :users, :stripe_subscription_id, :string, default: nil
  end
end
