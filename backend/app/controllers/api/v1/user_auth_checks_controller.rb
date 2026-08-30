class Api::V1::UserAuthChecksController < ApiController

  # Renders with http code 200 if this api end point is accessible
  def index
    render json: {}, status: :ok
  end

end
