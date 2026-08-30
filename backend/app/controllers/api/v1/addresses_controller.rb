class Api::V1::AddressesController < ApiController
  skip_before_action :verify_authenticity_token
  before_action :set_address, only: [:update, :destroy]
  public


  def create
    address = current_user.addresses.new(address_params)
    if address.save
      render json: address, status: :created
    else
      render json: address.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @address.destroy
    head :ok
  end

  def update
    if @address.update(address_params)
      render json: @address, status: :ok
    else
      render json: @address.errors, status: :unprocessable_entity
    end
  end

  private

  def set_address
    @address = current_user.addresses.find(params[:id])
  end



  def address_params
    params.require(:address).permit(:street_address, :city, :state, :postal_code, :country, :time_zone)
  end
end
