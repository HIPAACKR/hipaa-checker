class ApplicationController < ActionController::Base
  before_action :configure_permitted_parameters, if: :devise_controller?
  protect_from_forgery with: :null_session, if: -> { request.format.json? }

  respond_to do |format|
    format.html
    format.json
  end

  def authenticate_admin_user!
    unless current_user&.has_admin_access?
      redirect_to root_url, alert: "You are not allowed to access this page."
    end
  end

  def human_readable_time(secs)
    [[60, :seconds], [60, :minutes], [24, :hours], [Float::INFINITY, :days]].map do |count, name|
      next unless secs > 0

      secs, number = secs.divmod(count)
      "#{number.to_i} #{number == 1 ? name.to_s.delete_suffix('s') : name}" unless number.to_i == 0
    end.compact.reverse.join(', ')
  end

  def check_app_upload_quota
    return if current_user.has_role?(:super_admin)
    unless current_user.organization.present?
      redirect_to root_path, alert: "Please have your organization first to proceed."
      return
    end

    unless current_user.approved?
      redirect_to root_path, alert: "You need to be approved first"
      return
    end

    if current_user.organization.stripe_customer_id.blank?
      if current_user.is_admin?
        redirect_to new_subscription_path, alert: "Please subscribe to one of the subscription plans below."
      else
        redirect_to root_path, alert: "Your organization is not subscribed to any plan. Please contact organization admin."
      end
      return
    end
    if !current_user.is_allowed_to_upload?
      if current_user.organization.plan.free? && current_user.organization.subscription_expires_on.present? && current_user.organization.subscription_expires_on < Date.today
        redirect_to new_subscription_path, alert: "Your trial period for free plan is expired."
        return
      end
      if current_user.is_admin?
        redirect_to new_subscription_path, alert: "You have reached the maximum limit for the app checking! Please upgrade your plan."
      else
        redirect_to root_path, alert: "You have reached the maximum limit for the app checking! Please contact organization admin."
      end
    end
  end

  private

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [:first_name, :last_name, :organization_id, :organization_name, :is_accept_terms, :is_individual])
    devise_parameter_sanitizer.permit(:account_update, keys: [:first_name, :last_name, :organization_id, :organization_name])
  end
end
