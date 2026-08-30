class AddIndexing < ActiveRecord::Migration[6.1]
  def change
    if index_exists? :analyzed_results, :description
      add_index :analyzed_results, :description
    end
    if index_exists? :analyzed_results, :filepath
      add_index :analyzed_results, :filepath
    end
    if index_exists? :analyzed_results, :rule_name
      add_index :analyzed_results, :rule_name
    end
    if index_exists? :analyzed_results, :severity
      add_index :analyzed_results, :severity
    end

  end
end
