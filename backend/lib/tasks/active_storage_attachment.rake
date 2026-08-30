namespace :active_storage_attachment do
  desc "Renames attachment's name `apk` to `file`"
  task :rename_apk_to_file => :environment do
    ActiveStorage::Attachment.where(name: 'apk').update_all(name: 'file')
  end
end