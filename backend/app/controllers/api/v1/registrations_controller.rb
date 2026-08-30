class Api::V1::RegistrationsController < ActionController::Base
  
  protect_from_forgery with: :null_session
  skip_before_action :verify_authenticity_token
  
  respond_to :json

  def create
    if user_params[:organization_name].blank?
      organization = Organization.create!(
        name: "individual",
        is_individual: true,
        google_subscription_id: params[:google_subscription_id]
      )
      user = User.new(user_params.merge(organization_id: organization.id))
      user.is_admin = true
    else
      user = User.new(user_params)
    end
    user.email = user.email.downcase.strip
    if user.save
      if user.organization.blank? && user.organization_name.present?
        new_organization = Organization.find_or_create_by(name: user.organization_name)
        user.update_columns(organization_id: new_organization.id, is_admin: true)
      end
      if user.reload.organization.present?
        if params[:google_subscription_id].present?
          google_plan = Plan.google_subscription.first # currently we have one google subscription created.
          user.organization.update_columns(
            {
              google_subscription_id: params[:google_subscription_id],
              plan_id: google_plan.id
            }
          )
        end
        subscribe_to_free_plan(user)
      end
      render json: { message: 'User Registration successfull' }, status: :ok
    else
      render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
    end  
  end

  private
  def subscribe_to_free_plan(user)
    user.purchase_free_subscription
  end

  def user_params
    params.require(:user).permit(
      :first_name, :last_name, :email, :password, :password_confirmation,
      :is_accept_terms, :is_individual, :organization_name
    )
  end

end
