# app/controllers/api/v1/payment_api_controller.rb
# frozen_string_literal: true
class Api::V1::PaymentApiController < ApiController
  before_action :authenticate_user!
  skip_before_action :verify_authenticity_token
  def new
    @plans ||= Plan.active.sorted_by_price

    if current_user.organization&.is_individual?
      @plans = @plans.for_individual
    end

    render json: { plans: @plans }, status: :ok
  end

  def userPlanInfo
    organization = current_user.organization

    if organization
      plan = Plan.find_by(id: organization.plan_id)

      if plan
        plan_info = {
          id: plan.id,
          name: plan.name,
          price: plan.price.to_i,
          uploadQuota: plan.max_upload_quota
        }

        render json: { plan_info: plan_info }, status: :ok
      else
        render json: { error: 'Plan not found for the organization' }, status: :not_found
      end
    else
      render json: { error: 'No organization found for the current user' }, status: :not_found
    end
  end

  def create_payment
    token = params[:stripe_token]
    Rails.logger.info("Received stripe_token: #{token}")
    errors = validate_plan_is_upgradeable
    Rails.logger.info("Errors from validate_plan_is_upgradeable: #{errors}")

    if errors.any?
      Rails.logger.info("Validation errors present: #{errors.join(', ')}")
      render json: { status: "Failed", errors: errors }, status: :bad_request and return
    end

    begin
      Rails.logger.info("Creating Stripe customer")
      customer = stripe_customer(token)
      customer_hash = {
        customer: customer.id,
        items: [{ price: @plan.stripe_price_id }]
      }
      Rails.logger.info("Customer created with ID: #{customer.id}, creating/updating subscription")
      create_or_update_subscription_with(customer_hash, @plan)
      Rails.logger.info("Subscription successfully updated")
      render json: { status: "ok" }, status: :ok
    rescue => e
      Rails.logger.error("Exception occurred: #{e.message}")
      Rails.logger.error(e.backtrace.join("\n"))
      render json: { status: "Failed", error: e.message }, status: :internal_server_error
    end
  end


  def stripe_customer(token=nil)
    if current_user.organization.stripe_customer_id.present?
      customer = Stripe::Customer.retrieve(current_user.organization.stripe_customer_id)
      if token.present?
        Stripe::Customer.update(
          current_user.organization.stripe_customer_id, {source: token},
          )
      end
    else
      if token.present?
        customer = Stripe::Customer.create(
          source: token,
          email: current_user.email,
          description: "Hipaachecker customer, user_id: #{current_user.id}, organization_id: #{current_user.organization.id}"
        )
      else
        customer = Stripe::Customer.create(
          email: current_user.email,
          description: "Hipaachecker customer, user_id: #{current_user.id}, organization_id: #{current_user.organization.id}"
        )
      end
    end
    current_user.organization.update_column(:stripe_customer_id, customer.id)
    customer
  end


  def create_or_update_subscription_with(customer_hash, plan)
    if current_user.organization.stripe_subscription_id.blank?
      subscription = Stripe::Subscription.create(customer_hash)
    else
      old_subscription = Stripe::Subscription.retrieve(current_user.organization.stripe_subscription_id)
      subscription = Stripe::Subscription.update(
        current_user.organization.stripe_subscription_id,
        billing_cycle_anchor: 'now',
        items: [{ id: old_subscription.items.data[0].id, price: plan.stripe_price_id }]
      )
    end

    #current_user.organization.update_necessary_attributes(plan, subscription)
    current_user.organization.users.update_all(app_checking_count: plan.max_upload_quota)
    current_user.organization.update_columns(plan_id: plan.id, stripe_subscription_id: subscription.id)
  end

  private
  def validate_plan_is_upgradeable
    @plan = Plan.find_by(id: params[:plan_id])
    @errors = []

    if @plan.blank?
      @errors.push('Please choose your plan first.')
    elsif @plan.stripe_price_id.blank?
      @errors.push('This plan is not configured in Stripe yet.')
    elsif @plan.paid? && params[:stripe_token].blank?
      stripe_customer = Stripe::Customer.retrieve(current_user.organization.stripe_customer_id) rescue  nil
      if stripe_customer.blank? || (stripe_customer.present? && stripe_customer.default_source.blank?)
        @errors.push('Please add a card to subscribe')
      end
    elsif !current_user.is_allowed_to_update_plan?(@plan)
      @errors.push("You are not allowed to update the plan, please check your chosen plan and your organization's total users")
    elsif @plan.present? && @plan.id == current_user.organization.plan_id
      @errors.push("You are already subscribed to #{@plan.name} subscription")
    end
    @errors
  end
end