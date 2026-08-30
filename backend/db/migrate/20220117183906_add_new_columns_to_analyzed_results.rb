class AddNewColumnsToAnalyzedResults < ActiveRecord::Migration[6.1]
  def change
    add_column :analyzed_results, :pattern, :text
    add_column :analyzed_results, :matched_data, :text
  end
end
