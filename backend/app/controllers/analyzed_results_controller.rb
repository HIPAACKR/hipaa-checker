class AnalyzedResultsController < ApplicationController

  def index
    @user_upload = UserUpload.find(params[:user_upload_id])
    @analyzed_results = @user_upload.analyzed_results.with_rule(params[:rule_name]).paginate page: params[:page], per_page: 20
  end

  def destroy
    @user_upload = UserUpload.find(params[:user_upload_id])
    @analyzed_result = AnalyzedResult.find(params[:id])

    if @analyzed_result.destroy
      redirect_to user_upload_analyzed_results_path(@user_upload.id), notice: 'Delete Successful'
    else
      redirect_to user_upload_analyzed_results_path(@user_upload.id), error: 'Not Able to Delete !'
    end
  end
end
