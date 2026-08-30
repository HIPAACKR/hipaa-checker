class CreateSuggestions < ActiveRecord::Migration[6.1]
  def change
    create_table :suggestions do |t|
      t.string  :rule_id, null: false
      t.string  :subrule_id
      t.text    :expectations_from_hipaa
      t.string  :severity
      t.string  :vulnerability_category
      t.text    :code_snippet
      t.integer :priority
      t.string  :language
      t.text    :comment
      t.text    :resources

      t.timestamps
    end

    add_index :suggestions, :rule_id
    add_index :suggestions, :subrule_id
  end
end
