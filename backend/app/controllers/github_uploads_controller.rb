class GithubUploadsController < ApplicationController
  before_action :authenticate_user!
  before_action :check_app_upload_quota, only: [:new, :create]

  def new
    @github_upload = current_user.github_uploads.new
    @github_upload.repo_type = 'public'
  end

  def create
    @github_upload = current_user.github_uploads.new(github_upload_params)
    if @github_upload.save

      redirect_to user_uploads_path, notice: "Github URL was submitted successfully."
    else
      render "new"
    end
  rescue Exception => e
   redirect_to root_url, alert: "Please make sure your Github access token has proper permission."
  end

  private

  def github_upload_params
    params.require(:github_upload).permit(:github_url, :platform, :repo_type, :access_token)
  end

end
