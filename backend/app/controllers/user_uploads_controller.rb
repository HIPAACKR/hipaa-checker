class UserUploadsController < ApplicationController
  before_action :authenticate_user!
  before_action :check_app_upload_quota, only: [:new, :create]
  include Analytics

  def index
    @user_uploads = current_user.user_uploads
  end

  def extract
    user_upload = UserUpload.find(params[:id])
    if user_upload.app?
      extract_apk(user_upload, ActiveStorage::Blob.service.path_for(user_upload.file.key))
    elsif user_upload.web_application?
      unzip_web_application(user_upload)
    end
    redirect_back fallback_location: root_path, notice: "APK file was extracted successfully"
  end

  def new
    @user_upload = current_user.user_uploads.new
  end

  def create
    @user_upload = current_user.user_uploads.new(user_upload_params)
    if @user_upload.save

      redirect_to user_uploads_path, notice: 'Upload Successful'
    else
      flash.now['alert'] = @user_upload.errors.full_messages.join(", ")
      render :new
    end
  end

  def destroy
    user_upload = UserUpload.find(params[:id])
    if user_upload.destroy
      `cd extracted && rm -rf #{user_upload.id}`
      redirect_to user_uploads_path, notice: 'Delete Successful'
    else
      redirect_to user_uploads_path, error: 'Not Able to Delete !'
    end

  end

  def report
    @user_upload = UserUpload.find(params[:id])
    respond_to do |format|
      format.html
      format.json { render json: @user_upload.reports_as_hash }
    end
  end

  private

  def user_upload_params
    params.require(:user_upload).permit(:file, :upload_type, :platform, :environment)
  end

end
