class Suggestion < ApplicationRecord
  # Add validations, associations, or methods here as needed
  has_rich_text :comment
  has_rich_text :code_snippet
  has_rich_text :expectations_from_hipaa
end
