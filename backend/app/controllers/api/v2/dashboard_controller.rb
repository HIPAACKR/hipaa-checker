class Api::V2::DashboardController < ApiController

  respond_to :json

  def index
    @user = current_user
    @user_uploads = current_user.user_uploads.includes(:analyzed_results).order(created_at: :desc).paginate page: params[:page], per_page: 10
    @rules_dashboard = UserUpload::HIPAA_RULES.dup
  end

end
