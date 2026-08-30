class RemovePatternReferenceFromAnalyzedResults < ActiveRecord::Migration[6.1]
  def change
    remove_reference :analyzed_results, :pattern, null: false, foreign_key: true
  end
end
