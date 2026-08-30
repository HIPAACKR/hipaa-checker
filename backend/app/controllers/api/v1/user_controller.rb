class Api::V1::UserController < ApiController

  def index
    @user = current_user
  end

  def update
    user = current_user
    if user.update(user_info)
      render json: user, status: 200
    else render json: { errors: user.errors.full_messages }, status: 422
    end
  end


  def destroy
    if current_user.destroy
      render json: {message: "User account was removed successfully"}
    else
      render json: {errors: ["There was a problem removing the account"]}
    end
  end

  private
  def user_info
    params.require(:user).permit(:first_name, :last_name, :phone_number)
  end


end
