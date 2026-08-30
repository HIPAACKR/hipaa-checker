class CreatePlans < ActiveRecord::Migration[6.1]
  def change
    create_table :plans do |t|
      t.string :stripe_plan_id
      t.string :name
      t.decimal :price
      t.string :interval
      t.integer :user_count
      t.boolean :is_active, default: false

      t.timestamps
    end
  end
end
