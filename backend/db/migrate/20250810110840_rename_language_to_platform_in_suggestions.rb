class RenameLanguageToPlatformInSuggestions < ActiveRecord::Migration[6.1]
  def change
    rename_column :suggestions, :language, :platform
  end
end
