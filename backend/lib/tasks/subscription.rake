namespace :subscription do
  desc "Updates subscription plan for all users"
  task :update_date => :environment do
    users = User.includes(:organization).where.not({organizations: {stripe_subscription_id: nil}})
    n = users.count
    i = 0
    users.find_each do |user|
      i += 1
      user.update_subscription_date
      puts "Processed for #{user.email}, Progress: #{(i/n.to_f).round(2) * 100}%..."
    end
  end
end