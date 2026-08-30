ActiveAdmin.register Plan do
  menu priority: 2, if: proc { current_user.has_role?(:super_admin) }
  permit_params :name, :price, :user_count, :interval, :is_active, :max_upload_quota,
    :limit_per_day, :can_use_doc_scan, :can_use_sast, :can_use_dast
  actions :all, except: [:destroy]

  index do
    selectable_column
    id_column
    column :name
    column :price
    column :stripe_price_id
    column "Max Allowed Users" do |plan|
      plan.user_count
    end
    column :interval
    column "Max Upload Quota Per Day(Per User)" do |plan|
      plan.limit_per_day
    end
    column :can_use_doc_scan
    column :can_use_sast
    column :can_use_dast
    column :is_active
    actions
  end

  filter :name

  form do |f|
    f.inputs do
      f.input :is_active
      if f.object.new_record?
        f.input :name
        f.input :price
        f.input :interval, as: :select, collection: %w[month year week]
      else
        f.input :name , input_html: { disabled: true }
      end
      f.input :user_count, label: "Max User Count"
      f.input :limit_per_day, label: "Max Upload Per Day(Per User)"
      f.input :can_use_doc_scan, label: "Doc Scan / HIPAA reports"
      f.input :can_use_sast, label: "SAST / source code"
      f.input :can_use_dast, label: "DAST / vulnerability breakdown"
    end
    f.actions
  end

  controller do
    def create
      super
    end
  end

end
