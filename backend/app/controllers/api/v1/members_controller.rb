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
