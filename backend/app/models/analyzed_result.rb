class AnalyzedResult < ApplicationRecord
  belongs_to :user_upload
  serialize :pattern, Array
  serialize :matched_data, Array

  scope :with_rule, ->(rule_name) { where(rule_name: rule_name)}
  scope :with_description, ->(description) { where(description: description)}
  scope :with_subrule, ->(subrule_id) { where(subrule_id: subrule_id)}
  scope :none_risk, ->() { where(severity: 5)}
  scope :critical_risk, ->() { where(severity: 4)}
  scope :high_risk, ->() { where(severity: 3)}
  scope :medium_risk, ->() { where(severity: 2)}
  scope :low_risk, ->() { where(severity: 1)}
  scope :no_risk, ->() { where(severity: 0)}
end
