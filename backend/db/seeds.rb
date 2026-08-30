def create_free_pan
  product = Stripe::Product.create(name: 'Free')
  plan = Stripe::Plan.create(
    {
      amount: 0 * 100,
      currency: 'usd',
      interval: 'month',
      product: product.id,
    }
  )
  Plan.create(
    {
      "stripe_plan_id" => plan.id,
      "name"=>"Free",
      "price"=>0,
      "interval"=>"month",
      "user_count" => 1,
      "is_active"=> true,
      "max_upload_quota" => 2,
      "limit_per_day"=>2,
      "get_hipaa_score"=>true,
      "get_vulnerability_breakdown"=>true,
      "get_summerized_reports"=>true,
      "get_specific_reports"=>true,
      "view_source_code"=>true,
      "fix_vulnerabilities"=>true,
      "support_multiple_device"=>true,
      "support_customer_service"=>true,
      "support_dashboard_service"=>true,
      "support_hipaa_experts"=>true
    }
  )
end


create_free_pan

# Super Admin details
super_admin_email = 'admin@example.com'
super_admin_password = 'SecurePassword123'
super_admin_first_name = 'Admin'
super_admin_last_name = 'User'

# Check if the user exists; if not, create one
user = User.find_or_initialize_by(email: super_admin_email)
user.assign_attributes(
  first_name: super_admin_first_name,
  last_name: super_admin_last_name,
  password: super_admin_password,
  password_confirmation: super_admin_password,
  is_accept_terms: true,
  is_admin: true,
  approved: true,
  confirmed_at: Time.now,
  )

if user.save
  user.add_role(:super_admin) # Assign the 'super_admin' role
  puts "Super admin user created and assigned role: #{super_admin_email}"

  user.organization = Organization.create(
    name: "individual", is_individual: true,
    subscription_expires_on: 10.years.from_now,
    plan_id: Plan.free.first.id
  )
  user.save
end



