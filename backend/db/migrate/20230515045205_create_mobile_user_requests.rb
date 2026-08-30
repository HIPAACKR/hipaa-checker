class CreateMobileUserRequests < ActiveRecord::Migration[6.1]
  def change
    create_table :mobile_user_requests do |t|
      t.integer :user_id
      t.string :package_name
      t.string :app_name

      t.timestamps
    end
  end
end
