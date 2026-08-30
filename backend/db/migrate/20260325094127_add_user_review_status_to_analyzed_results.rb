class AddUserReviewStatusToAnalyzedResults < ActiveRecord::Migration[6.1]
  def change
    add_column :analyzed_results, :user_review_status, :string
  end
end
