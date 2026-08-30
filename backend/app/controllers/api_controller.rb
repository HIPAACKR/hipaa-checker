class ApiController < ActionController::Base

  protect_from_forgery with: :null_session
  before_action :authenticate_user_from_jwt!

  #rescue_from StandardError, with: :render_500

  private

  def render_500(e)
    puts e.message
    puts e.backtrace
    render json: { errors: ["Internal Server Error"] }, status: :internal_server_error
  end

  def authenticate_user_from_jwt!
    new_api_request = AuthApi::AuthorizeApiRequest.new(request.headers)
    user_hash = new_api_request.call
    user = User.find_by(email: user_hash[:email]) if user_hash.present?
    if user && new_api_request.valid_token?(user.jwt_token)
      sign_in user, store: false
    else
      head :unauthorized
    end
  end

end
