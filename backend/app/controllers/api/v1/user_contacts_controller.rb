# frozen_string_literal: true

class Api::V1::UserContactsController < ApplicationController
  protect_from_forgery with: :null_session
  def index
    @user_contacts = UserContact.all
  end

  def create
    user_contact = UserContact.new(user_contact_params)
    if user_contact.save
      render json: user_contact, status: 201
    else
      render json: user_contact.errors, status: 422
    end
  end


  private
  def user_contact_params
    params.require(:user_contacts).permit(:first_name, :last_name, :email, :message)
  end
end
