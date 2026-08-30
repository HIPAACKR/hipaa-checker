class RemoveLineNumbersFromAnalyzedResults < ActiveRecord::Migration[6.1]
  def change
    remove_column :analyzed_results, :line_numbers

  end
end
