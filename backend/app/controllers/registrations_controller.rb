class RegistrationsController < Devise::RegistrationsController
  protect_from_forgery with: :null_session, if: -> { request.format.json? }
  skip_before_action :verify_authenticity_token, if: -> { request.format.json? }

  respond_to :json

  def create
    if verify_recaptcha(action: 'user_registration')
      super
    else
      redirect_to root_url, alert: "You are not allowed to register!"
    end
  end

  def respond_with(resource, _opts = {})
    if request.format.json?
      if resource.persisted?
        return render json: { success: true }, status: :created
      else
        super
      end
    else
      super
    end
  end
end
