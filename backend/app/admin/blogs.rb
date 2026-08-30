# app/admin/blogs.rb
ActiveAdmin.register Blog do
  # Strong parameters
  permit_params :title, :body

  index do
    selectable_column
    id_column
    column :title
    column :writer_name
    column :created_at
    column :updated_at
    actions
  end

  show do
    attributes_table do
      row :id
      row :title
      row :category
      row :writer_name
      row :read_time
      row :description

      row :photo do |blog|
        if blog.photo_url.present?
          image_tag blog.photo_url, style: "max-width: 300px;"
        else
          status_tag "No image"
        end
      end

      row :body do |blog|
        pre blog.body
      end

      row :created_at
      row :updated_at
    end
  end

  form actions: false do |f|
    render partial: "admin/blogs/form", locals: { f: f }

    actions do
      f.cancel_link
    end
  end




end
