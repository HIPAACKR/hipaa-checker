class CreateAnalyzedResults < ActiveRecord::Migration[6.1]
  def change
    create_table :analyzed_results do |t|
      t.references :pattern, null: false, foreign_key: true
      t.string :filepath
      t.string :filename
      t.text :description
      t.integer :line_numbers, array: true, default: []

      t.timestamps
    end
  end
end
