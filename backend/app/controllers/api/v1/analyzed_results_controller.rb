class Api::V1::AnalyzedResultsController < ApiController

  respond_to :json

  def index
    @analyzed_results = AnalyzedResult.where(user_upload_id: current_user.user_uploads.find(params[:id]))
  end
end
