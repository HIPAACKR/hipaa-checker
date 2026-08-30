class SuggestionsController < ApplicationController
  def new
    @suggestion = Suggestion.new
  end

  def index
    @suggestions = Suggestion.all
    @suggestion = Suggestion.new  # Ensure a new suggestion is available for the form
  end

  def create
    # Add debugging to understand the incoming parameters
    Rails.logger.debug "Params: #{params.inspect}"

    @suggestion = Suggestion.new(suggestion_params)

    if @suggestion.save
      redirect_to suggestions_path, notice: 'Suggestion was successfully created.'
    else
      @suggestions = Suggestion.all
      render :index
    end
  end

  private

  def suggestion_params
    # Use strong parameters with more robust error handling
    params.require(:suggestion).permit(
      :rule_id,
      :subrule_id,
      :expectations_from_hipaa,
      :severity,
      :vulnerability_category,
      :code_snippet,
      :priority,
      :language,
      :comment,
      :resources
    )
  end
end