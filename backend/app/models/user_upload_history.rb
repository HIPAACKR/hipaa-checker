class UserUploadHistory < ApplicationRecord
  belongs_to :user
  belongs_to :user_upload
  scope :for_today, ->() { where("created_at >= ? AND created_at < ?", Time.zone.today.beginning_of_day, Time.zone.today.end_of_day) }

end
