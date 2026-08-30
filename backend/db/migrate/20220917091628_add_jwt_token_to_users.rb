class AddJwtTokenToUsers < ActiveRecord::Migration[6.1]
  def change
    add_column :users, :jwt_token, :string
    unless index_exists? :users, :jwt_token
      add_index :users, :jwt_token
    end
  end
end
