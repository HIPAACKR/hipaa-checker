class AddTrialPeriodEndsOnToOrganization < ActiveRecord::Migration[6.1]
  def change
    add_column :organizations, :trial_period_ends_on, :datetime
  end
end
