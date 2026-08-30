class Api::V1::Ios::UserUploadsController < ApiController
  before_action :check_app_upload_quota, only: [:create]

  def create
    @user_upload = current_user.user_uploads.new
    @user_upload.upload_type = 'Healthcare'
    @user_upload.platform = 'ios'
    @user_upload.environment = 'app'
    @user_upload.project_name = params[:project_name]
    @user_upload.project_identifier = params[:project_identifier]

    existing_user_upload = current_user.user_uploads.find_by(project_identifier: params[:project_identifier])

    if params[:project_name].blank?
      render json: {errors: ["Project Name can not be blank"]}, status: :unprocessable_entity and return
    elsif params[:project_identifier].blank?
      render json: {errors: ["Project Identifier can not be blank"]}, status: :unprocessable_entity and return
    elsif params[:project_identifier].present? && existing_user_upload.present?
      render json: existing_user_upload, status: :ok and return
    end

    if @user_upload.save(validate: false)

      render json: @user_upload, status: :created
    else
      render json: {}, status: :unprocessable_entity
    end
  end

  private

  def user_upload_params
    params.require(:user_upload).permit(:upload_type)
  end

  def check_app_upload_quota
    if !current_user.is_allowed_to_upload?
      redirect_to root_url, alert: "You have reached the maximum limit for the app checking!" and return
    end
  end
end
