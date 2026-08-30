ActiveAdmin.register Organization do
  permit_params :name, :description
  actions :all, if: proc { current_user.has_role?(:super_admin) }
  menu if: proc { current_user.has_role?(:super_admin) }

  index do
    selectable_column
    id_column
    column :name
    column :users_count do |organization|
      organization.users.count
    end
    column :subscription_plan do |organization|
      if organization.plan.present?
        link_to organization.plan.name, admin_plan_path(organization.plan)
      else
        "Not subscribed yet"
      end
    end
    actions
  end

  filter :name

  form do |f|
    f.inputs do
      f.input :name
      f.input :description
    end
    f.actions
  end

  controller do
    def scoped_collection
      Organization.not_individual
    end
  end

end