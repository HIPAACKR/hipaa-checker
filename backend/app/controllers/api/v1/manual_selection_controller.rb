# frozen_string_literal: true

class Api::V1::ManualSelectionController < ApiController
  def setIgnore
    upload = current_user.user_uploads.find(selection_params[:uploadId])
    analyzed_result = upload.analyzed_results.where(
      subrule_id: selection_params[:subruleId]
    )
    analyzed_result.update_all(
      severity: 0,
      user_review_status: "ignore",
      updated_at: Time.current
    )
    upload.update_columns(
      total_risk: nil,
      total_risk_mitigation: nil,
      iat_total_risk: nil,
      iat_risk_mitigation: nil,
      ids_total_risk: nil,
      ids_risk_mitigation: nil,
      ia_total_risk: nil,
      ia_risk_mitigation: nil,
      inc_total_risk: nil,
      inc_risk_mitigation: nil,
      critical_risk: nil,
      high_risk: nil,
      medium_risk: nil,
      low_risk: nil,
      no_risk: nil
    )
    upload.delete_caches

    render json: {ok: true}
  end



  private
  def selection_params
    params.permit(:uploadId ,:subruleId)
  end
  def answers_params
    params.require(:user_answers).permit(answers: [:id, :value])
  end
end