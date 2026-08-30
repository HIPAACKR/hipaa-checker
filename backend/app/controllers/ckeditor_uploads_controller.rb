class CkeditorUploadsController < ApplicationController
  protect_from_forgery with: :null_session

  def create

    Rails.logger.info "CKEDITOR UPLOAD PARAMS: #{params.to_unsafe_h.inspect}"

    uploaded_file = params[:upload] || params[:file]

    unless uploaded_file
      render json: { error: 'No file uploaded' }, status: :unprocessable_entity
      return
    end

    blob = ActiveStorage::Blob.create_and_upload!(
      io: uploaded_file.tempfile,
      filename: uploaded_file.original_filename,
      content_type: uploaded_file.content_type
    )

    render json: { url: url_for(blob) }
  end
end
