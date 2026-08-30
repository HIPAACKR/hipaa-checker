class CreateLicenses < ActiveRecord::Migration[6.1]
  def change
    create_table :licenses do |t|
      t.integer :user_id
      t.text :license_key
      t.boolean :is_active
      t.datetime :expires_on

      t.timestamps
    end
    unless index_exists? :licenses, :license_key
      add_index :licenses, :license_key, unique: true
    end
  end
end
