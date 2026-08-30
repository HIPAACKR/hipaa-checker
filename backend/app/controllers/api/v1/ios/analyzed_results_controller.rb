class Api::V1::Ios::AnalyzedResultsController < ApiController

  def create
    #<AnalyzedResult id: 8839, filepath: "/Users/abdul/projects/hipaachecker.health/extracte...",
    # filename: "jy0.java", description: "This App uses Message Digest (MD) algorithm encryp...",
    # created_at: "2024-03-22 00:58:04.925069000 +0000",
    # updated_at: "2024-03-22 00:58:04.925069000 +0000", user_upload_id: 41,
    # pattern: ["import java.security.MessageDigest;", "import java.security.Security;"],
    # matched_data: [["{\"lineNumber\":11,\"codeSegment\":\"import java.security.MessageDigest;\"}"], []],
    # rule_name: "encryption_decryption">
    @user_upload = current_user.user_uploads.find(params[:user_upload_id])
    params[:analyzed_results].each do |index,analyzed_result|
      new_analyzed_result = @user_upload.analyzed_results.new
      new_analyzed_result.filepath = analyzed_result["filepath"]
      new_analyzed_result.filename = analyzed_result["filename"]
      new_analyzed_result.description = analyzed_result["description"]
      new_analyzed_result.user_upload = @user_upload
      new_analyzed_result.pattern = analyzed_result["pattern"] #["import java.security.MessageDigest;", "import java.security.Security;"]
      new_analyzed_result.matched_data = analyzed_result["matched_data"] #[["{\"lineNumber\":11,\"codeSegment\":\"import java.security.MessageDigest;\"}"], []]
      new_analyzed_result.rule_name = analyzed_result["rule_name"]
      new_analyzed_result.save
    end
    render json: {}, status: :ok
  end

end
