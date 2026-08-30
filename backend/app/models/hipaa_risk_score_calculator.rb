class HipaaRiskScoreCalculator
  RISK_MITIGATION_LEVELS = {
    none: 0,
    negligible: 0.1,
    minor: 0.25,
    moderate: 0.5,
    strong: 0.75,
    optimal: 0.9,
    negative_negligible: -0.1,
    negative_minor: -0.25,
    negative_moderate: -0.5,
    negative_strong: -0.75,
    negative_optimal: -0.9,
  }

  SEVERITY_LABELS = {
    none: 5,
    negligible: 4,
    minor: 3,
    moderate: 2,
    strong: 1,
    optimal: 0,
    negative_negligible: 0,
    negative_minor: 1,
    negative_moderate: 2,
    negative_strong: 3,
    negative_optimal: 4
  }


  attr_accessor :analyzed_results
  attr_accessor :all_sub_rules
  attr_accessor :cvss_risk_score
  attr_accessor :cvss_risk_mitigation
  attr_accessor :cvss_risk_remaining
  attr_accessor :risk_breakdown
  attr_accessor :weight_factors
  attr_accessor :user_upload

  VULNERABILITIES = [
    {
      id: 'insufficient_authorization',
      name: 'Insufficient Authorization',
      description: 'vulnerability description',
      cvss_value: 7.3,
      rule_ids: ['authorization', 'unique_id', 'user_inactivity', 'user_authentication']
    },
    {
      id: 'inadequate_data_security',
      name: 'Inadequate Data Security',
      description: 'vulnerability description',
      cvss_value: 9.1,
      rule_ids: ['encryption_decryption', 'unique_id', 'phi_encryption', 'data_integrity', 'authorization_for_destruction']
    },
    {
      id: 'insecure_network_communication',
      name: 'Insecure Network Communication',
      description: 'vulnerability description',
      cvss_value: 5.8,
      rule_ids: ['transmition_secuirity', 'guard_against_com_network']
    },
    {
      id: 'inconsistent_audit_trail',
      name: 'Inconsistent Audit Trail',
      description: 'vulnerability description',
      cvss_value: 7.0,
      rule_ids: ['audit']
    }
  ]

  def initialize(user_upload)
    # self.analyzed_results = analyzed_results[:analyzed_results]
    self.all_sub_rules = []
    self.cvss_risk_score = 0
    self.cvss_risk_mitigation = 0
    self.cvss_risk_remaining = 0
    self.risk_breakdown = []
    self.weight_factors = []
    self.user_upload = user_upload
  end

  def calculate_weight_factors
    VULNERABILITIES.each do |vulnerability|
      self.weight_factors.push({vulnerability_id: vulnerability[:id], weight: process_vulnerability(vulnerability)})
    end
  end

  def calculate
    print("inside calculate_risk_behavior")
    self.analyzed_results = user_upload.hipaa_risk_scores(UserUpload::HIPAA_RULES.dup)[:analyzed_results]
    self.calculate_weight_factors
    VULNERABILITIES.each do |vulnerability|
      total_cvss_score = vulnerability[:cvss_value]
      risk_mitigation, risk_remaining = calculate_risks(vulnerability)

      self.cvss_risk_score += total_cvss_score
      self.cvss_risk_mitigation += risk_mitigation
      self.cvss_risk_remaining += risk_remaining

      self.risk_breakdown.push({
        risk_category: vulnerability[:name],
        total_risk_score: total_cvss_score,
        cvss_risk_score: total_cvss_score,
        cvss_risk_mitigation: risk_mitigation,
        cvss_risk_remaining: risk_remaining
      })
    end


    user_upload.total_risk = self.cvss_risk_score
    user_upload.total_risk_mitigation = self.cvss_risk_mitigation

    # Set per-category risk
    self.risk_breakdown.each do |risk|
      case risk[:risk_category]
      when "Inconsistent Audit Trail"
        user_upload.iat_total_risk = risk[:cvss_risk_score]
        user_upload.iat_risk_mitigation = risk[:cvss_risk_mitigation]
      when "Inadequate Data Security"
        user_upload.ids_total_risk = risk[:cvss_risk_score]
        user_upload.ids_risk_mitigation = risk[:cvss_risk_mitigation]
      when "Insufficient Authorization"
        user_upload.ia_total_risk = risk[:cvss_risk_score]
        user_upload.ia_risk_mitigation = risk[:cvss_risk_mitigation]
      when "Insecure Network Communication"
        user_upload.inc_total_risk = risk[:cvss_risk_score]
        user_upload.inc_risk_mitigation = risk[:cvss_risk_mitigation]
      end
    end
    user_upload.save!
    user_upload.count_severity(UserUpload::HIPAA_RULES.dup)
    generate_score_summary
  end

  def show_reports
    if user_upload.total_risk.present? && user_upload.critical_risk.present?
      print("Taking data from db")
      self.cvss_risk_score = user_upload.total_risk
      self.cvss_risk_mitigation = user_upload.total_risk_mitigation
      self.cvss_risk_remaining = user_upload.total_risk - user_upload.total_risk_mitigation
      default_risks = [
        { risk_category: "Inconsistent Audit Trail", total_risk_score: 0, cvss_risk_score: 0, cvss_risk_mitigation: 0, cvss_risk_remaining: 0 },
        { risk_category: "Inadequate Data Security", total_risk_score: 0, cvss_risk_score: 0, cvss_risk_mitigation: 0, cvss_risk_remaining: 0 },
        { risk_category: "Insufficient Authorization", total_risk_score: 0, cvss_risk_score: 0, cvss_risk_mitigation: 0, cvss_risk_remaining: 0 },
        { risk_category: "Insecure Network Communication", total_risk_score: 0, cvss_risk_score: 0, cvss_risk_mitigation: 0, cvss_risk_remaining: 0 }
      ]

      self.risk_breakdown = default_risks if self.risk_breakdown.empty?
      self.risk_breakdown.each do |risk|
        case risk[:risk_category]
        when "Inconsistent Audit Trail"
          risk[:total_risk_score] = user_upload.iat_total_risk
          risk[:cvss_risk_score] = user_upload.iat_total_risk
          risk[:cvss_risk_mitigation] = user_upload.iat_risk_mitigation
          risk[:cvss_risk_remaining] = user_upload.iat_total_risk - user_upload.iat_risk_mitigation
        when "Inadequate Data Security"
          risk[:total_risk_score] = user_upload.ids_total_risk
          risk[:cvss_risk_score] = user_upload.ids_total_risk
          risk[:cvss_risk_mitigation] = user_upload.ids_risk_mitigation
          risk[:cvss_risk_remaining] = user_upload.ids_total_risk - user_upload.ids_risk_mitigation
        when "Insufficient Authorization"
          risk[:total_risk_score] = user_upload.ia_total_risk
          risk[:cvss_risk_score] = user_upload.ia_total_risk
          risk[:cvss_risk_mitigation] = user_upload.ia_risk_mitigation
          risk[:cvss_risk_remaining] = user_upload.ia_total_risk - user_upload.ia_risk_mitigation
        when "Insecure Network Communication"
          risk[:total_risk_score] = user_upload.inc_total_risk
          risk[:cvss_risk_score] = user_upload.inc_total_risk
          risk[:cvss_risk_mitigation] = user_upload.inc_risk_mitigation
          risk[:cvss_risk_remaining] = user_upload.inc_total_risk - user_upload.inc_risk_mitigation
        end
      end
      generate_score_summary
    else
      print("Taking data from runtime")
      calculate
    end
  end

  def calculate_risks(vulnerability)
    subrule_impact = 0

    vulnerability[:rule_ids].each do |rule_id|
      analyzed_rule = self.analyzed_results.find { |result| result[:rule_id] == rule_id }
      next unless analyzed_rule

      analyzed_rule[:sub_rules].each do |sub_rule|
        new_sub_rule = sub_rule
        vulnerability_impact = new_sub_rule[:vulnerability_impacts].find{|vulnerability_impact| vulnerability_impact["vulnerability_id"] == vulnerability[:id] }
        #raise sub_rule.inspect + '***' + vulnerability[:id].inspect if vulnerability_impact.nil?
        #new_sub_rule[:vulnerability_impacts][0]["severity"] = self.all_sub_rules.find{|temp_subrule| temp_subrule[:subrule_id] == sub_rule[:subrule_id] }[:severity]
        #if self.all_sub_rules.find{|temp_subrule| temp_subrule && temp_subrule[:subrule_id] == sub_rule && sub_rule[:subrule_id] }.present?
          vulnerability_impact["severity"] = self.all_sub_rules.find{|temp_subrule| temp_subrule[:subrule_id] == sub_rule[:subrule_id] }[:severity]
        #end
        weight_factor = self.weight_factors.select{|weight_factor| weight_factor if weight_factor[:vulnerability_id] == vulnerability[:id] }.first
        subrule_impact += calculate_subrule_impact(new_sub_rule, weight_factor[:weight], vulnerability)
      end
    end
    risk_mitigation = (vulnerability[:cvss_value] * subrule_impact).round(2)

    risk_remaining = vulnerability[:cvss_value] - risk_mitigation
    [risk_mitigation, risk_remaining]
  end

  def generate_score_summary
    {
      total_risk_score: self.cvss_risk_score,
      cvss_risk_score: self.cvss_risk_score,
      cvss_risk_mitigation: self.cvss_risk_mitigation.round(2),
      cvss_risk_remaining: self.cvss_risk_remaining.round(2),
      risk_breakdown: self.risk_breakdown
    }
  end

  private

  def process_vulnerability(vulnerability)
    weight_factor = 0
    self.analyzed_results.each do |rule|
      rule[:sub_rules].each do |sub_rule|
        self.all_sub_rules.push({subrule_id: sub_rule[:subrule_id], severity: sub_rule[:vulnerability_impacts].first["severity"]})
      end
    end

    self.all_sub_rules = self.all_sub_rules.sort{|sub_rule1, sub_rule2| RISK_MITIGATION_LEVELS[sub_rule1[:severity].to_sym].to_f <=> RISK_MITIGATION_LEVELS[sub_rule2[:severity].to_sym].to_f  }

    self.analyzed_results.each do |rule|
      rule[:sub_rules].each do |sub_rule|
        if sub_rule[:count].to_i > 0
          sub_rule[:vulnerability_impacts].each do |vulnerability_impact|
            (vulnerability_impact["relative_impacts"] || []).each do |relative_impact|
              begin
                sr = self.all_sub_rules.find{|sub_rule| sub_rule[:subrule_id] == relative_impact["subrule_id"] }
              rescue => e
                puts "Error in finding subrule: #{e.message}"
              end
              if sr.present?
                if RISK_MITIGATION_LEVELS[sr[:severity].to_sym].to_f > RISK_MITIGATION_LEVELS[relative_impact["factor"].to_sym].to_f
                  sr[:severity] = relative_impact["factor"]
                end
              end
            end
          end
        else
          sr = self.all_sub_rules.find{|tmp_sub_rule| tmp_sub_rule[:subrule_id] == sub_rule[:subrule_id]  }
          sr[:severity] = "none" if sr[:severity].include?("negative_")
        end
      end
    end

    #raise self.all_sub_rules.inspect


    vulnerability[:rule_ids].each do |rule_id|
      analyzed_rule = self.analyzed_results.find { |result| result[:rule_id] == rule_id }
      next unless analyzed_rule

      analyzed_rule[:sub_rules].each do |sub_rule|
        sr = self.all_sub_rules.find{|temp_sub_rule| temp_sub_rule[:subrule_id] == sub_rule[:subrule_id] }
        weight_factor += RISK_MITIGATION_LEVELS[sr[:severity].to_sym].to_f || 0
      end
    end
    1.0/weight_factor.to_f
  end

  def calculate_weight_factor(impacts)
    impacts = [] if impacts.nil?
    total_impact = impacts.sum { |impact| RISK_MITIGATION_LEVELS[impact["severity"].to_sym].to_f || 0 }
    total_impact
  end

  def calculate_subrule_impact(sub_rule, weight_factor, vulnerability)
    vulnerability_impact = sub_rule[:vulnerability_impacts].find{|vulnerability_impact| vulnerability_impact["vulnerability_id"] == vulnerability[:id]}
    return weight_factor * RISK_MITIGATION_LEVELS[vulnerability_impact["severity"].to_sym].to_f * (sub_rule[:count] > 0 ? 1 : 0)
  end
end

