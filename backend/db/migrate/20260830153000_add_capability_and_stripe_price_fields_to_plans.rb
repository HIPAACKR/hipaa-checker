class AddCapabilityAndStripePriceFieldsToPlans < ActiveRecord::Migration[6.1]
  def change
    add_column :plans, :can_use_doc_scan, :boolean, default: false
    add_column :plans, :can_use_sast, :boolean, default: false
    add_column :plans, :can_use_dast, :boolean, default: false
    add_column :plans, :stripe_product_id, :string
    add_column :plans, :stripe_monthly_price_id, :string
    add_column :plans, :stripe_yearly_price_id, :string
  end
end
