require 'yaml'
ActiveAdmin.register Suggestion do
  permit_params :rule_id, :subrule_id, :expectations_from_hipaa, :dependent_subrule , :severity, :vulnerability_category,
                :code_snippet, :resources, :priority, :platform, :comment, patterns: []
  platforms = UserUpload::PLATFORMS
  form do |f|
    f.inputs 'Suggestion' do
      f.input :platform, as: :select, collection: platforms,input_html: { id: 'platforms' }
      f.input :rule_id, as: :select, collection: [], input_html: { id: 'rule_id_select' }, include_blank: true
      f.input :subrule_id,
              as: :select,
              collection: [], # empty initially
              input_html: { id: 'subrule_id_select' },
              include_blank: true
      f.input :patterns,
              as: :check_boxes,
              collection: [],
              include_hidden: false,
              wrapper_html: { id: 'patterns' }

      # f.input :severity, as: :select, collection: [], input_html: { id: 'severity' }
      # f.input :vulnerability_category, as: :select, collection: [], input_html: { id: 'vulnerability_category' }
      f.input :dependent_subrule
      # f.input :expectations_from_hipaa


      li do
        label "Expectations from HIPAA"
        f.rich_text_area :expectations_from_hipaa
        label :suggestion
        f.rich_text_area :code_snippet

      end
    end
    f.actions
  end
  index do
    selectable_column
    id_column
    column :platform
    column :rule_id
    column :subrule_id
    #column :patterns
    # column :suggestion do |suggestion|
    #   suggestion.code_snippet.body.to_s.html_safe
    # end
    actions
  end


  show do
    attributes_table do
      row :platform
      row :rule_id
      row :subrule_id
      row :expectations_from_hipaa do |expectations|
        expectations.expectations_from_hipaa.body.to_s.html_safe
      end
      row :patterns
      row :suggestion do |suggestion|
        suggestion.code_snippet.body.to_s.html_safe
      end


    end
  end

  module YamlLoader
    mattr_accessor :current_subrules
    def self.rule_list(platform)
      platform = 'android' if platform == 'apk'
      folder_path = Rails.root.join("patterns/released/#{platform}_cvss")
      files = Dir.glob("#{folder_path}/*.yaml")
      puts "Files #{files}"
      rules = files.map { |file| File.basename(file, ".yaml") }
      puts "Rules #{rules}"
      return rules
    end
    def self.subrules(platform,ruleid)
      platform = 'android' if platform == 'apk'
      file_path = Rails.root.join("patterns/released/#{platform}_cvss/#{ruleid}.yaml")
      data = YAML.load_file(file_path)
      self.current_subrules = data.map { |entry| entry["id"] }
      puts current_subrules.inspect
      return current_subrules
    end
    def self.severity(platform,ruleid,subruleid)
      vulnerability_id = nil
      severity = nil
      platform = 'android' if platform == 'apk'
      file_path = Rails.root.join("patterns/released/#{platform}_cvss/#{ruleid}.yaml")
      data = YAML.load_file(file_path)

      data.each do |entry|
        if entry["id"] == subruleid
          entry["vulnerability_impacts"].each do |impact|
            vulnerability_id = impact["vulnerability_id"]
            severity = impact["severity"]
          end
          break
        end

      end
      return vulnerability_id, severity
    end
    def self.patterns(platform,ruleid,subruleid)
      patterns = []
      platform = 'android' if platform =='apk'
      file_path = Rails.root.join("patterns/released/#{platform}_cvss/#{ruleid}.yaml")
      data = YAML.load_file(file_path)

      data.each do |entry|
        if entry["id"] == subruleid
          patterns = entry["pattern"]
        end
      end
      return patterns
    end

  end

  controller do


    def update_rules
      platform = params[:platform].presence || current_suggestion&.platform
      rules    = platform.present? ? YamlLoader.rule_list(platform) : []
      selected = params[:rule_id].presence || current_suggestion&.rule_id
      selected = rules.first if selected.blank? && rules.present?
      render json: { rules: rules, selected: selected }
    end

    def update_subrule
      platform = params[:platform].presence || current_suggestion&.platform
      rule_id  = params[:rule_id].presence  || current_suggestion&.rule_id
      subrules = (platform.present? && rule_id.present?) ? YamlLoader.subrules(platform, rule_id) : []
      subrules.prepend("All")
      selected = params[:subrule_id].presence || current_suggestion&.subrule_id
      selected = subrules.first if selected.blank? && subrules.present?
      render json: { subrules: subrules, selected: selected }
    end

    def update_patterns
      platform   = params[:platform].presence   || current_suggestion&.platform
      rule_id    = params[:rule_id].presence    || current_suggestion&.rule_id
      subrule_id = params[:subrule_id].presence || current_suggestion&.subrule_id
      patterns = if platform.present? && rule_id.present? && subrule_id.present?
                   YamlLoader.patterns(platform, rule_id, subrule_id)
                 else
                   []
                 end

      selected = params[:selected_patterns].presence || current_suggestion&.patterns || []
      selected = Array(selected) & patterns  # keep only valid options

      render json: { patterns: patterns, selected: selected }
    end

    private
    def current_suggestion
      @current_suggestion ||= Suggestion.find_by(id: params[:suggestion_id])
    end

  end


end
