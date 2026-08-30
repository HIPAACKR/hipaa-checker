class AddCompletedRulesCountToUserUploads < ActiveRecord::Migration[6.1]
  def change
    add_column :user_uploads, :completed_rules_count, :integer, default: 0
  end
end
