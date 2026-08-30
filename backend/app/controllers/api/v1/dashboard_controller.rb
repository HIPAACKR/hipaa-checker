class Api::V1::DashboardController < ApiController

  respond_to :json

  def index
    @user = current_user
  end
end
