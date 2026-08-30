class Api::V1::PasswordsController < ApiController
  skip_before_action :verify_authenticity_token
  respond_to :json

  def update_password
    user = current_user
    if user.present? && user.valid_password?(params[:old_password])
      user.password = params[:new_password]
      user.password_confirmation = params[:password_confirmation]
      if user.save
        render json: {message: "password has been updated"}, status: :ok
      else
        render json: {errors: user.errors.full_messages }, status: :unprocessable_entity
      end
    else
      render json: {errors: ["Incorrect Password"] }, status: :not_found
    end

  end

end
