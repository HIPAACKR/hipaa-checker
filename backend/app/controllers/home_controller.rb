class HomeController < ApplicationController
  include Analytics
  def index
  end

  def preview
    @filename = params[:filepath].to_s.split("/").last
    @content =IO.read(params[:filepath])
  end

  def check_vulnerabilities
    user_upload = UserUpload.find(params[:user_upload_id])
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
    redirect_to report_user_upload_path(user_upload), notice: 'Successful'
  end

  def check_all_vulnerabilities
    current_user.user_uploads.all.each do |user_upload|
      user_upload.analyzed_results.destroy_all
      filepath = "#{Rails.root}/extracted/#{user_upload.id}/java_sources"
      Dir.glob("#{Rails.root}/patterns/released/*").each do |file|
        android_rules = YAML.load_file(file)
        puts "Staring traverse and analysis... "
        traverse(user_upload, filepath, android_rules, file)
        puts "Traverse and analysis ended ... "
      end
    end
  end

end
