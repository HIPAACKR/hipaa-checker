# frozen_string_literal: true


class Api::V1::RolesController < ApplicationController
  protect_from_forgery with: :null_session

  def index
    @roles = Role.where.not(name: 'super_admin').select('id','name')
    render json: @roles
  end
end



