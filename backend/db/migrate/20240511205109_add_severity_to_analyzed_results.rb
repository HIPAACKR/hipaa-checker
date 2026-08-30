class AddSeverityToAnalyzedResults < ActiveRecord::Migration[6.1]
  def change
    add_column :analyzed_results, :severity, :integer
  end
end
