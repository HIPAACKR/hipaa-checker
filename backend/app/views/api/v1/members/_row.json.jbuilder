json.id                         user.id
json.email                      user.email
json.first_name                 user.first_name
json.last_name                  user.last_name
json.created_at                 user.created_at
json.is_confirmed               user.confirmed_at.present?
json.has_invitation_accepted    user.invitation_accepted_at.present?
json.roles                      user.roles.map { |role| role.as_json(only: [:id, :name]) }
json.is_admin                   user.is_admin?
json.uploaded_today_count       user.user_upload_histories.for_today.count
json.uploaded_total_count       user.user_upload_histories.count


