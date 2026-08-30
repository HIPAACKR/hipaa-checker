class CreateAddresses < ActiveRecord::Migration[6.1]
  def change
    create_table :addresses do |t|
      t.references :user, null: false, foreign_key: true
      t.string :street_address
      t.string :city
      t.string :state
      t.string :country
      t.string :postal_code
      t.string :time_zone

      t.timestamps
    end
  end
end
