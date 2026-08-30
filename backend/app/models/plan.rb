class Plan < ApplicationRecord
  has_many :organizations

  validates :name, presence: true, uniqueness: { scope: :organization_id }
  validates :price, presence: true, numericality: { greater_than_or_equal_to: 0 }
  validates :user_count, presence: true, numericality: { greater_than_or_equal_to: 0 }

  scope :active, ->() { where(is_active: true)}
  scope :sorted_by_price, ->() { order(price: :asc)}
  scope :global, ->() { where(organization_id: nil)}
  scope :for_individual, ->() { where(name: ["Free", "Individual"])}
  scope :not_google_subscription, ->() { global.where.not(name: GOOGLE_SUBSCRIPTION)}
  scope :google_subscription, ->() { where(name: GOOGLE_SUBSCRIPTION)}
  scope :free, ->() { global.where(price: 0, interval: 'month', name: 'Free')}

  GOOGLE_SUBSCRIPTION = "Google Subscription"

  def as_json(options = {})
    json = super(options)
    json['name'] = self.name.to_s.split("_").first
    legacy_feature_flags.each { |key, value| json[key.to_s] = value }
    json['stripe_plan_id'] = stripe_price_id
    json.except(
      'stripe_product_id', 'stripe_monthly_price_id', 'stripe_yearly_price_id',
      'plan_tier', 'organization_id', 'price_yearly',
      'can_use_doc_scan', 'can_use_sast', 'can_use_dast'
    )
  end

  def self.ransackable_associations(auth_object = nil)
    []
  end
  def self.ransackable_attributes(auth_object = nil)
    %w[name created_at updated_at]
  end

  after_initialize do |plan|
    plan.interval = 'month' if plan.interval.blank?
  end

  after_create :create_plan_in_stripe

  def stripe_price_id
    if interval == 'year'
      stripe_yearly_price_id.presence || stripe_monthly_price_id
    else
      stripe_monthly_price_id.presence || stripe_yearly_price_id
    end
  end
  alias_method :stripe_plan_id, :stripe_price_id

  def get_hipaa_score
    !!can_use_doc_scan
  end

  def get_summerized_reports
    !!can_use_doc_scan
  end

  def get_specific_reports
    !!can_use_doc_scan
  end

  def get_vulnerability_breakdown
    !!can_use_dast
  end

  def view_source_code
    !!can_use_sast
  end

  def fix_vulnerabilities
    !!can_use_sast
  end

  def support_multiple_device
    paid_or_any_engine?
  end

  def support_customer_service
    paid_or_any_engine?
  end

  def support_dashboard_service
    paid_or_any_engine?
  end

  def support_hipaa_experts
    paid_or_any_engine?
  end

  def free?
    self.price.to_f.zero?
  end

  def paid?
    self.price.to_f > 0
  end

  def google_subscription?
    self.name == GOOGLE_SUBSCRIPTION
  end

  private

  def paid_or_any_engine?
    paid? || can_use_doc_scan || can_use_sast || can_use_dast
  end

  def legacy_feature_flags
    {
      get_hipaa_score: get_hipaa_score,
      get_vulnerability_breakdown: get_vulnerability_breakdown,
      get_summerized_reports: get_summerized_reports,
      get_specific_reports: get_specific_reports,
      view_source_code: view_source_code,
      fix_vulnerabilities: fix_vulnerabilities,
      support_multiple_device: support_multiple_device,
      support_customer_service: support_customer_service,
      support_dashboard_service: support_dashboard_service,
      support_hipaa_experts: support_hipaa_experts
    }
  end

  def create_plan_in_stripe
    return if self.google_subscription?
    product = Stripe::Product.create(name: self.name)
    stripe_price = Stripe::Price.create(
      unit_amount: (self.price.to_i * 100),
      currency: 'usd',
      recurring: { interval: interval.presence || 'month' },
      product: product.id
    )
    attrs = { stripe_product_id: product.id }
    if interval == 'year'
      attrs[:stripe_yearly_price_id] = stripe_price.id
    else
      attrs[:stripe_monthly_price_id] = stripe_price.id
    end
    update_columns(attrs)
  end
end
