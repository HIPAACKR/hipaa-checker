# This file runs on every container start (see docker-compose.yml's backend
# command), so everything here must be idempotent - safe to run repeatedly
# without creating duplicates or erroring on records that already exist.

stripe_configured = ENV['STRIPE_SECRET_KEY'].present? && !ENV['STRIPE_SECRET_KEY'].to_s.include?('your_key')

# Plan#create_plan_in_stripe calls the real Stripe API on creation. Skip it
# when Stripe isn't configured (e.g. local/dev) so seeding doesn't crash.
Plan.skip_callback(:create, :after, :create_plan_in_stripe) unless stripe_configured

free_plan = Plan.find_or_create_by!(name: 'Free', organization_id: nil) do |p|
  p.price = 0
  p.interval = 'month'
  p.user_count = 1
  p.is_active = true
  p.max_upload_quota = 2
  p.limit_per_day = 2
  p.can_use_doc_scan = true
  p.can_use_sast = true
  p.can_use_dast = true
end

# Super Admin details
super_admin_email = 'admin@example.com'
super_admin_password = 'SecurePassword123'

user = User.find_or_initialize_by(email: super_admin_email)
user.assign_attributes(
  first_name: 'Admin',
  last_name: 'User',
  password: super_admin_password,
  password_confirmation: super_admin_password,
  is_accept_terms: true,
  is_admin: true,
  approved: true
)

if user.save
  user.add_role(:super_admin) unless user.has_role?(:super_admin)

  if user.organization.blank?
    org = Organization.create!(
      name: 'individual',
      is_individual: true,
      subscription_expires_on: 10.years.from_now,
      plan_id: free_plan.id
    )
    user.update!(organization: org)
  end

  puts "Super admin ready: #{super_admin_email} / #{super_admin_password}"
else
  puts "Super admin FAILED: #{user.errors.full_messages}"
end
