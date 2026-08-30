class MobileUserRequest < ApplicationRecord

  enum status: { pending: 0, in_progress: 1, completed: 2, failed: 3 }
  attr_accessor :file

  belongs_to :user
  belongs_to :user_upload, optional: true

  validates :app_name, presence: true
  validates :package_name, presence: true, uniqueness: true
  validates :user_id, presence: true


  scope :recent, -> { order(created_at: :desc) }
  scope :sorted, -> { order(app_name: :asc) }

  def reports
    return self.user_upload.reports_as_hash if self.user_upload.present?
    []
  end

end
