namespace :user do
  desc "Updates plan to free for all organizations who have not stripe customer yet"
  task :subscribe_to_free_plan => :environment do
    users = User.includes(:organization).where({organizations: {stripe_subscription_id: nil}})
    puts users.to_sql
    n = users.count
    i = 0
    users.find_each do |user|
      i += 1
      user.purchase_free_subscription
      puts "Processed for #{user.email}, Progress: #{(i/n.to_f).round(2) * 100}%..."
    end
  end

  desc "Fix stripe customer"
  task :fix_stripe_customer => :environment do
    users = User.includes(:organization)
    n = users.count
    i = 0
    users.find_each do |user|
      i += 1
      if user.organization&.stripe_subscription_id.present?
        stripe_subscription = Stripe::Subscription.retrieve(user.organization.stripe_subscription_id)
        if user.organization&.stripe_customer_id != stripe_subscription.customer
          user.organization.update_column(:stripe_customer_id, stripe_subscription.customer)
        end
      end
      puts "Processed for #{user.email}, Progress: #{(i/n.to_f).round(2) * 100}%..."
    end
  end
end