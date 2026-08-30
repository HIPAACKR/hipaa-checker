class AddRiskFieldsToUserUploads < ActiveRecord::Migration[6.1]
  def change
    add_column :user_uploads, :total_risk, :float
    add_column :user_uploads, :total_risk_mitigation, :float

    add_column :user_uploads, :iat_total_risk, :float
    add_column :user_uploads, :iat_risk_mitigation, :float

    add_column :user_uploads, :ids_total_risk, :float
    add_column :user_uploads, :ids_risk_mitigation, :float

    add_column :user_uploads, :ia_total_risk, :float
    add_column :user_uploads, :ia_risk_mitigation, :float

    add_column :user_uploads, :inc_total_risk, :float
    add_column :user_uploads, :inc_risk_mitigation, :float
  end
end
