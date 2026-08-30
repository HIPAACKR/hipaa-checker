class UserUploadMailer < ApplicationMailer
  include Rails.application.routes.url_helpers
  def user_uploaded_email(user_upload)
    @user_upload = user_upload
    mail(to: @user_upload.user.email, subject: 'The report is ready to check')
  end
end
