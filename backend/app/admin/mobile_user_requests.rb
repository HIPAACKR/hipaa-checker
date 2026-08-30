ActiveAdmin.register MobileUserRequest, as: "App Check Requests" do
  menu if: proc { current_user.has_role?(:super_admin) }
  include Analytics
  permit_params :app_name, :package_name
  actions :all, except: [:new]

  action_item :generate_report, only: :show do
    link_to 'Generate Report', url_for(action: :generate_report, id: resource.id), method: :post
  end

  member_action :generate_report, method: :post do
    begin
      resource.update_column(:status, 1)
      user_upload = resource.user_upload
      user_upload.extract_apk(user_upload, ActiveStorage::Blob.service.path_for(user_upload.file.key))

      user_upload.analyzed_results.destroy_all
      filepath = "#{Rails.root}/extracted/#{user_upload.id}/java_sources"
      Dir.glob("#{Rails.root}/patterns/#{user_upload.pattern_path}/*").each do |file|
        android_rules = YAML.load_file(file)
        puts "Staring traverse and analysis... "
        user_upload.traverse(user_upload, filepath, android_rules, file)
        puts "Traverse and analysis ended ... "
      end
      resource.update_column(:status, 2)
      redirect_to admin_app_check_request_path(resource), notice: 'Reports are ready to check now.'
    rescue
      resource.update_column(:status, 3)
      redirect_to admin_app_check_request_path(resource), notice: 'There was an error generating report!'
    end

  end

  index do
    selectable_column
    id_column
    column :app_name
    column :package_name
    column :user
    column :status
    actions
  end

  filter :app_name
  filter :package_name

  form do |f|
    f.inputs do
      f.input :app_name
      f.input :package_name
      f.input :file, as: :file, input_html: { accept: 'apk' }
    end
    f.actions
  end

  show do
    attributes_table do
      row :id
      row :app_name
      row :package_name
      row :created_at
      row :status
      row 'Report' do
        link_to 'Show Report', report_user_upload_path(resource.user_upload), target: "_blank"
      end
    end
  end

  controller do
    def update
      user_upload = resource.user_upload || UserUpload.new
      user_upload.upload_type = 'Healthcare'
      user_upload.platform = 'apk'
      user_upload.environment = 'app'
      user_upload.file = params[:mobile_user_request][:file]
      user_upload.user = resource.user
      user_upload.save
      resource.user_upload = user_upload
      super
    end
  end

end