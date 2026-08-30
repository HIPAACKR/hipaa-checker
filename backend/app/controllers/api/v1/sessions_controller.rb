require 'json'
class Api::V1::SessionsController < ActionController::Base

  protect_from_forgery with: :null_session
  skip_before_action :verify_authenticity_token

  respond_to :json

  def create
    user = User.where("LOWER(email) = ?", params[:email].to_s.downcase.strip).first
    if user && user.valid_password?(params[:password])
      unless user.approved?
        render json: {errors: ["You are not approved yet!"]}, status: :unauthorized and return
      end
      if user.access_locked?
        render json: {errors: ["Your account is locked!"]}, status: :unauthorized and return
      end
      token = AuthApi::JsonWebToken.encode({ email: user.email })
      user.update_attribute(:jwt_token, token)
      render json: user.to_json(only: [:name, :email, :first_name, :last_name, :jwt_token])
    else
      render json: {errors: ["Email or password is invalid!"]}, status: :unauthorized
    end
  end
end