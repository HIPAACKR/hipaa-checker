class Api::V1::PasswordsController < ApiController
  skip_before_action :verify_authenticity_token
  skip_before_action :authenticate_user_from_jwt!, only: [:create]
  respond_to :json

  def create
    user = User.find_by_email(params[:email])
    # raise user.inspect
    if user.present?
      user.send_reset_password_instructions
      render json: { message: 'Password reset instructions sent' }, status: :ok

    else
      render json: { errors: ['Email not found'] }, status: :unprocessable_entity
    end
  end


  def update
    user = User.with_reset_password_token(params[:id])

    if !user.blank? && user.reset_password_token.present?
      user.password = params[:password]
      user.password_confirmation = params[:password_confirmation]
      if user.valid?
        user.save()
        render json: { message: 'Password has been reset' }, status: :ok
      else
        render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
      end
    else
      render json: { errors: ['Token is not valid'] }, status: :unprocessable_entity
    end

  end

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
