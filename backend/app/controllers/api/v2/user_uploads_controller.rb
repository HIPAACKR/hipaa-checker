class Api::V2::UserUploadsController < ApiController
  before_action :check_app_upload_quota, only: [:create]
  include Analytics

  def index
    @user_uploads = current_user.user_uploads.includes(:analyzed_results).order(created_at: :desc)
  end

  def create
    @user_upload = current_user.user_uploads.new(user_upload_params)
    if @user_upload.save

      render json: @user_upload, status: :ok
    else
      render json: {errors: @user_upload.errors.full_messages}, status: :unprocessable_entity
    end
  end

  def extract
    user_upload = current_user.user_uploads.find(params[:id])
    if user_upload.app?
      extract_apk(user_upload, ActiveStorage::Blob.service.path_for(user_upload.file.key))
    elsif user_upload.web_application?
      unzip_web_application(user_upload)
    end
    render json: {message: "Extracted successfully"}, status: :ok
  end

  def generate_reports
    user_upload = current_user.user_uploads.find(params[:id])
    user_upload.analyzed_results.destroy_all
    filepath = "#{Rails.root}/extracted/#{user_upload.id}/java_sources"
    Dir.glob("#{Rails.root}/patterns/#{user_upload.pattern_path}/*").each do |file|
      android_rules = YAML.load_file(file)
      puts "Staring traverse and analysis... "
      traverse(user_upload, filepath, android_rules, file)
      puts "Traverse and analysis ended ... "
    end
    if user_upload.analyzed_results.any?
      calculator = HipaaRiskScoreCalculator.new(user_upload)
      # calculator = HipaaRiskScoreCalculator.new(user_upload.hipaa_risk_scores(UserUpload::HIPAA_RULES.dup), user_upload)
      calculator.calculate
      puts "Calculated"
    else
      puts "No analysis results found. Skipping risk calculation."
    end
    render json: {}, status: :ok
  end

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
    @rules = UserUpload::HIPAA_RULES.dup.paginate(page: params[:page], per_page:1)
    @rules2 = UserUpload::HIPAA_RULES.dup
  end

  def file_wise
    @user_upload = current_user.user_uploads.includes(:analyzed_results).find(params[:id])
    @rules2 = UserUpload::HIPAA_RULES.deep_dup
    @analyzed_results =
      @user_upload.analyzed_results
                  .select('DISTINCT(analyzed_results.filepath), analyzed_results.id')
                  .where.not(user_review_status: "ignore")
    if params[:severity].present?
      @analyzed_results = @analyzed_results.where(severity: params[:severity])
    end

    @analyzed_results = @analyzed_results.paginate page: params[:page], per_page: 5
  end

  # def file_wise
  #   json = {
  #     "user_upload": {
  #       "id": 34,
  #       "name": "Webmd symptom checker 9.7 apkcombo.com",
  #       "upload_type": "Healthcare",
  #       "platform": "apk",
  #       "environment": "app",
  #       "created_at": "2024-05-20T04:47:08.396Z",
  #       "project_name": nil,
  #       "project_identifier": nil,
  #       "hipaa_score": {
  #         "total_risk_score": 17.5,
  #         "cvss_risk_score": 24.3,
  #         "cvss_risk_mitigation": 3.2,
  #         "cvss_risk_remaining": 1.2,
  #         "risk_breakdown": [
  #           {
  #             "risk_category": "Insufficient Authorization",
  #             "total_risk_score": 17.5,
  #             "cvss_risk_score": 6.3,
  #             "cvss_risk_mitigation": 3.2,
  #             "cvss_risk_remaining": 1.2
  #           },
  #           {
  #             "risk_category": "Inadequate Data security",
  #             "total_risk_score": 17.5,
  #             "cvss_risk_score": 6.3,
  #             "cvss_risk_mitigation": 3.2,
  #             "cvss_risk_remaining": 1.2
  #           },
  #           {
  #             "risk_category": "Insecure Network communication",
  #             "total_risk_score": 17.5,
  #             "cvss_risk_score": 6.3,
  #             "cvss_risk_mitigation": 3.0,
  #             "cvss_risk_remaining": 3.2
  #           }
  #         ]
  #       },
  #       "analyzed_results": {
  #         "filename": "Util.java",
  #         "filepath": "/Users/abdul/projects/hipaachecker.health/extracted/34/java_sources/io/grpc/okhttp/internal/Util.java",
  #         "rules": [
  #           {
  #             "rule_id": "encryption_decryption",
  #             "description": "Implementation of encryption and decryption",
  #             "critical_risk_count": 0,
  #             "high_risk_count": 0,
  #             "medium_risk_count": 0,
  #             "low_risk_count": 0,
  #             "no_risk_count": 0,
  #             "sub_rules": [
  #               {
  #                 "subrule_id": "md_encryption",
  #                 "description": "This App uses Message Digest (MD) algorithm encryption.",
  #                 "severity": 3,
  #                 "vulnerability_cat": "Inadequate Data security",
  #                 "count": 2,
  #                 "code_segments": [
  #                   "{\"lineNumber\":12,\"codeSegment\":\"import java.security.MessageDigest;\"}",
  #                   "{\"lineNumber\":12,\"codeSegment\":\"import java.security.MessageDigest;\"}"
  #                 ]
  #               },
  #               {
  #                 "subrule_id": "md_encryption",
  #                 "description": "This App uses Message Digest (MD) algorithm encryption.",
  #                 "severity": 2,
  #                 "vulnerability_cat": "Insufficient Authorization",
  #                 "count": 2,
  #                 "code_segments": [
  #                   "{\"lineNumber\":12,\"codeSegment\":\"import java.security.MessageDigest;\"}"
  #                 ]
  #               }
  #             ]
  #           }
  #         ]
  #       }
  #     }
  #   }
  #   render json: json, status: :ok
  # end

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

  def destroy
    @user_upload = current_user.user_uploads.find(params[:id])
    @user_upload.destroy
    render json: {}, status: :no_content
  end

  def report
    @user_upload = UserUpload.find(params[:id])
    @user = current_user
    @rules2 = UserUpload::HIPAA_RULES.dup
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

    unless current_user.is_allowed_to_upload?
      if current_user.organization.plan.blank?
        render json: { errors: ["Please subscribe to one plan first"] }, status: :unprocessable_entity
        return
      end

      if current_user.organization.plan&.free? && current_user.organization.subscription_expires_on < Date.today
        render json: { errors: ["Your trial period for free plan is expired."] }, status: :unprocessable_entity
        return
      end
      render json: { errors: ["You have reached the maximum limit for the app checking!"] }, status: :unprocessable_entity
    end
  end
end