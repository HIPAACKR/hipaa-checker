# app/controllers/api/v1/payment_api_controller.rb
# frozen_string_literal: true
class Api::V1::PaymentMethodsController < ApiController
  before_action :authenticate_user!
  skip_before_action :verify_authenticity_token

  def index
    cards = Stripe::PaymentMethod.list(
      {
        customer: current_user.organization.stripe_customer_id,
        type: 'card',

      })
    render json: { payment_methods: cards["data"] }, status: :ok
  end

  def create
    begin
      if current_user.organization.stripe_customer_id.nil?
        customer = Stripe::Customer.create(
          email: current_user.email,
          description: "Hipaachecker customer, user_id: #{current_user.id}, organization_id: #{current_user.organization.id}"
        )
        current_user.organization.update_column(:stripe_customer_id, customer.id)
      end

      customer_id = current_user.organization.stripe_customer_id

      card = Stripe::Customer.create_source(
        customer_id,
        { source: params[:card_token] }
      )

      render json: card, status: :ok
    rescue Stripe::StripeError => e
      render json: {errors: ["There was an error adding card"]}, status: :unprocessable_entity
    end
  end

  def destroy
    begin
      customer_id = current_user.organization.stripe_customer_id
      card_id = params[:id]

      deleted_card = Stripe::Customer.delete_source(
        customer_id,
        card_id
      )

      if deleted_card.deleted
        render json: {message: "Card was deleted"}, status: :ok
      else
        render json: {errors: ["There was a problem removing card"]}, status: :unprocessable_entity
      end
    rescue Stripe::StripeError => e
      puts e.message
      puts e.backtrace
      render json: {errors: ["There was a problem removing card"]}, status: :unprocessable_entity
    end
  end

  def make_default
    begin
      customer_id = current_user.organization.stripe_customer_id
      card_id = params[:id]

      customer = Stripe::Customer.update(
        customer_id,
        {
          default_source: card_id
        }
      )

      render json: {message: "Successfully made this card default"}, status: :ok
    rescue Stripe::StripeError => e
      puts e.message
      puts e.backtrace
      render json: {errors: ["There was a problem making this card default"]}
    end
  end

end