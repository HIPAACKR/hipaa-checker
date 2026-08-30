class UsersController < ApplicationController
  before_action :authenticate_user!
  def update_jwt_token
    current_user.update_column(:jwt_token, current_user.generate_jwt_token)
    flash[:notice] = "Your API KEY was updated and it will be valid for next #{human_readable_time(User::JWT_TOKEN_VALID_HOURS)}"
    redirect_back fallback_location: root_path
  end

  def api_credentials

  end

end
