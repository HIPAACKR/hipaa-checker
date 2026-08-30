# frozen_string_literal: true

class GoogleBillingVerify
  require 'google/apis/androidpublisher_v3'
  require 'googleauth'

  def self.initialize_service
    service = Google::Apis::AndroidpublisherV3::AndroidPublisherService.new
    key_file = 'config/root-emissary-442213-k5-8cf2b28357cc.json'
    scope = 'https://www.googleapis.com/auth/androidpublisher'

    authorizer = Google::Auth::ServiceAccountCredentials.make_creds(
      json_key_io: File.open(key_file),
      scope: scope
    )
    service.authorization = authorizer
    service
  end
  def self.acknowledge_purchase(package_name, product_id, purchase_token)
    service = initialize_service
    acknowledgment_request = Google::Apis::AndroidpublisherV3::SubscriptionPurchasesAcknowledgeRequest.new
    service.acknowledge_purchase_subscription(package_name, product_id, purchase_token, acknowledgment_request)
  end
  def self.validate_purchase(package_name, product_id, purchase_token)
    service = initialize_service
    begin
      result = service.get_purchase_subscription(package_name, product_id, purchase_token)
      # Fetch subscription details
      # Check if the subscription is acknowledged

      # Return subscription details
      {
        valid: true,
        paymentState: result.payment_state,
        acknowledgementState: result.acknowledgement_state,
        expiryTimeMillis: result.expiry_time_millis,
        startTimeMillis: result.start_time_millis,
        autoRenewing: result.auto_renewing
      }
    rescue Google::Apis::ClientError => e
      Rails.logger.error("Google Play API Client Error: #{e.message}")
      { valid: false, error: e.message }
    rescue StandardError => e
      Rails.logger.error("Unexpected Error: #{e.message}")
      { valid: false, error: e.message }
    end
  end
end
