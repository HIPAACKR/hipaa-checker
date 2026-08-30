class AddRiskCountFieldsToUserUploads < ActiveRecord::Migration[6.1]
  def change
    add_column :user_uploads, :critical_risk, :integer
    add_column :user_uploads, :high_risk, :integer
    add_column :user_uploads, :medium_risk, :integer
    add_column :user_uploads, :low_risk, :integer
    add_column :user_uploads, :no_risk, :integer
  end
end
