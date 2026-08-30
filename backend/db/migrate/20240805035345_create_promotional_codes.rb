class CreatePromotionalCodes < ActiveRecord::Migration[6.1]
  def change
    create_table :promotional_codes do |t|
      t.string :code
      t.decimal :discount
      t.string :discount_type
      t.integer :promotional_length
      t.string :stripe_coupon_id

      t.timestamps
    end
  end
end
