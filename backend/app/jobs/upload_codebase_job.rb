class UploadCodebaseJob < ApplicationJob
  include Analytics
  require "net/http"
  require "uri"
  require "securerandom"

  BASE_URL = "http://3.229.147.227:8088/api/v1"

  def perform(user_upload_id)
    user_upload = UserUpload.find(user_upload_id)

    extracted_path = "#{Rails.root}/extracted/#{user_upload.id}"
    zip_file_path = "#{Rails.root}/extracted/codebase_#{user_upload.id}.zip"

    # -----------------------
    # ZIP WITH SYSTEM COMMAND
    # -----------------------
    # zip -r /tmp/codebase_123.zip .
    zipped = system("cd #{extracted_path} && zip -rq #{zip_file_path} .")

    unless zipped
      Rails.logger.error "UploadCodebaseJob ERROR: Failed to create ZIP for #{user_upload_id}"
      return
    end

    # -----------------------
    # PLAIN RUBY MULTIPART
    # -----------------------
    uri = URI("#{BASE_URL}/codebase/upload/zip")
    boundary = "----RubyMultipartPost-#{SecureRandom.hex}"
    post_body = []

    # Add file
    file_content = File.binread(zip_file_path)
    post_body << "--#{boundary}\r\n"
    post_body << "Content-Disposition: form-data; name=\"file\"; filename=\"#{File.basename(zip_file_path)}\"\r\n"
    post_body << "Content-Type: application/zip\r\n\r\n"
    post_body << file_content
    post_body << "\r\n"

    # Add fields
    {
      user_upload_id: user_upload.id,
      hipaachecker_user_id: user_upload.user_id,
      project_name: user_upload.project_name.to_s || ""
    }.each do |key, value|
      post_body << "--#{boundary}\r\n"
      post_body << "Content-Disposition: form-data; name=\"#{key}\"\r\n\r\n"
      post_body << value
      post_body << "\r\n"
    end

    post_body << "--#{boundary}--\r\n"

    # Make HTTP request
    http = Net::HTTP.new(uri.host, uri.port)
    request = Net::HTTP::Post.new(uri.path)
    request["Content-Type"] = "multipart/form-data; boundary=#{boundary}"
    request.body = post_body.join

    response = http.request(request)

    if response.code.to_i == 200
      Rails.logger.info "UploadCodebaseJob: Upload success for #{user_upload_id}"
    else
      Rails.logger.error "UploadCodebaseJob FAILED: #{response.code} - #{response.body}"
    end

  rescue => e
    Rails.logger.error "UploadCodebaseJob ERROR: #{e.message}"

  ensure
    if File.exist?(zip_file_path)
      File.delete(zip_file_path)
      Rails.logger.info "UploadCodebaseJob: Deleted temp zip file #{zip_file_path}"
    end
  end
end
