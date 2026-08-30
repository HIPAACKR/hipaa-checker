class CreateNewsletters < ActiveRecord::Migration[6.1]
  def change
    create_table :newsletters, if_not_exists: true do |t|
      t.string :email

      t.timestamps
    end
  end
end
