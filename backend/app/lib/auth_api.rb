module AuthApi
  class JsonWebToken
    class << self
      def encode(payload, exp = 24.hours.from_now)
        payload[:exp] = exp.to_i
        JWT.encode(payload, Rails.application.secrets.secret_key_base)
      end

      def decode(token)
        body = JWT.decode(token, Rails.application.secrets.secret_key_base)[0]
        HashWithIndifferentAccess.new body
      rescue
        nil
      end
    end
  end
  class AuthorizeApiRequest
    def initialize(headers = {})
      @headers = headers
    end

    def call
      JsonWebToken.decode(extract_token_from_auth_header)
    end

    def valid_token?(token)
      Devise.secure_compare(token, extract_token_from_auth_header)
    end

    private
    attr_reader :headers

    def extract_token_from_auth_header
      if headers['Authorization'].present?
        headers['Authorization'].split(' ').last
      else
        raise 'Authorization Error.'
      end
    end
  end
end