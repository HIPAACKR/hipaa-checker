FactoryBot.define do
  factory :user do
    sequence(:email) { |n| "test_user_#{n}@hipachecker.health.com" }
    first_name {Faker::Name.first_name }
    last_name {Faker::Name.last_name }
    password { "test" * 10 }
    password_confirmation { "test" * 10 }
    is_accept_terms { true }
    is_admin {false}
  end
end
