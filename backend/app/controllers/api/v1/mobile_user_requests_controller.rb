class Api::V1::MobileUserRequestsController < ApiController

  def index
    @mobile_user_requests = current_user.mobile_user_requests.sorted
    render json: @mobile_user_requests.to_json(only: [:id, :app_name, :package_name, :status, :created_at]), status: :ok
  end

  def create
    @mobile_user_request = current_user.mobile_user_requests.new(mobile_user_params)
    if @mobile_user_request.save
      render json: @mobile_user_request.to_json(only: [:id, :app_name, :package_name, :status, :created_at]), status: :created
    else
      render json: {errors: @mobile_user_request.errors.full_messages}, status: :unprocessable_entity
    end
  end

  def show
    @mobile_user_request = current_user.mobile_user_requests.find(params[:id])
    render json: @mobile_user_request.to_json(only: [:id, :app_name, :package_name, :status, :created_at], methods: [:reports]), status: :created
  end

  def destroy
    @mobile_user_request = current_user.mobile_user_requests.find(params[:id])
    @mobile_user_request.destroy
    render json: {}, status: :no_content
  end

  private

  def mobile_user_params
    params.require(:mobile_user_request).permit(:app_name, :package_name)
  end

end
