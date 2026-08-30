class DeveloperGuidesController < ApplicationController
  def index
  end
  def download_android_studio_plugin
    send_file "#{Rails.root}/android_studio_plugins/hipaachecker.health-VERSION-1.0.8.zip", :type => "application/zip"
  end

  def terms_and_conditions
    send_file "#{Rails.root}/android_studio_plugins/terms-and-condition.pdf", :type => "application/pdf"
  end

end
