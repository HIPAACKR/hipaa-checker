class SubscriptionsController < ApplicationController
  before_action :authenticate_user!

  def new
    @plans ||= Plan.not_google_subscription.active.sorted_by_price
    # if current_user.organization&.is_individual?
    #   @plans = @plans.for_individual
    # end
  end

  def create
    token = params[:user][:stripe_token]
    errors = validate_plan_is_upgradeable
    redirect_to new_subscription_path, alert: errors.join(', ') and return if errors.any?

    begin
      promotional_code = nil
      if params[:code].present?
        promotional_code = PromotionalCode.find_by(code: params[:code])
      end
      customer = stripe_customer(token)
      customer_hash = {
        customer: customer.id,
        items: [{ price: @plan.stripe_price_id }],
      }
      customer_hash[:coupon] = promotional_code.stripe_coupon_id if promotional_code.present?

      create_or_update_subscription_with(customer_hash, @plan)
      flash[:notice] = 'Successfully updated subscription'
      redirect_to new_user_upload_path
    rescue => e
     ActiveRecord::Rollback
     puts e.backtrace
     redirect_to new_subscription_path, alert: e.message
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
    @plan = Plan.find_by(id: params[:user][:plan_id])
    @errors = []

    if @plan.blank?
      @errors.push('Please choose your plan first.')
    elsif @plan.stripe_price_id.blank?
      @errors.push('This plan is not configured in Stripe yet.')
    elsif @plan.paid? && params[:user][:stripe_token].blank?
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

