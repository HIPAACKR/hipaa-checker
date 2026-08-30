class Api::V1::MembersController < ApiController
  before_action :load_current_organization_users

  def index
    @users = load_current_organization_users.paginate(page: params[:page], per_page:50)
  end

  def show
    @user = load_current_organization_users.find(params[:id])
  end

  def update
    @user = load_current_organization_users.find(params[:id])
    @user.skip_confirmation_notification!
    if @user.update(member_params)
      render "api/v1/members/show"
    else
      render json: {errors: @user.errors.full_messages}, status: :unprocessable_entity
    end
  end

  def destroy
    @user = load_current_organization_users.find(params[:id])
    @user.destroy
    render json: {}, status: :ok
  end

  def resend_invitation
    @user = load_current_organization_users.find(params[:id])
    unless @user.invitation_accepted_at.present?
      @user.invite!
      render json: {}, status: :ok
    else
      render json: {errors: ["User has already accepted invitation"]}, status: :unprocessable_entity
    end
  end

  def invite
    unless current_user.is_allowed_to_invite?
      render json: {errors: ["User quota already exceeded, please upgrade your subscription plan"]}, status: :unprocessable_entity and return
    end
    email = params[:email]
    user = User.find_by(email: email)
    if user.blank?
      user = User.invite!(
        email: email,
        organization_id: current_user.organization_id,
        invited_by_id: current_user.id
      )
      render json: user.as_json(only: [:id, :email]), status: :ok
    else
      render json: {errors: ["User already exists"]}, status: :unprocessable_entity
    end
  end


  private
  def member_params
    params.require(:member).permit(
      :email, :first_name, :last_name, :is_admin,
      :confirmed_at, role_ids: []
    ).tap do |whitelisted|
      whitelisted[:role_ids] -= [Role.find_by(name: 'super_admin')&.id] if whitelisted[:role_ids]
    end
  end

  def load_current_organization_users
    current_user.organization.users.where.not(id: current_user.id)
  end

end
