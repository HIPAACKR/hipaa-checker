class AddIsAcceptTermsToUsers < ActiveRecord::Migration[6.1]
  def change
    add_column :users, :is_accept_terms, :boolean, default: false
  end
end
