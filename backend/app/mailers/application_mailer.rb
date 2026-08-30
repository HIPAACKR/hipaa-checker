class ApplicationMailer < ActionMailer::Base
  default from: 'no-reply@hipaachecker.health'
  layout 'mailer'
end
