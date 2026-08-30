class AddAccessTokenAndRepoTypeToGithubUploads < ActiveRecord::Migration[6.1]
  def change
    add_column :github_uploads, :access_token, :text
    add_column :github_uploads, :repo_type, :string
  end
end
