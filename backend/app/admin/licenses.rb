ActiveAdmin.register License do
  permit_params :user_id, :is_active, :expires_on
  actions :all, if: proc { current_user.has_role?(:super_admin) }
  menu if: proc { current_user.has_role?(:super_admin) }
  filter :license_key

  index do
    selectable_column
    id_column
    column "User" do |license|
      license.user.email
    end
    column "License Key" do |license|
      "#{license.license_key[0..30]}..."
    end
    column :is_active
    column :created_at
    actions
  end

  form do |f|
    f.inputs do
      f.input :user_id, as: :select, collection: User.order(email: :asc).select(:id, :email).pluck(:email, :id)
      f.input :license_key unless f.object.new_record?
      f.input :expires_on, as: :datepicker, input_html: { autocomplete: "off" }
      f.input :is_active
    end
    f.actions
  end

  show do
    attributes_table do
      row :id
      row :user
      row :license_key
      row :is_active
      row :created_at
      row :expires_on
    end

    panel "License Logs #{license.license_logs.count}" do
      table_for license.license_logs do
        column :id
        column :ip_address
        column :user_agent
        column :request_method
        column :request_protocol
        column :created_at
      end
    end
  end

  controller do
    def create
      super
    end
  end

end