class OrganizationMailer < ApplicationMailer
  def payment_failed_notification(organization)
    @organization = organization
    @organization_admin = @organization.users.where(is_admin: true).first || @organization.users.first
    @user = @organization_admin
    @super_admin = User.with_role(:super_admin).first
    mail(to: @user.email, cc: @super_admin.email, subject: 'Subscription payment failed.')
  end
end
