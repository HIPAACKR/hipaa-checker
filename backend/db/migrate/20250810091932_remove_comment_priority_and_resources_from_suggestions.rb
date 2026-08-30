class RemoveCommentPriorityAndResourcesFromSuggestions < ActiveRecord::Migration[6.1]
  def change
    remove_column :suggestions, :comment, :string
    remove_column :suggestions, :priority, :string
    remove_column :suggestions, :resources, :string
  end
end
