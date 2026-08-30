class CreatePatterns < ActiveRecord::Migration[6.1]
  def change
    create_table :patterns do |t|
      t.references :user_upload, null: false, foreign_key: true
      t.string :body, null: false

      t.timestamps
    end
  end
end
