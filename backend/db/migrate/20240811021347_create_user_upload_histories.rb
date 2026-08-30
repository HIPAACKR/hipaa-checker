class CreateUserUploadHistories < ActiveRecord::Migration[6.1]
  def change
    create_table :user_upload_histories do |t|
      t.integer :user_id
      t.integer :user_upload_id

      t.timestamps
    end
  end
end
