require 'json'
class Api::V1::UserUploadsController < ApiController
  before_action :check_app_upload_quota, only: [:create]
  include Analytics

  def index
    @user_uploads = current_user.user_uploads.includes(:analyzed_results).order(created_at: :desc)
  end

  def create
    @user_upload = current_user.user_uploads.new(user_upload_params)
    @user_upload.status = UserUpload.statuses[:uploading]
    if @user_upload.save
      render json: @user_upload, status: :ok
    else
      render json: {errors: @user_upload.errors.full_messages}, status: :unprocessable_entity
    end
  rescue Exception => e
    puts e.message
    puts e.backtrace.join("\n")
    @user_upload.failed!
    render json: @user_upload, status: :unprocessable_entity
  end

  def extract
    user_upload = current_user.user_uploads.find(params[:id])
    user_upload.update_columns(
      completed_rules_count: 0,
      extraction_progress: 0,
      status: UserUpload.statuses[:extracting]
    )
    ExtractionJob.perform_later(user_upload.id)
    render json: {message: "Extraction is enqueued successfully"}, status: :ok
  rescue Exception => e
    puts e.message
    puts e.backtrace.join("\n")
    user_upload.failed!
    render json: {errors: ["Something went wrong! please try again"]}, status: :unprocessable_entity
  end

  # def generate_reports
  #   user_upload = current_user.user_uploads.find(params[:id])
  #   user_upload.analyzed_results.destroy_all
  #   extraction_filepath = "#{Rails.root}/extracted/#{user_upload.id}/java_sources"
  #   Dir.glob("#{Rails.root}/patterns/#{user_upload.pattern_path}/*").each do |file|
  #     ReportGenerationJob.perform_later(user_upload.id, file, extraction_filepath)
  #   end
  #   render json: user_upload, status: :ok
  # rescue Exception => e
  #   puts e.message
  #   puts e.backtrace.join("\n")
  #   user_upload.failed!
  #   render json: {errors: ["Something went wrong! please try again"]}, status: :unprocessable_entity
  # end

  # def create
  #   @user_upload = current_user.user_uploads.new(user_upload_params)
  #   if @user_upload.save
  #     `cd extracted && mkdir -p #{@user_upload.id}/java_sources`
  #     `unzip #{ActiveStorage::Blob.service.path_for(@user_upload.file.key)} -d extracted/#{@user_upload.id}/java_sources`
  #
  #
  #     @user_upload.analyzed_results.destroy_all
  #     filepath = "#{Rails.root}/extracted/#{@user_upload.id}/java_sources"
  #     Dir.glob("#{Rails.root}/patterns/released/*").each do |file|
  #       android_rules = YAML.load_file(file)
  #       puts "Staring traverse and analysis... "
  #       traverse(@user_upload, filepath, android_rules, file)
  #       puts "Traverse and analysis ended ... "
  #     end
  #     UserUploadMailer.user_uploaded_email(@user_upload).deliver_now
  #     render json: {}, status: :ok
  #   else
  #     render :json => {errors: @user_upload.errors.full_messages}, status: :unprocessable_entity
  #   end
  # end

  def show
    @user_upload = current_user.user_uploads.find(params[:id])
  end

  def rule_wise
    @user_upload = current_user.user_uploads.find(params[:id])
    @rules = UserUpload::HIPAA_RULES.dup.paginate(page: params[:page], per_page: 1)
  end

  def file_wise
    @user_upload = current_user.user_uploads.includes(:analyzed_results).find(params[:id])
    @analyzed_results = @user_upload.analyzed_results.select('DISTINCT(analyzed_results.filepath),  analyzed_results.id')
    if params[:severity].present?
      @analyzed_results = @analyzed_results.where(severity: params[:severity])
    end

    @analyzed_results = @analyzed_results.paginate page: params[:page], per_page: 5
  end

  def file_content
    @user_upload = current_user.user_uploads.includes(:analyzed_results).find(params[:id])
    id = params[:file_id]
    analyzed_result = @user_upload.analyzed_results.find_by(id: id)
    if File.exists?(analyzed_result.filepath)
      render json: {
        codebase: File.read(analyzed_result.filepath)
      }
    else
      render json: {errors: ["No file exists"]}, status: :unprocessable_entity
    end
  end
  def show_progress
    begin
      user_upload = current_user.user_uploads.find(params[:id])

      render json: {
        progress: {
          status: user_upload.status,
          extraction_progress: user_upload.extraction_progress,
          report_generation_progress: ((user_upload.completed_rules_count.to_f/11.0) * 100).to_i,
        },
      }, status: :ok

    rescue ActiveRecord::RecordNotFound
      render json: {
        error: "Upload not found or doesn't belong to you."
      }, status: :not_found

    rescue => e
      Rails.logger.error("Progress check failed: #{e.message}")
      render json: {
        error: "Something went wrong while fetching progress."
      }, status: :internal_server_error
    end
  end

  def destroy
    @user_upload = current_user.user_uploads.find(params[:id])
    @user_upload.destroy
    render json: {}, status: :no_content
  end

  private

  def user_upload_params
    params.require(:user_upload).permit(:file, :upload_type, :platform, :environment)
  end

  def check_app_upload_quota
    unless current_user.approved?
      render json: {errors: ["You need to be approved first"]}, status: :unprocessable_entity
      return
    end

    if current_user.organization.subscription_expires_on && Date.today > current_user.organization.subscription_expires_on
      render json: {errors: ["Your subscription is expired!"]}, status: :unprocessable_entity
      return
    end

    if !current_user.is_allowed_to_upload?
      if current_user.organization.plan.blank?
        render json: {errors: ["Please subscribe to one plan first"]}, status: :unprocessable_entity
        return
      end

      if current_user.organization.plan&.free?
        render json: {errors: ["You’ve reached today’s upload limit. Please contact us to increase your limit."]}, status: :unprocessable_entity
        return
      end
      render json: {errors: ["You’ve reached today’s upload limit. Please contact us to increase your limit."]}, status: :unprocessable_entity
    end
  end
end
