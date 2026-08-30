class Webhooks::Stripe::EventNotificationsController < ApplicationController
  skip_before_action :verify_authenticity_token

  def create
    payload = request.body.read
    stripe_signature = request.env['HTTP_STRIPE_SIGNATURE']
    endpoint_secret = ENV['STRIPE_WEBHOOK_SIGNING_SECRET']
    event = nil

    begin
      event = Stripe::Webhook.construct_event(payload, stripe_signature, endpoint_secret)
    rescue JSON::ParserError => e
      render json: {}, status: :bad_request and return
    rescue Stripe::SignatureVerificationError => e
      render json: {}, status: :bad_request and return
    end

    case event.type
    when 'invoice.payment_failed'
      object = event.data.object
      organization = Organization.where(stripe_customer_id: object.customer).first
      plan = organization&.plan
      if plan.present? && organization.present?
        organization.users.update_all(locked_at: Time.now)
        OrganizationMailer.payment_failed_notification(organization).deliver_later
      end
    when 'invoice.payment_succeeded'
      object = event.data.object
      organization = Organization.where(stripe_customer_id: object.customer).first
      if organization.present?
        subscription = Stripe::Subscription.retrieve(object.subscription)
        organization.update_columns(subscription_expires_on: Time.at(subscription.current_period_end))
      end
    end
    render json: {}, status: :ok
  end
end
