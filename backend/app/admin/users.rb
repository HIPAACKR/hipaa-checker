ActiveAdmin.register User do

  index do
    selectable_column
    id_column
    column :email
    column :organization do |u|
      u.organization.present? ? u.organization.name : (u.organization_name || 'Other')
    end
    column :first_name
    column :last_name
    column "Uploaded Today" do |user|
      user.user_upload_histories.for_today.count
    end
    column :created_at
    column "Admin?", :is_admin
    column "Approved?", :approved
    column "Is Locked" do |user|
      user.locked_at.present?
    end
    column "Is Confirmed" do |user|
      user.confirmed?
    end
    actions
  end

  collection_action :activities, method: :get do
    redirect_to root_url and return unless current_user.has_role? :super_admin
    @users = User.by_first_name
  end

  filter :email
  filter :first_name
  filter :last_name
  filter :created_at
  filter :organization, if: proc{ current_user.has_role?(:super_admin) }, collection: proc {
    Organization.not_individual
  }

  form do |f|
    f.inputs do
      f.input :email
      if f.object.organization.blank?
        f.input :organization_name
      end

      f.input :first_name
      f.input :last_name
      f.input :password
      f.input :password_confirmation
      f.input :is_admin, label: "Admin?"
      f.input :approved, label: "Approved?"
      f.input :roles, as: :check_boxes, collection: current_user.has_role?(:super_admin) ? Role.all : Role.where.not(name: :super_admin)
    end
    f.actions
  end

  batch_action :approve do |ids|
    batch_action_collection.find(ids).each do |user|
      user.update_column(:approved, true) if user.is_allowed_to_upload?
    end
    redirect_to collection_path, alert: "The selected users have been approved!."
  end

  batch_action :lock do |ids|
    batch_action_collection.find(ids).each do |user|
      user.lock_access!
    end
    redirect_to collection_path, alert: "The selected users have been locked!."
  end

  batch_action :unlock do |ids|
    batch_action_collection.find(ids).each do |user|
      user.unlock_access!
    end
    redirect_to collection_path, alert: "The selected users have been unlocked!."
  end

  batch_action :confirm do |ids|
    batch_action_collection.find(ids).each do |user|
      user.confirm
    end
    redirect_to collection_path, alert: "The selected users have been confirmed!."
  end

  controller do
    def new
      if current_user.is_admin? && current_user.organization.is_individual?
        redirect_to root_url and return
      else
        super
      end
    end
    def permitted_params
      if current_user.has_role?(:super_admin)
        params.permit(:user => [ :email, :password, :password_confirmation, :app_checking_count,
                                 :approved, :organization_id, :is_admin,
                                 role_ids: []])
      else
        params.permit(:user => [ :email, :password, :password_confirmation,
                                 :approved, :organization_id, :is_admin,
                                 role_ids: []])
      end

    end



    def scoped_collection
      if current_user.has_role?(:super_admin)
        super
      else
        User.where(organization_id: current_user.organization.id)
      end
    end
    def update
      if params[:user][:password].blank?
        params[:user].delete "password"
        params[:user].delete "password_confirmation"
      end

      if !resource.is_allowed_to_approve?
        redirect_to admin_users_path, alert: "User quota already exceeded, please upgrade your subscription plan" and return
      end
      super
    end
  end

end