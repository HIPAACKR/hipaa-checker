class License < ApplicationRecord

  belongs_to :user
  has_many :license_logs
  validates :user_id, presence: true
  validates :license_key, presence: true, uniqueness: { case_sensitive: true }

  before_validation :generate_unique_license_key

  private

  def generate_unique_license_key
    self.license_key ||= SecureRandom.hex(128)
    while License.exists?(license_key: self.license_key)
      self.license_key = SecureRandom.hex(128)
    end
  end

end
