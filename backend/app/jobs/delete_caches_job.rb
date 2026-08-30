# app/jobs/delete_caches_job.rb
class DeleteCachesJob < ApplicationJob
  queue_as :default
  discard_on ActiveRecord::RecordNotFound  # safety if any find sneaks in

  def perform(upload_id, user_id)
    delete_rule_wise_caches(upload_id)
    delete_file_wise_caches(upload_id)

    if (user = User.find_by(id: user_id))
      user.delete_dashboard_caches
    end
  end

  private

  def delete_rule_wise_caches(upload_id)
    Rails.cache.delete_matched("jbuilder/views/rule_wise_user_upload_#{upload_id}_*")
  end

  def delete_file_wise_caches(upload_id)
    Rails.cache.delete_matched("jbuilder/views/file_wise_user_upload_#{upload_id}_*")
  end

end
