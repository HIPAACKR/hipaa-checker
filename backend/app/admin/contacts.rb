ActiveAdmin.register UserContact do
  actions :index, :show
  index do
    selectable_column
    id_column
    column :first_name
    column :last_name
    column :email
    column :message
    column :created_at
    actions
  end

  show do
    attributes_table do
      row :id
      row :first_name
      row :last_name
      row :email
      row :message
      row :created_at
      row :updated_at
    end
  end
end