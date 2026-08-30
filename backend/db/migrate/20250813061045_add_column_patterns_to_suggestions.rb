class AddColumnPatternsToSuggestions < ActiveRecord::Migration[6.1]
  def change
    add_column :suggestions, :patterns, :string, array: true, default: []
  end
end
