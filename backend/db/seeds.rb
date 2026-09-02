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

# Suggestions data pulled from the live server. Generate this file with
# script/export_suggestions.rb - see that file for instructions. Safe to
# skip when absent (e.g. a contributor without access to the export).
suggestions_path = Rails.root.join('db', 'seed_data', 'suggestions.json')
if File.exist?(suggestions_path)
  suggestions = JSON.parse(File.read(suggestions_path))
  imported = 0

  suggestions.each do |attrs|
    suggestion = Suggestion.find_or_initialize_by(
      platform: attrs['platform'],
      rule_id: attrs['rule_id'],
      subrule_id: attrs['subrule_id']
    )
    suggestion.assign_attributes(
      severity: attrs['severity'],
      vulnerability_category: attrs['vulnerability_category'],
      dependent_subrule: attrs['dependent_subrule'],
      patterns: attrs['patterns']
    )
    suggestion.comment = attrs['comment'] if attrs['comment'].present?
    suggestion.code_snippet = attrs['code_snippet'] if attrs['code_snippet'].present?
    suggestion.expectations_from_hipaa = attrs['expectations_from_hipaa'] if attrs['expectations_from_hipaa'].present?

    imported += 1 if suggestion.save
  end

  puts "Suggestions seeded: #{imported}/#{suggestions.size}"
end
