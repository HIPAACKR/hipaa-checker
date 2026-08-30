Recaptcha.configure do |config|
  config.site_key  = ENV['GOOGLE_CAPTCHA_SITE_KEY']
  config.secret_key = ENV['GOOGLE_CAPTCHA_SECRET_KEY']
end