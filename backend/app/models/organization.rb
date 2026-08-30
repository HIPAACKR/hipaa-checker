class Organization < ApplicationRecord
  INDIVIDUAL = 'individual'
  has_many :users
  belongs_to :plan, optional: true
  belongs_to :promotional_code, optional: true

  scope :sorted, ->() { order(name: :asc) }
  scope :not_individual, ->() { where(is_individual:  false) }

  validates :name, presence: true, uniqueness: true, if: Proc.new{|organization| organization.name.present? && organization.name != Organization::INDIVIDUAL }

  def self.ransackable_associations(auth_object = nil)
    []
  end
  def self.ransackable_attributes(auth_object = nil)
    %w[name created_at]
  end

  def admin_users
    self.users.where(is_admin: true)
  end

  def subscribe_to_free_plan

  end

  def individual?
    self.name == INDIVIDUAL
  end

  def update_necessary_attributes(plan, subscription)
    update_columns(plan_id: plan.id, stripe_subscription_id: subscription.id)
    users.find_each do |user|
      app_checking_count = 0
      if plan.max_upload_quota >= user.user_uploads.count
        app_checking_count = plan.max_upload_quota - user.user_uploads.count
      end
      user.update_columns(app_checking_count: app_checking_count)
    end
  end

end
