class AddExpireDateToPromotionalCodes < ActiveRecord::Migration[6.1]
  def change
    add_column :promotional_codes, :expire_date, :date
  end
end
