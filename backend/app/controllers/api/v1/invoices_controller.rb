class Api::V1::InvoicesController < ApiController
  before_action :authenticate_user!
  def index
    customer_id = current_user.organization.stripe_customer_id
    @invoices = Stripe::Invoice.list(customer: customer_id, status: "paid", limit: 100).data.reject { |i| i.total.to_i == 0 }
  end

  def show
    @invoice = Stripe::Invoice.retrieve(params[:id])
  end
end
