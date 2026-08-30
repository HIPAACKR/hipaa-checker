class Api::V1::PlansController < ApplicationController
  protect_from_forgery with: :null_session

  def index
    @plans = Plan.not_google_subscription.order(price: :asc).active
    render json: @plans
  end
end
