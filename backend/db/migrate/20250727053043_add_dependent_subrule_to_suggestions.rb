class AddDependentSubruleToSuggestions < ActiveRecord::Migration[6.1]
  def change
    add_column :suggestions, :dependent_subrule, :string
  end
end
