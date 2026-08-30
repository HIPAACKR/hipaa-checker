namespace :organization do
  desc "Updates plan to free for all organizations who have not stripe customer yet"
  task :update_to_free_plan => :environment do
    Organization.find_each do |organization|
      organization.subscribe_to_free_plan
    end
  end
end