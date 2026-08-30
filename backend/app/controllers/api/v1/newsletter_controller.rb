# frozen_string_literal: true

class Api::V1::NewsletterController < ApplicationController
  protect_from_forgery with: :null_session
  def index
    @newsletters = Newsletter.all
  end
  def create
    email = newsletter_params[:email].to_s.strip.downcase

    if Newsletter.exists?(email: email)
      render json: { error: "Email already exists" }, status: :unprocessable_entity
      return
    end

    newsletter = Newsletter.new(email: email)

    if newsletter.save
      render json: newsletter, status: :created
    else
      render json: newsletter.errors, status: :unprocessable_entity
    end
  end

  private
  def newsletter_params
    params.require(:newsletter).permit(:email)
  end
end
