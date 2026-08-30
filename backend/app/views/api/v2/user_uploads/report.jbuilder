json.user_upload do
  json.partial! "api/v2/user_uploads/row", user_upload: @user_upload
  if @user.organization.present?
    unless @user.organization.individual?
      json.organization do
        json.name @user.organization.name
        json.contact @user.email
      end
    end
  end
  json.report do
    json.rules @user_upload.compliance_officer_report(@rules2)[:rules]
    json.reference_url @user_upload.compliance_officer_report(@rules2)[:reference_url]
  end
end
