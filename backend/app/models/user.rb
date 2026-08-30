class User < ApplicationRecord
  rolify
  devise :invitable, :two_factor_authenticatable, :two_factor_backupable,
         otp_backup_code_length: 10, otp_number_of_backup_codes: 10,
         :otp_secret_encryption_key => ENV['OTP_SECRET_KEY']

  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :invitable, :registerable, :confirmable, :lockable,
         :recoverable, :rememberable, :validatable,
         :trackable
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :invitable, :registerable, :confirmable, :lockable,
         :recoverable, :rememberable, :validatable,
         :trackable
  DEFAULT_APP_CHECKING_COUNT = 2
  JWT_TOKEN_VALID_HOURS = 4.hours
  has_many :user_uploads, dependent: :destroy
  has_many :github_uploads, dependent: :destroy
  has_many :mobile_user_requests, dependent: :destroy
  has_many :addresses, dependent: :destroy
  attr_accessor :otp_plain_backup_codes, :is_individual

  # belongs_to :organization, optional: false


  belongs_to :organization, optional: true
  has_many :user_upload_histories, dependent: :destroy

  #validate :organization_presence, on: [:create]

  def self.ransackable_associations(auth_object = nil)
    []
  end
  def self.ransackable_attributes(auth_object = nil)
    %w[email first_name last_name organization_id created_at]
  end


  scope :by_first_name, ->() { order(first_name: :asc)}
  scope :unlocked, ->() { where(locked_at: nil)}
  scope :regular, ->() { where(locked_at: nil, approved: true)}
  scope :approved, ->() { where(approved: true)}


  validates_presence_of :is_accept_terms, on: :create

  validates :first_name, :presence => true
  validates :last_name, :presence => true
  validates :organization_name, uniqueness: true,  if: -> { self.organization_name.present? }
  #validates :password, :presence => true
  #validates :password_confirmation, :presence => true
  
  

  serialize :otp_backup_codes, JSON



  after_create :send_sign_up_notification, :add_default_role
  before_create do
    self.app_checking_count = self.organization&.plan&.max_upload_quota.to_i
    self.jwt_token = self.generate_jwt_token if self.jwt_token.blank?
  end

  after_commit :assign_organization, on: :update

  after_update :send_user_approval_notification# , if: :approved_changed?

  def initialize(params={})
    super(params)
  end

  def add_default_role
    self.add_role :client
  end

  #TODO: No need to send approval email to client managers now.
  def send_sign_up_notification
    return
    client_managers = User.with_role(:client_manager)
    if client_managers.exists?
      UserMailer.send_user_signed_up_notification(client_managers,self).deliver_now
    end
  end

  def send_user_approval_notification
    if self.saved_change_to_approved? && self.approved?
      UserMailer.send_user_approval_notification(self).deliver_now
    end
  end

  # Generate an OTP secret it it does not already exist
  def generate_two_factor_secret_if_missing!
    return unless otp_secret.nil?
    update!(otp_secret: User.generate_otp_secret)
  end

  # Ensure that the user is prompted for their OTP when they login
  def enable_two_factor!
    update!(otp_required_for_login: true)
  end

  # Disable the use of OTP-based two-factor.
  def disable_two_factor!
    update!(
        otp_required_for_login: false,
        otp_secret: nil,
        otp_backup_codes: nil)
  end

  # URI for OTP two-factor QR code
  def two_factor_qr_code_uri
    issuer = ENV['OTP_2FA_ISSUER_NAME']
    label = [issuer, email].join(':')

    otp_provisioning_uri(label, issuer: issuer)
  end

  # Determine if backup codes have been generated
  def two_factor_backup_codes_generated?
    otp_backup_codes.present?
  end

  def active_for_authentication?
    !self.access_locked?
  end

  def inactive_message
    approved? ? super : :not_approved
  end

  def has_admin_access?
    self.is_admin?
  end

  def generate_jwt_token
    base_hash = {email: self.email}
    AuthApi::JsonWebToken.encode(base_hash, JWT_TOKEN_VALID_HOURS.from_now)
  end

  def jwt_token_valid?
    AuthApi::JsonWebToken.decode(self.jwt_token).present?
  end

  def assign_organization
    if self.approved?
      if self.organization_name.present? && self.organization_id.blank?
        new_organization = Organization.find_or_create_by(name: self.organization_name)
        self.update_column(:organization_id, new_organization.id)
      end
    end
  end

  def is_allowed_to_upload?
    return true if self.has_role?(:super_admin)
    if !self.approved?
      return false
    elsif self.organization.plan.present? && self.user_upload_histories.for_today.count < self.organization.plan.limit_per_day
      return self.organization.users.regular.count <= self.organization.plan.user_count
    else
      return false
    end
    false
  end

  def is_allowed_to_update_plan?(plan)
    if plan.free? && self.organization.stripe_customer_id.blank? && self.organization.stripe_subscription_id.blank?
      return true
    end
    self.organization.users.unlocked.count <= plan.user_count
  end

  def is_allowed_to_approve?
    return true if self.organization.individual?
    return self.organization.plan.user_count >= self.organization.users.approved.count
  end

  def is_allowed_to_invite?
    return false if self.organization.individual?
    return false if self.organization.plan.blank?
    return self.organization.plan.user_count >= self.organization.users.count
  end

  #TODO: remove this method if you want manual approval system back!
  def approved?
    true
  end

  def name
    "#{first_name} #{last_name}"
  end

  def purchase_free_subscription
    user = self
    return if user.organization&.stripe_subscription_id.present?
    free_plan = Plan.free.first
    return unless free_plan.present? && user.organization.present?

    price_id = free_plan.stripe_price_id
    if price_id.present?
      customer = Stripe::Customer.create(
        email: user.email,
        description: "Hipaachecker customer, user_id: #{user.id}, organization_id: #{user.organization.id}"
      )
      subscription = Stripe::Subscription.create(
        customer: customer.id,
        items: [{ price: price_id }]
      )
      user.organization.update_columns(
        plan_id: free_plan.id,
        stripe_subscription_id: subscription.id,
        stripe_customer_id: customer.id,
        subscription_expires_on: Time.at(subscription.current_period_end)
      )
    else
      user.organization.update_columns(
        plan_id: free_plan.id,
        subscription_expires_on: 7.days.from_now
      )
    end
  end

  def update_subscription_date
    return if self.organization&.stripe_subscription_id.present?
    stripe_subscription = Stripe::Subscription.retrieve(self.organization.stripe_subscription_id)
    self.organization.update_column(:stripe_subscription_id, Time.at(stripe_subscription.current_period_end).to_date)
  end

  def dashboard_cache_key
    "dashboard_user_#{self.id}"
  end

  def delete_dashboard_caches
    Rails.cache.delete("jbuilder/views/#{self.dashboard_cache_key}")
  end

  private

  def organization_presence  
    if self.is_individual.to_i == 0
      if self.organization_id.blank?
        errors.add(:organization, "must exist if the user is not an individual")
      else
        org = Organization.where.not(name: "individual").find_by(id: self.organization_id)
        if org.blank? 
          errors.add(:organization, "must exist if the user is not an individual")
        end
      end
    end
  end
end
