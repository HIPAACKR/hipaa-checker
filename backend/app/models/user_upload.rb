class UserUpload < ApplicationRecord
  include Analytics
  enum status: { pending: 0, uploading: 1, extracting: 2, extracted: 3, report_generating: 4, report_generated: 5, failed: 6 }
  belongs_to :user, touch: true
  has_one_attached :file , dependent: :purge
  validates :file, content_type: %w[application/vnd.android.package-archive application/zip],
            presence: true, size: { less_than: 700.megabytes }
  validates :environment, presence: true
  validates :platform, presence: true
  validates :project_identifier, uniqueness: true, allow_nil: true

  scope :recent, -> { order(created_at: :desc) }

  after_create :create_user_upload_history
  after_commit :delete_caches

  UPLOAD_TYPES =  ["Healthcare", "Non-Healthcare"]
  PLATFORMS = ['apk','ios', 'laravel', 'django', 'ror', 'express', 'spring', 'dotnet'].freeze
  ENVIRONMENTS = ['app', 'web application'].freeze
  HIPAA_RULES = [
    {
      rule_id: "encryption_decryption",
      rule_name: "Implementation of encryption and decryption",
      hipaa_policy: "Implement a mechanism to encrypt and decrypt electronic protected health information.",
      hipaa_policy_reference: "§ 164.312(a)(2)(iv)",
      high_risk_count: nil,
      medium_risk_count: nil,
      low_risk_count: nil,
      no_risk_count: nil,
      sub_rules: []
    },
    {
      rule_id: "audit",
      rule_name: "Implementing audit controls to record and examine activity that contain or use PHI",
      hipaa_policy: "Implement hardware, software, and/or procedural mechanisms that record and examine activity in information systems that contain or use electronic protected health information.",
      hipaa_policy_reference: "§ 164.312(b)",
      high_risk_count: nil,
      medium_risk_count: nil,
      low_risk_count: nil,
      no_risk_count: nil,
      sub_rules: []
    },
    {
      rule_id: "phi_encryption",
      rule_name: "Encrypt PHI whenever appropriate",
      hipaa_policy: "Implement a mechanism to encrypt electronic protected health information whenever deemed appropriate",
      hipaa_policy_reference: "§ 164.312(e)(2)(ii)",
      high_risk_count: nil,
      medium_risk_count: nil,
      low_risk_count: nil,
      no_risk_count: nil,
      sub_rules: []
    },
    {
      rule_id: "unique_id",
      rule_name: "Assigning unique id for identifying and tracking patient’s identity",
      hipaa_policy: "Assign a unique name and/or number for identifying and tracking user identity",
      hipaa_policy_reference: "§ 164.312(a)(2)(i)",
      high_risk_count: nil,
      medium_risk_count: nil,
      low_risk_count: nil,
      no_risk_count: nil,
      sub_rules: []
    },
    {
      rule_id: "user_inactivity",
      rule_name: "Implementing procedures to terminate a session after a predetermined time of inactivity",
      hipaa_policy: "Implement electronic procedures that terminate an electronic session after a predetermined time of inactivity.",
      hipaa_policy_reference: "§ 164.312(a)(2)(iii)",
      high_risk_count: nil,
      medium_risk_count: nil,
      low_risk_count: nil,
      no_risk_count: nil,
      sub_rules: []
    },
    {
      rule_id: "user_authentication",
      rule_name: "Implement authentication procedures to verify that a person or entity seeking access to PHI is the one claimed",
      hipaa_policy: "Implement procedures to verify that a person or entity seeking access to electronic protected health information is the one claimed",
      hipaa_policy_reference: "§ 164.312(d)",
      high_risk_count: nil,
      medium_risk_count: nil,
      low_risk_count: nil,
      no_risk_count: nil,
      sub_rules: []
    },
    {
      rule_id: "authorization",
      rule_name: "Providing access controls to allow PHI access only to persons or programs that have been granted access rights",
      hipaa_policy: "Implement electronic mechanisms to corroborate that electronic protected health information has not been altered or destroyed in an unauthorized manner.",
      hipaa_policy_reference: "§ 164.312(c)(2)",
      high_risk_count: nil,
      medium_risk_count: nil,
      low_risk_count: nil,
      no_risk_count: nil,
      sub_rules: []
    },
    {
      rule_id: "guard_against_com_network",
      rule_name: "Implement technical security measures to guard against unauthorized access to PHI that is being transmitted over communications network",
      hipaa_policy: "Implement technical security measures to guard against unauthorized access to electronic protected health information that is being transmitted over an electronic communications network",
      hipaa_policy_reference: "§ 164.312(e)(1)",
      high_risk_count: nil,
      medium_risk_count: nil,
      low_risk_count: nil,
      no_risk_count: nil,
      sub_rules: []
    },
    {
      rule_id: "data_integrity",
      rule_name: "Maintain PHI data integrity to prevent improper alteration or destruction",
      hipaa_policy: "Implement policies and procedures to protect electronic protected health information from improper alteration or destruction.",
      hipaa_policy_reference: "§ 164.312(c)(1)",
      high_risk_count: nil,
      medium_risk_count: nil,
      low_risk_count: nil,
      no_risk_count: nil,
      sub_rules: []
    },
    {
      rule_id: "authorization_for_destruction",
      rule_name: "Mechanisms to corroborate that PHI has not been altered or destroyed in an unauthorized manner",
      high_risk_count: nil,
      medium_risk_count: nil,
      low_risk_count: nil,
      no_risk_count: nil,
      sub_rules: []
    },
    {
      rule_id: "transmition_secuirity",
      rule_name: "Implement measures to ensure that transmitted PHI is not improperly modified without detection until disposed of",
      hipaa_policy: "Implement security measures to ensure that electronically transmitted electronic protected health information is not improperly modified without detection until disposed of",
      hipaa_policy_reference: "§ 164.312(e)(2)(i)",
      high_risk_count: nil,
      medium_risk_count: nil,
      low_risk_count: nil,
      no_risk_count: nil,
      sub_rules: []
    },
  ].freeze

  has_many :analyzed_results, dependent: :destroy

  after_create :set_filename

  def extracted_files_directory
    "http://localhost:8000/#{self.id}/#{self.file.filename.to_s.gsub(".apk","")}"
  end

  def is_healthcare
    self.upload_type == "Healthcare"
  end

  def is_extracted?
    File.exists?("#{Rails.root}/extracted/#{self.id}")
  end

  def web_application?
    self.environment == 'web application'
  end

  def app?
    self.environment == 'app'
  end

  def apk?
    self.platform == 'apk'
  end

  def ios?
    self.platform == 'ios'
  end

  def pattern_path
    path = ""
    if is_healthcare
      if app?
        if ios?
          path = "released/ios"
        else
          path = "released/android"
        end
      elsif web_application?
        path = "released/#{self.platform}"
      end
    else
      if app?
        if ios?
          path = "non_healthcare/ios"
        else
          path = "non_healthcare/android"
        end
      elsif web_application?
        path = "released/#{self.platform}"
      end
    end
    path
  end

  def reports_as_hash(rules)
    rules.each do |rule|
      rule[:sub_rules] = []
      rule[:high_risk_count] = self.analyzed_results.with_rule(rule[:rule_id]).high_risk.count
      rule[:medium_risk_count] = self.analyzed_results.with_rule(rule[:rule_id]).medium_risk.count
      rule[:low_risk_count] = self.analyzed_results.with_rule(rule[:rule_id]).low_risk.count
      rule[:no_risk_count] = self.analyzed_results.with_rule(rule[:rule_id]).no_risk.count
      sub_rules = YAML.load_file("#{Rails.root}/patterns/#{pattern_path}/#{rule[:rule_id]}.yaml") rescue []
      sub_rules.each do |sub_rule|
        analyzed_results = self.analyzed_results.with_rule(rule[:rule_id]).with_subrule(sub_rule["id"])
        severity_from_db = self.analyzed_results
                               .with_rule(rule[:rule_id])
                               .with_subrule(sub_rule["id"])
                               .pluck(:severity)
        rule[:sub_rules] << (
          {
            id: sub_rule["id"],
            description: sub_rule["description"],
            severity: severity_from_db.first,
            count: analyzed_results.count,
            files: analyzed_results.collect{|analyzed_result| {
              file_name: analyzed_result.filename,
              file_id: analyzed_result.id,
              matched_data: analyzed_result.matched_data.reject{|matched_data| matched_data.empty? }}
            },
            checked: analyzed_results.exists?
          }
        )
      end
    end
  end

  def compliance_officer_report(rules)
    report = {rules: [], hipaa_risk_scores: nil, reference_url: "https://www.hhs.gov/sites/default/files/ocr/privacy/hipaa/administrative/securityrule/techsafeguards.pdf"}
    rules.each do |rule|
      hash = {}
      hash[:rule_id] = rule[:rule_id]
      hash[:rule_name] = rule[:rule_name]
      hash[:hipaa_policy] = rule[:hipaa_policy]
      hash[:hipaa_policy_reference] = rule[:hipaa_policy_reference]
      hash[:high_risk_count] = self.analyzed_results.with_rule(rule[:rule_id]).high_risk.count
      hash[:medium_risk_count] = self.analyzed_results.with_rule(rule[:rule_id]).medium_risk.count
      hash[:low_risk_count] = self.analyzed_results.with_rule(rule[:rule_id]).low_risk.count
      hash[:no_risk_count] = self.analyzed_results.with_rule(rule[:rule_id]).no_risk.count
      report[:rules].push(hash)
    end
    report
  end

  def hipaa_risk_scores(rules)
    results = []
    rules.each do |rule|
      hash = {}
      hash[:rule_id] = rule[:rule_id]
      sub_rules = []
      sub_rule_files = YAML.load_file("#{Rails.root}/patterns/#{pattern_path}_cvss/#{rule[:rule_id]}.yaml") rescue []
      sub_rule_files.each do |sub_rule_file|
        base = self.analyzed_results
                   .with_rule(rule[:rule_id])
                   .with_subrule(sub_rule_file["id"])
        ignored_results = base.where(user_review_status: "ignore")
        impacts = (sub_rule_file["vulnerability_impacts"] || []).map { |i| i.deep_dup rescue i.dup }
        if ignored_results.exists?
          impacts.each { |impact| impact["severity"] = "optimal" }
        end
        sub_rules << {
          subrule_id: sub_rule_file["id"],
          count: base.count,
          vulnerability_impacts: impacts
        }
      end
      hash[:sub_rules] = sub_rules
      results << hash
    end
    return {
      analyzed_results: results
    }
  end
  def count_severity(rules)

    severity_counts = Hash.new(0)

    # Mapping severity labels to descriptive names
    severity_mapping = {
      "0" => "no_risk",
      "1" => "low_risk",
      "2" => "medium_risk",
      "3" => "high_risk",
      "4" => "critical_risk"
    }
    rules.each do |rule|
      sub_rules = YAML.load_file("#{Rails.root}/patterns/#{pattern_path}_cvss/#{rule[:rule_id]}.yaml") rescue []
      sub_rules.each do |sub_rule|
        analyzed_results = self.analyzed_results.with_rule(rule[:rule_id]).with_subrule(sub_rule["id"]).where.not(user_review_status: "ignore")
        severity_label = analyzed_results.pluck(:severity)

        # Increment descriptive severity count
        severity_key = severity_mapping[severity_label.first.to_s]
        severity_counts[severity_key] += analyzed_results.count if severity_key
      end
    end
    self.update!(
      critical_risk: severity_counts["critical_risk"],
      high_risk: severity_counts["high_risk"],
      medium_risk: severity_counts["medium_risk"],
      low_risk: severity_counts["low_risk"],
      no_risk: severity_counts["no_risk"]
    )

    {  severity_counts: severity_counts }
  end

  def dashboard_report_as_hash()


    severity_counts = {
      "no_risk"       => self.no_risk || 0,
      "low_risk"      => self.low_risk || 0,
      "medium_risk"   => self.medium_risk || 0,
      "high_risk"     => self.high_risk || 0,
      "critical_risk" => self.critical_risk || 0
    }

    { severity_counts: severity_counts }
  end




  def cvss_reports_as_hash(rules)
    rules.each do |rule|
      rule[:sub_rules] = []
      sub_rules = YAML.load_file("#{Rails.root}/patterns/#{pattern_path}_cvss/#{rule[:rule_id]}.yaml") rescue []
      sub_rules.each do |sub_rule|
        analyzed_results = self.analyzed_results.with_rule(rule[:rule_id]).with_subrule(sub_rule["id"]).where.not(user_review_status: "ignore")
        subruleid_db = analyzed_results.pluck(:subrule_id)
        severities_db = analyzed_results.pluck(:severity)
        vulnerability_db = analyzed_results.pluck(:vulnerability_cat)
        next if analyzed_results.count.zero?
        next if analyzed_results.where.not(user_review_status: "ignore").none?
        rule[:sub_rules] << (
          {
            id: subruleid_db.first,
            description: sub_rule["description"],
            severity: severities_db.first,
            vulnerability_cat:  vulnerability_db.first,
            count: analyzed_results.count,
            files: analyzed_results.collect{|analyzed_result| {
              file_name: analyzed_result.filename,
              file_id: analyzed_result.id,
              manual_check: analyzed_result.user_review_status,
              matched_data: analyzed_result.matched_data.reject{|matched_data| matched_data.empty? }}
            },
            checked: analyzed_results.exists?
          }
        )
      end
    end
  end

  def reports_file_wise(analyzed_results, severity=nil)
    results = []

    fs_analyzed_results = AnalyzedResult.where(filepath: analyzed_results.pluck(:filepath))
    if severity.present?
      fs_analyzed_results = fs_analyzed_results.where(severity: severity)
    end

    analyzed_results.each do |analyzed_result|
      file_results = fs_analyzed_results.where(filepath: analyzed_result.filepath)
      hash = {
        filename: analyzed_result.filepath.split("/").last,
        file_id: analyzed_result.id,
        rules: [],

      }



      severity_mapping = {
        "0" => "no_risk",
        "1" => "low_risk",
        "2" => "medium_risk",
        "3" => "high_risk",
        "4" => "critical_risk"
      }

      UserUpload::HIPAA_RULES.dup.each do |hipaa_rule|
        severity_counts = Hash.new(0)
        rule = {

          rule_id: hipaa_rule[:rule_id],
          description: hipaa_rule[:rule_name],
          sub_rules: (YAML.load_file("#{Rails.root}/patterns/#{pattern_path}/#{hipaa_rule[:rule_id]}.yaml") rescue []).collect do |sub_rule|

            sub_rule_analyzed_results = fs_analyzed_results.with_rule(hipaa_rule[:rule_id]).with_subrule(sub_rule["id"]).where.not(user_review_status: "ignore")
            count =(sub_rule_analyzed_results.collect{|code_segment| code_segment.matched_data.flatten }.flatten rescue []).count
            severity_comp = (sub_rule["vulnerability_impacts"] || []).collect { |impact|
              HipaaRiskScoreCalculator::SEVERITY_LABELS[impact["severity"].to_sym]
            }.first
            severity_key = severity_mapping[severity_comp.to_s]
            severity_counts[severity_key] += count if count > 0
            severities_db = sub_rule_analyzed_results.pluck(:severity)
            vulnerability_db = sub_rule_analyzed_results.pluck(:vulnerability_cat)
            subrule_id_db = sub_rule_analyzed_results.pluck(:subrule_id)
            next if severities_db.blank?
            {
              subrule_id: subrule_id_db.first,
              description: sub_rule["description"],
              severity: severity_comp,
              vulnerability_cat: vulnerability_db.first,
              count: (sub_rule_analyzed_results.collect{|code_segment| code_segment.matched_data.flatten }.flatten rescue []).count,
              code_segments: (sub_rule_analyzed_results.collect{|code_segment| code_segment.matched_data.flatten }.flatten rescue []),
            }




          end.compact,
          critical_risk_count: severity_counts["critical_risk"],
          high_risk_count: severity_counts["high_risk"],
          medium_risk_count: severity_counts["medium_risk"],
          low_risk_count: severity_counts["low_risk"],
          no_risk_count: severity_counts["no_risk"]


        }

        hash[:rules] << rule unless severity_counts.values.all? { |v| v == 0 }

      end.compact
      results << hash unless hash[:rules].empty?


    end.compact

    results
  end

  def total_risks
    self.analyzed_results.high_risk.count +
      self.analyzed_results.medium_risk.count +
      self.analyzed_results.low_risk.count +
      self.analyzed_results.no_risk.count
  end

  def high_risk_percentage
    return 0.0 if self.total_risks.zero?
    (self.analyzed_results.high_risk.count.to_f / self.total_risks.to_f) * 100
  end

  def medium_risk_percentage
    return 0.0 if self.total_risks.zero?
    (self.analyzed_results.medium_risk.count.to_f / self.total_risks.to_f) * 100
  end

  def low_risk_percentage
    return 0.0 if self.total_risks.zero?
    (self.analyzed_results.low_risk.count.to_f / self.total_risks.to_f) * 100
  end

  def no_risk_percentage
    return 0.0 if self.total_risks.zero?
    (self.analyzed_results.no_risk.count.to_f / self.total_risks.to_f) * 100
  end

  def hipaa_score
    total_score = 0.0
    rules = UserUpload::HIPAA_RULES
    rules.each do |rule|
      sub_score = 0
      sub_rules = YAML.load_file("#{Rails.root}/patterns/#{pattern_path}/#{rule[:rule_id]}.yaml") rescue []
      sub_rules.each do |sub_rule|
        analyzed_results = self.analyzed_results.with_rule(rule[:rule_id]).with_subrule(sub_rule["id"]).where.not(user_review_status: "ignore")
        count = analyzed_results.count
        weight = sub_rule["weight"].to_f
        score = sub_rule["score"].to_f
        if count > 0
          sub_score += weight * score
        else
          sub_score += 0
        end
      end
      total_score += sub_score
    end
    total_score
  end

  # for Android APK, there are 11 rules total and for web 10
  def finished_generating_report?
    self.reload
    if ((self.apk? || self.ios?) && self.completed_rules_count == 11) || (self.web_application? && self.completed_rules_count == 10)
      return true
    end
    false
  end

  def file_wise_cache_key(page)
    page = 1 if page.nil?
    "file_wise_user_upload_#{self.id}_#{page}"
  end

  def rule_wise_cache_key(page, user_id)
    page = 1 if page.blank?

    results_version =
      analyzed_results.maximum(:updated_at)&.to_i || 0

    "rule_wise_user_upload:#{id}:user:#{user_id}:page:#{page}:v=#{results_version}"
  end

  def delete_rule_wise_caches
    Rails.cache.delete_matched("jbuilder/views/rule_wise_user_upload_#{self.id}_*")
  end

  def delete_file_wise_caches
    Rails.cache.delete_matched("jbuilder/views/file_wise_user_upload_#{self.id}_*")
  end

  def delete_caches
    DeleteCachesJob.perform_later(self.id, self.user_id)
  end

  private
  def set_filename
    if self.file.attached?
      self.file.blob.update(filename: self.file.filename.to_s.gsub(" ", "_"))
    end
  end

  def create_user_upload_history
    self.user.user_upload_histories.create(user_upload_id: self.id)
  end

end