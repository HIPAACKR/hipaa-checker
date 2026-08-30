class CreateLicenseLogs < ActiveRecord::Migration[6.1]
  def change
    create_table :license_logs do |t|
      t.integer :license_id
      t.string :ip_address
      t.text :user_agent
      t.string :hostname
      t.string :request_method
      t.string :request_protocol

      t.timestamps
    end
  end
end
