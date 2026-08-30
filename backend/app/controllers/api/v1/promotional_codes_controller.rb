class Api::V1::PromotionalCodesController < ApplicationController
  protect_from_forgery with: :null_session

  def index
    @promotiopnal_codes = PromotionalCode.all
    render json: @promotiopnal_codes.as_json(except: [:id, :created_at, :updated_at, :stripe_coupon_id])
  end
end

