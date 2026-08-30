class Api::V1::OrganizationsController < ActionController::Base
    protect_from_forgery with: :null_session
    skip_before_action :verify_authenticity_token
    respond_to :json

    def index 
        @organizations = Organization.where.not(name: "individual").select(:id, :name)
        render json: @organizations
    end

    def show 
        @organization = Organization.select(:id, :name, :description, :created_at).find(params[:id])
        render json: @organization
    end
end
