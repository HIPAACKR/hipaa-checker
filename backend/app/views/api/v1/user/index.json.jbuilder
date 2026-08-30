json.user do
  json.id                       @user.id
  json.email                    @user.email
  json.first_name               @user.first_name
  json.last_name                @user.last_name
  json.phone_number             @user.phone_number
  json.created_at               @user.created_at
  json.is_accept_terms          @user.is_accept_terms?
  json.user_uploads_count       @user.user_uploads.count
  json.total_high_risks         AnalyzedResult.high_risk.where(user_upload_id: @user.user_uploads.select(:id)).count
  json.total_medium_risks       AnalyzedResult.medium_risk.where(user_upload_id: @user.user_uploads.select(:id)).count
  json.total_low_risks          AnalyzedResult.low_risk.where(user_upload_id: @user.user_uploads.select(:id)).count
  json.total_no_risks           AnalyzedResult.no_risk.where(user_upload_id: @user.user_uploads.select(:id)).count
  json.roles                    @user.roles.map { |role| role.as_json(only: [:id, :name]) }
  json.is_admin                 @user.is_admin
  if @user.addresses.present?
    json.addresses @user.addresses do |address|
      json.id             address.id
      json.street_address address.street_address
      json.city           address.city
      json.state          address.state
      json.country        address.country
      json.postal_code    address.postal_code
      json.time_zone      address.time_zone
    end
  end
  if @user.organization.present?
    unless @user.organization.individual?
      json.organization do
        json.name                       @user.organization.name
        json.stripe_subscription_id     @user.organization.stripe_subscription_id
      end
    end
    if @user.organization&.plan.present?
      json.plan do
        json.name                           @user.organization.plan.name
        json.price                          @user.organization.plan.price
        json.user_count                     @user.organization.plan.user_count
        json.max_member_count               @user.organization.plan.user_count
        json.current_member_count           @user.organization.users.count
        json.is_active                      @user.organization.plan.is_active
        json.max_upload_quota               @user.organization.plan.max_upload_quota
        json.limit_per_day                  @user.organization.plan.limit_per_day
        json.get_hipaa_score                @user.organization.plan.get_hipaa_score
        json.get_vulnerability_breakdown    @user.organization.plan.get_vulnerability_breakdown
        json.get_summerized_reports         @user.organization.plan.get_summerized_reports
        json.get_specific_reports           @user.organization.plan.get_specific_reports
        json.view_source_code               @user.organization.plan.view_source_code
        json.fix_vulnerabilities            @user.organization.plan.fix_vulnerabilities
        json.support_multiple_device        @user.organization.plan.support_multiple_device
        json.support_customer_service       @user.organization.plan.support_customer_service
        json.support_dashboard_service      @user.organization.plan.support_dashboard_service
        json.support_hipaa_experts          @user.organization.plan.support_hipaa_experts
      end
    end

    if @user.organization&.promotional_code.present?
      json.promotional_code do
        json.id             @user.organization&.promotional_code_id
        json.code           @user.organization&.promotional_code.code
        json.discount       @user.organization&.promotional_code.discount
        json.discount_type  @user.organization&.promotional_code.discount_type
      end
    end
  end

  if @user&.organization&.stripe_customer_id
    customer = Stripe::Customer.retrieve(@user.organization.stripe_customer_id)
    default_card = Stripe::Customer.retrieve_source(
      @user&.organization&.stripe_customer_id,
      customer.default_source
    ) rescue nil
    json.default_card default_card
  end

end
