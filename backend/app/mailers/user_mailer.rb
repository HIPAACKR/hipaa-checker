class UserMailer < ApplicationMailer
  def send_user_signed_up_notification(client_managers, user)
    @user = user
    mail(to: client_managers.pluck(:email).join(","), subject: 'New user awaiting admin approval')
  end
  def send_user_approval_notification(user)
    @user = user
    mail(to: user.email, subject: 'You are approved to use hipacheker.health')
  end
end
