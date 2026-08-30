class AddUserUploadReferenceToAnalyzedResults < ActiveRecord::Migration[6.1]
  def change
    add_reference :analyzed_results, :user_upload, null: false, foreign_key: true
  end
end
