class Api::V1::SubscriptionsController < ApiController
  require 'google_billing_verify'

  def create
    token = params[:user][:stripe_token]
    errors = validate_plan_is_upgradeable
    if errors.any?
      render json: {errors: errors}, status: :unprocessable_entity and return
    end

    begin
      promotional_code = nil
      if params[:code].present?
        promotional_code = PromotionalCode.where("expire_date >= ?", Date.today).find_by(code: params[:code])
      end
      customer = stripe_customer(token)
      customer_hash = {
        customer: customer.id,
        items: [{ price: @plan.stripe_price_id }],
      }
      if @plan.free?
        customer_hash[:trial_period_days] = 7
      end
      if promotional_code.present?
        customer_hash[:coupon] = promotional_code.stripe_coupon_id
      end

      create_or_update_subscription_with(customer_hash, @plan,promotional_code)
      render json: {message: 'Successfully updated subscription'}, status: :ok and return
    rescue => e
     ActiveRecord::Rollback
     puts e.backtrace
     render json: {errors: [e.message]}, status: :unprocessable_entity
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

  def create_or_update_subscription_with(customer_hash, plan,promotional_code=nil)
    if current_user.organization.stripe_subscription_id.blank?
      subscription = Stripe::Subscription.create(customer_hash)
    else
      old_subscription = Stripe::Subscription.retrieve(current_user.organization.stripe_subscription_id)
      subscription = Stripe::Subscription.update(
        current_user.organization.stripe_subscription_id,
        billing_cycle_anchor: 'now',
        trial_end: 'now',
        items: [{ id: old_subscription.items.data[0].id, price: plan.stripe_price_id }]
      )
    end

    if plan.free?
      Stripe::Subscription.update(
        subscription.id,
        {
          cancel_at_period_end: true
        }
      )
    end
    expiration_date = Time.at(subscription.current_period_end)
    current_user.organization.update_columns(
      plan_id: plan.id, stripe_subscription_id: subscription.id,
      promotional_code_id: promotional_code&.id,
      subscription_expires_on: expiration_date
    )
  end

  def cancel
    if current_user.organization.individual? || current_user.is_admin?
      subscription_id = current_user.organization.stripe_subscription_id
      subscription = Stripe::Subscription.cancel(subscription_id)
      current_user.organization.update_columns(plan_id: nil, subscription_expires_on: nil, stripe_subscription_id: nil)
      render json: {message: 'Your current subscription is cancelled successfully'}, status: :ok and return
    else
      render json: {errors: ["You are not allowed to cancel subscription"]}, status: :unprocessable_entity
    end
  end







   def subscribe_to_google
     package_name = 'health.hipaachecker'
     googleSubProductId = params[:googleSubProductId]
     purchaseToken = params[:purchaseToken]
     result = GoogleBillingVerify.validate_purchase(package_name, googleSubProductId, purchaseToken)
     if result[:valid]
       if (result[:paymentState] != 3)
       expiry_time_millis = result[:expiryTimeMillis]
       expiry_date = Time.at(expiry_time_millis.to_i / 1000)
       plan = Plan.google_subscription.first # Fetch the Google subscription plan
       current_user.organization.update!(
         google_subscription_id: purchaseToken,
         plan_id: plan.id,
         subscription_expires_on: expiry_date
       )
       GoogleBillingVerify.acknowledge_purchase(package_name, googleSubProductId, purchaseToken)
       render json: plan.as_json(except: [:stripe_plan_id, :created_at, :updated_at, :interval, :price]), status: :ok
       else
         render json: { error: 'Invalid subscription' }, status: :unprocessable_entity
       end

     else
       render json: { error: 'Invalid subscription' }, status: :unprocessable_entity
     end


  end


  private
  def validate_plan_is_upgradeable
    @plan = Plan.not_google_subscription.find_by(id: params[:user][:plan_id])
    @errors = []

    if current_user.organization&.google_subscription_id.present?
      @errors.push('You are not allowed to upgrade this plan, please contact with the administrator!')
      return @errors
    end

    if @plan.blank?
      @errors.push('Please choose your plan first.')
    elsif !current_user.is_admin?
      @errors.push('You need to be admin to proceed.')
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

