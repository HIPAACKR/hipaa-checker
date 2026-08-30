class CreateGithubUploads < ActiveRecord::Migration[6.1]
  def change
    create_table :github_uploads do |t|
      t.integer :user_id
      t.text :github_url
      t.integer :user_upload_id
      t.string :platform

      t.timestamps
    end
  end
end
