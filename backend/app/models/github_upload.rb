class GithubUpload < ApplicationRecord

  belongs_to :user
  belongs_to :user_upload, optional: true

  after_create_commit :create_user_upload_from_github_url

  validates :github_url, presence: true
  validates :platform, presence: true
  validates :repo_type, inclusion: { in: %w(public private), message: "%{value} is not a valid(use either public or private)" }
  validates :access_token, presence: true, if: Proc.new { |github_upload| github_upload.private_repo? }

  def create_user_upload_from_github_url
    self.make_zip_from_github_url
    self.create_user_upload
  end

  def repo_name
    self.github_url.split("/").last.gsub(".git","")
  end

  def saved_zip_file_path
    "#{Rails.root}/github_uploads/#{self.id}/#{self.repo_name}.zip"
  end

  def saved_zip_folder_path
    "#{Rails.root}/github_uploads/#{self.id}"
  end

  def private_repo?
    self.repo_type == 'private'
  end
  private
  def make_zip_from_github_url
    if self.private_repo?
      url = self.github_url
      repo_path = url.sub("https://github.com/", "")
      clonable_url = "https://#{self.access_token}@github.com/#{repo_path}"
      #`cd #{Rails.root}/github_uploads && mkdir #{self.id} && cd #{self.id} && export GIT_TERMINAL_PROMPT=0 && git clone #{clonable_url}`
      output = `cd #{Rails.root}/github_uploads && mkdir #{self.id} && cd #{self.id} && git clone #{clonable_url}`
      unless $?.success?
        puts output
        raise "Something went wrong"
      end
    else
      `cd #{Rails.root}/github_uploads && mkdir #{self.id} && cd #{self.id} && git clone #{self.github_url}`
    end
    `cd #{Rails.root}/github_uploads && cd #{self.id} && zip -r #{self.repo_name}.zip #{self.repo_name}`
  end

  def create_user_upload
    user_upload = self.user.user_uploads.new
    user_upload.upload_type = 'Healthcare'
    user_upload.platform = self.platform
    if self.platform == "ios" or self.platform == "apk"
      user_upload.environment = 'app'
    else
      user_upload.environment = 'web application'
    end
    user_upload.file.attach(io: File.open(self.saved_zip_file_path), filename: "#{self.repo_name}.zip", content_type: 'application/zip')
    if user_upload.save
      self.update_column(:user_upload_id, user_upload.id)
      FileUtils.rm_rf(self.saved_zip_folder_path) if Dir.exist?(self.saved_zip_folder_path)
    end
  end

end
