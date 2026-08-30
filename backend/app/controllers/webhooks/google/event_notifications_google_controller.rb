require 'googleauth'
require 'net/http'
require 'jwt'

class Webhooks::Google::EventNotificationsGoogleController < ApplicationController


    # Skip CSRF checks for webhooks
    skip_before_action :verify_authenticity_token
    $googlePlanId = Plan.find_by(name: 'Google Subscription')&.id
    def handle
      # Parse the Pub/Sub notification
      begin
        pubsub_message = JSON.parse(request.body.read)
        Rails.logger.info("Received RTDN: #{pubsub_message}")

        # Decode the message data (base64-encoded)
        notification_data = Base64.decode64(pubsub_message['message']['data'])
        Rails.logger.info("Decoded Notification: #{notification_data}")
        notification = JSON.parse(notification_data)
        Rails.logger.info("JSON Notification: #{notification}")

        subscriptionNotification = notification['subscriptionNotification']
        purchase_token = subscriptionNotification['purchaseToken']
        productId = subscriptionNotification['subscriptionId']
        packageName = notification['packageName']

        token_data = validate_purchase_token1(purchase_token, packageName, productId)


        # Respond with 200 OK
        auth_token = request.headers['Authorization']&.split(' ')&.last
        unless auth_token
          Rails.logger.error("No Authorization header found.")
          return head :unauthorized
        end

        # Verify the message
        decoded_token = verify_google_message(auth_token)


        unless decoded_token
          Rails.logger.error("Message verification failed.")
          return head :unauthorized
        end

        # Validate payload
        payload = decoded_token[0]
        unless validate_payload(payload)
          Rails.logger.error("Payload validation failed.")
          return head :unauthorized
        end
        Rails.logger.info("Processing notification")
        process_notification(JSON.parse(notification_data),token_data)
        head :ok
      rescue JSON::ParserError => e
        Rails.logger.error("Invalid JSON received: #{e.message}")
        head :bad_request
      rescue StandardError => e
        Rails.logger.error("Error processing RTDN: #{e.message}")
        head :internal_server_error
      end



    end


    private
    def get_google_public_keys
      url = 'https://www.googleapis.com/oauth2/v1/certs'
      uri = URI(url)
      response = Net::HTTP.get(uri)
      JSON.parse(response)
    end

    def validate_payload(payload)
      project_id = 'https://hipaachecker.health/webhooks/google/event_notifications_google'

      if payload['aud'] != project_id
        Rails.logger.error("Invalid audience: #{payload['aud']}")
        return false
      end

      if payload['iss'] != 'https://accounts.google.com'
        Rails.logger.error("Invalid issuer: #{payload['iss']}")
        return false
      end

      if Time.at(payload['exp']) < Time.now
        Rails.logger.error("Token has expired.")
        return false
      end

      Rails.logger.info("Payload validation successful.")
      true
    end

    def verify_google_message(auth_token)
      # Retrieve Google's public keys
      google_keys = get_google_public_keys

      # Decode the JWT
      decoded_token = nil
      google_keys.each do |key_id, public_key|
        begin
          decoded_token = JWT.decode(
            auth_token,
            OpenSSL::X509::Certificate.new(public_key).public_key,
            true, # Verify the signature
            algorithm: 'RS256' # Google's signing algorithm
          )
          break # Stop if successful
        rescue JWT::DecodeError => e
          Rails.logger.error("JWT verification failed: #{e.message}")
          next
        end
      end

      if decoded_token
        Rails.logger.info("Verified Google message successfully: #{decoded_token}")
        return decoded_token
      else
        Rails.logger.error("Failed to verify Google message.")
        return nil
      end
    end

    def validate_purchase_token1(purchase_token, package_name, subscription_id)
      if purchase_token.blank? || package_name.blank? || subscription_id.blank?
        Rails.logger.error("Invalid parameters for token validation:")
        Rails.logger.error("purchaseToken: #{purchase_token}, packageName: #{package_name}, subscriptionId: #{subscription_id}")
        return nil
      end

      # Scope for Android Publisher API
      scope = 'https://www.googleapis.com/auth/androidpublisher'
      begin
        # Load service account credentials
        authorizer = Google::Auth::ServiceAccountCredentials.make_creds(
          json_key_io: File.open(Rails.root.join('config', 'root-emissary-442213-k5-8cf2b28357cc.json')),
          scope: scope
        )
        access_token = authorizer.fetch_access_token!['access_token']

        # Construct the API URL
        api_url = "https://androidpublisher.googleapis.com/androidpublisher/v3/applications/#{package_name}/purchases/subscriptionsv2/tokens/#{purchase_token}"
        uri = URI(api_url)


        Rails.logger.info("Validating subscription token with URL: #{api_url}")

        # Make the API request
        request = Net::HTTP::Get.new(uri)
        request['Authorization'] = "Bearer #{access_token}"

        response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: true) do |http|
          http.request(request)
        end

        # Parse and log the response
        if response.is_a?(Net::HTTPSuccess)
          Rails.logger.info("Token validation successful: #{response.body}")
          JSON.parse(response.body)
        else
          Rails.logger.error("Google API error (#{response.code}): #{response.body}")
          nil
        end
      rescue Google::Auth::Error => e
        Rails.logger.error("Google Auth error: #{e.message}")
        nil
      rescue StandardError => e
        Rails.logger.error("Unexpected error during token validation: #{e.message}")
        nil
      end
    end

    def process_notification(notification, token_data)
      # Extract notification details
      subscription_notification = notification['subscriptionNotification']
      notification_type = subscription_notification['notificationType']
      purchase_token = subscription_notification['purchaseToken']

      expiry_time = token_data.dig("lineItems", 0, "expiryTime")

      # Handle different types of notifications
      case notification_type
      when 1

        handle_recovered(purchase_token,expiry_time)
        # SUBSCRIPTION_RECOVERED
        # Handle subscription recovery logic
        # Example: Unlock access to the user's account
      when 2
        handle_renewal(purchase_token,expiry_time)
        # SUBSCRIPTION_RENEWED
        # Handle subscription renewal logic
        # Example: Update the subscription's expiration date
      when 3
        handle_cancellation(purchase_token)
        # SUBSCRIPTION_CANCELED
        # Handle subscription cancellation logic
        # Example: Notify the user about cancellation
      when 4

        # SUBSCRIPTION_PURCHASED
        # Handle new subscription purchase logic
        # Example: Activate the subscription and grant access
      when 5
        handle_expiry(purchase_token)
        # SUBSCRIPTION_ON_HOLD
        # Handle account hold logic
        # Example: Restrict access and notify the user
      when 6
        handle_grace(purchase_token,expiry_time)
        # SUBSCRIPTION_IN_GRACE_PERIOD
        # Handle grace period logic
        # Example: Allow temporary access and inform the user
      when 7
        handle_renewal(purchase_token,expiry_time)
        # SUBSCRIPTION_RESTARTED
        # Handle subscription restart logic
        # Example: Reactivate the subscription and update details
      when 8
        # SUBSCRIPTION_PRICE_CHANGE_CONFIRMED
        # Handle price change confirmation logic
        # Example: Update the subscription price in the system
      when 9
        # SUBSCRIPTION_DEFERRED
        # Handle deferred subscription logic
        # Example: Update the next billing date
      when 10
        handle_expiry(purchase_token)
        # SUBSCRIPTION_PAUSED
        # Handle subscription pause logic
        # Example: Restrict access and notify the user
      when 11
        # SUBSCRIPTION_PAUSE_SCHEDULE_CHANGED
        # Handle pause schedule change logic
        # Example: Update the schedule and inform the user
      when 12
        # SUBSCRIPTION_REVOKED
        # Handle subscription revocation logic
        # Example: Restrict access and notify the user of revocation
      when 13
        handle_expiry(purchase_token)
        # SUBSCRIPTION_EXPIRED
        # Handle subscription expiration logic
        # Example: Restrict access and encourage renewal
      when 20
        # SUBSCRIPTION_PENDING_PURCHASE_CANCELED
        # Handle pending purchase cancellation logic
        # Example: Ensure no access is granted and notify the user
      else
        # Handle unknown notification type
        Rails.logger.info("Unhandled notification type: #{notification_type}")
      end
    end





    def handle_renewal(purchase_token, expiry_time)
      Rails.logger.info("Handling subscription renewal for token: #{purchase_token}")
      parsed_expiry_time = Time.parse(expiry_time)
      organization = Organization.find_by(google_subscription_id: purchase_token)

      if organization
        organization.update_column(:subscription_expires_on, parsed_expiry_time)
        Rails.logger.info("Subscription expiry updated to: #{parsed_expiry_time}")
      else
        Rails.logger.error("Organization not found for token: #{purchase_token}")
      end
    end

    def handle_cancellation(purchase_token)
      Rails.logger.info("Handling subscription cancellation for token: #{purchase_token}")
      organization = Organization.find_by(google_subscription_id: purchase_token)
      free_plan_id = Plan.find_by(name: 'Free')&.id

      if organization
        # Update the plan_id directly without validations or callbacks
        #organization.update_column(:plan_id, free_plan_id)
        Rails.logger.info("Subscription expired for the user.")
      else
        Rails.logger.error("Organization not found for token: #{purchase_token}")
      end

    end

    def handle_expiry(purchase_token)
      Rails.logger.info("Handling subscription expiry for token: #{purchase_token}")
      organization = Organization.find_by(google_subscription_id: purchase_token)
      free_plan_id = Plan.find_by(name: 'Free')&.id

      if organization
        # Update the plan_id directly without validations or callbacks
        organization.update_column(:plan_id, free_plan_id)
        Rails.logger.info("Subscription expired for the user.")
      else
        Rails.logger.error("Organization not found for token: #{purchase_token}")
      end

      # Add your logic to mark the subscription as expired
    end


    def handle_grace(purchase_token, expiry_time)
      Rails.logger.info("Handling subscription renewal for token: #{purchase_token}")
      parsed_expiry_time = Time.parse(expiry_time)
      organization = Organization.find_by(google_subscription_id: purchase_token)

      if organization
        # Update the subscription expiry date directly without validations or callbacks
        organization.update_column(:subscription_expires_on, parsed_expiry_time)
        Rails.logger.info("Subscription expiry updated to: #{parsed_expiry_time}")
      else
        Rails.logger.error("Organization not found for token: #{purchase_token}")
      end
    end




    def handle_recovered(purchase_token, expiry_time)
      organization = Organization.find_by(google_subscription_id: purchase_token)

      if organization
        # Update the subscription expiry date directly
        organization.update_column(:plan_id, $googlePlanId)
        organization.update_column(:subscription_expires_on, Time.parse(expiry_time))
        Rails.logger.info("Subscription expiry updated to: #{expiry_time}")
      else
        Rails.logger.error("Organization not found for token: ")
      end

    end
  end
