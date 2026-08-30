class AddMaxUploadQuotaToPlans < ActiveRecord::Migration[6.1]
  def change
    add_column :plans, :max_upload_quota, :integer, default: 0
  end
end
