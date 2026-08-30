class AddRuleNameToAnalyzedResults < ActiveRecord::Migration[6.1]
  def change
    add_column :analyzed_results, :rule_name, :string
  end
end
