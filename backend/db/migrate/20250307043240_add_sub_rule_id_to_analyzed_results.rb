class AddSubRuleIdToAnalyzedResults < ActiveRecord::Migration[6.1]
  def change
    add_column :analyzed_results, :subrule_id, :string
  end
end
