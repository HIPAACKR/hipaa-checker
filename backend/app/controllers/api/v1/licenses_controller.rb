require 'json'
class Api::V1::LicensesController < ApplicationController
  protect_from_forgery with: :null_session

  def validate
    license_key = params[:license_key]
    license = License.where(license_key: license_key).where("expires_on > ?", Time.now).first
    if license.present?
      license.license_logs.create(
        {
          ip_address: request.remote_ip,
          user_agent: request.user_agent,
          hostname: request.host,
          request_method: request.method,
          request_protocol: request.protocol
        }
      )
      render json: {}, status: :ok
    else
      render json: {}, status: :unprocessable_entity
    end
  end

  #API for calling from RUST library to validate license key
  def validate_license_key_from_server
    license_key = params[:license_key].to_s.gsub(/\s+/, "").strip
    license = License.find_by(license_key: license_key)

    if license.nil?
      # Case 1: License not found / typo / invalid key
      render json: { error: "Invalid license key" }, status: :unauthorized

    elsif license.expires_on <= Time.now
      # Case 2: License exists but expired
      render json: { error: "License key has expired" }, status: :forbidden

    else
      # Case 3: Valid license
      license.license_logs.create(
        ip_address: request.remote_ip,
        user_agent: request.user_agent,
        hostname: request.host,
        request_method: request.method,
        request_protocol: request.protocol
      )

      license_obj = {
        key: license.license_key,
        expired_date: license.expires_on,
        user_limit: 1000,
        validated_at: license.created_at,
      }

      render json: { data: license_obj }, status: :ok
    end
  rescue => e
    Rails.logger.error "[LicenseValidationError] #{e.class} - #{e.message}"
    Rails.logger.error e.backtrace.join("\n")

    render json: { error: "Something went wrong while validating license" },
           status: :internal_server_error
  end
end

