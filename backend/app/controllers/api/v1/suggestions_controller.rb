
class Api::V1::SuggestionsController < ApplicationController

  skip_before_action :verify_authenticity_token

  def index
    require 'yaml'
    rule = params[:rule]
    platform = params[:platform]
    subrule_id = params[:subrule_id]

    query = { platform: platform }
    query[:rule_id] = rule if rule.present?
    query[:subrule_id] = subrule_id if subrule_id.present?

    begin
      rule ||= Suggestion.where(subrule_id: subrule_id, platform: platform).pluck(:rule_id).first
      raise "Rule not found" if rule.nil?
    rescue => e
      return render json: { error: "Failed to resolve rule: #{e.message}" }, status: :bad_request
    end
    if rule.blank? && platform.blank?
      render json: {error: "Please provide a rule and the codebase platform name"}, status: :bad_request and return
    end
    suggestions = Suggestion.where(query)

    if suggestions.blank?
      render json: { error: "No suggestions found for rule: #{rule}" }, status: :not_found and return
    end

    expectation = nil

    grouped = suggestions.group_by(&:subrule_id)
    subrules = grouped.map do |subrule_id, items|

      suggestions = items.map do |s|

        if s.subrule_id=="All"
          expectation =s.expectations_from_hipaa.body
        end
          {

          snippet: htmlSetralize(s.code_snippet.to_s),
          pattern: s.patterns
        }
      end
      {
        subrule: subrule_id,
        platform: items.first.platform,
        suggestion: suggestions,
      }
    end



    render json: {
      rule: rule,
      expectation: expectation,
      subrules: subrules
    }, status: :ok


  end

  def show
  end
  def htmlSetralize(html_code)
    clean_html = html_code.gsub(/\A<div class="trix-content">|<\/div>\s*\z/, '')
    return clean_html
  end
  def create
  end
end
