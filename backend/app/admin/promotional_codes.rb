ActiveAdmin.register PromotionalCode do
  permit_params :code, :discount, :discount_type, :promotional_length, :expire_date
  actions :all, if: proc { current_user.has_role?(:super_admin) }
  menu if: proc { current_user.has_role?(:super_admin) }
  filter :code

  index do
    selectable_column
    id_column
    column :code
    column :discount
    column :discount_type
    column :promotional_length
    column :expire_date
    actions
  end

  form do |f|
    f.inputs do
      f.input :code
      f.input :discount
      f.input :discount_type, as: :select, collection: ['fixed', 'percentage'], include_blank: false
      f.input :promotional_length, label: "Promotional Length (Months)"
      f.input :expire_date, as: :datepicker, input_html: { autocomplete: "off" }
    end
    f.actions
  end

end
