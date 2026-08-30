class AddFieldsToBlogs < ActiveRecord::Migration[6.1]
  def change
    add_column :blogs, :writer_name, :string
    add_column :blogs, :read_time, :integer
    add_column :blogs, :category, :string
    add_column :blogs, :description, :text
    add_column :blogs, :photo_url, :string
  end
end
