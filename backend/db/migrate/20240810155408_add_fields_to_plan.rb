class AddFieldsToPlan < ActiveRecord::Migration[6.1]
  def change
    add_column :plans, :limit_per_day, :integer
    add_column :plans, :get_hipaa_score, :boolean, default: false
    add_column :plans, :get_vulnerability_breakdown, :boolean, default: false
    add_column :plans, :get_summerized_reports, :boolean, default: false
    add_column :plans, :get_specific_reports, :boolean, default: false
    add_column :plans, :view_source_code, :boolean, default: false
    add_column :plans, :fix_vulnerabilities, :boolean, default: false
    add_column :plans, :support_multiple_device, :boolean, default: false
    add_column :plans, :support_customer_service, :boolean, default: false
    add_column :plans, :support_dashboard_service, :boolean, default: false
    add_column :plans, :support_hipaa_experts, :boolean, default: false
  end
end
