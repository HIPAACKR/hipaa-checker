class SessionsController < Devise::SessionsController
  include AuthenticateWithOtpTwoFactor

  prepend_before_action :authenticate_with_otp_two_factor,
                        if: -> { action_name == 'create' && otp_two_factor_enabled? }

  protect_from_forgery with: :exception, prepend: true, except: :destroy
  protect_from_forgery with: :null_session, if: -> { request.format.json? }
  skip_before_action :verify_authenticity_token, if: -> { request.format.json? }


  respond_to do |format|
    format.html
    format.json
  end

  private

  def respond_with(resource, _opts = {})
    if request.format.json?
      if resource&.approved
        token = AuthApi::JsonWebToken.encode({ email: resource.email })
        resource.update_attribute(:jwt_token, token)
        return render json: { token: token, user: {email: resource.email, first_name: resource.first_name, last_name: resource.last_name } }, status: :ok if token
      end
      head :unauthorized
    else
      super
    end
  end

  def respond_to_on_destroy
    if request.format.json?
      new_api_request = AuthApi::AuthorizeApiRequest.new(request.headers)
      user_hash = new_api_request.call
      user = User.find_by(email: user_hash[:email]) if user_hash.present?
      if user && new_api_request.valid_token?(user.jwt_token)
        user.update_attribute(:jwt_token, nil)
        head :ok
      else
        head :unauthorized
      end
    else
      super
    end
  end

end