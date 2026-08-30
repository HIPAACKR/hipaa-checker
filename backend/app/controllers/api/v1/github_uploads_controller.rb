class Api::V1::GithubUploadsController < ApiController
  before_action :check_app_upload_quota, only: [:create]

  def new
    @github_upload = current_user.github_uploads.new
    @github_upload.repo_type = 'public'
  end

  def create
    @github_upload = current_user.github_uploads.new(github_upload_params)
    if @github_upload.save
      @github_upload.reload

      render json: @github_upload.user_upload, status: :ok
    else
      render json: {errors: @github_upload.errors.full_messages}, status: :unprocessable_entity
    end
  rescue Exception => e
    render json: {errors: ["Please make sure your Github access token has proper permission."]}, status: :unprocessable_entity
  end

  private

  def github_upload_params
    params.require(:github_upload).permit(:github_url, :platform, :repo_type, :access_token)
  end

  def check_app_upload_quota
    if !current_user.is_allowed_to_upload?
      render json: {errors: ["You have reached the maximum limit for the app checking!"]}, status: :unprocessable_entity
    end
  end

end
