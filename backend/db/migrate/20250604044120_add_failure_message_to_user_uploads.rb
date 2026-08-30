class AddFailureMessageToUserUploads < ActiveRecord::Migration[6.1]
  def change
    add_column :user_uploads, :failure_message, :text
  end
end
