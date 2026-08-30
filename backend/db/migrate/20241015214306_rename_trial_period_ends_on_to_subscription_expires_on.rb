class RenameTrialPeriodEndsOnToSubscriptionExpiresOn < ActiveRecord::Migration[6.1]
  def change
    rename_column :organizations, :trial_period_ends_on, :subscription_expires_on
  end
end
