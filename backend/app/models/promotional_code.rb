class PromotionalCode < ApplicationRecord

  validates :code, presence: true, uniqueness: true
  validates :discount, presence: true
  validates :discount_type, presence: true
  validates :expire_date, presence: true
  validates :promotional_length, presence: true, numericality: { less_than_or_equal_to: 12 }
  validate :check_expire_date

  before_create :create_coupon_and_promotional_code_on_stripe

  def self.ransackable_associations(auth_object = nil)
    []
  end
  def self.ransackable_attributes(auth_object = nil)
    %w[code discount discount_type expiration_date created_at updated_at]
  end

  private
  def create_coupon_and_promotional_code_on_stripe
    coupon = Stripe::Coupon.create(
      currency: 'USD',
      percent_off: discount_type == 'percentage' ? discount : nil,
      amount_off: discount_type == 'fixed' ? (discount * 100).to_i : nil,
      duration: 'repeating', # Apply the discount for a set number of billing periods
      duration_in_months: self.promotional_length # Only required if duration is 'repeating'
    )
    promotion_code = Stripe::PromotionCode.create(
      coupon: coupon.id,
      code: self.code,
      restrictions: {
        first_time_transaction: false # Only allow first-time customers to use this promotion code
      }
    )
    self.stripe_coupon_id = coupon.id
  end

  def check_expire_date
    if self.expire_date.present? && self.expire_date < Date.today
      errors.add(:expire_date, "must be in the future")
    end
  end

end
