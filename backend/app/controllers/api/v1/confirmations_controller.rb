class Api::V1::ConfirmationsController < ActionController::Base

  protect_from_forgery with: :null_session
  skip_before_action :verify_authenticity_token

  respond_to :json

  def create
    token = params[:confirmation_token]

    if token.blank?
      render json: { error: 'Confirmation token is required' }, status: :unprocessable_entity
      return
    end

    user = User.confirm_by_token(token)

    if user.errors.empty?
      render json: { message: 'User confirmed successfully' }, status: :ok
    else
      render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
    end
  end

end
