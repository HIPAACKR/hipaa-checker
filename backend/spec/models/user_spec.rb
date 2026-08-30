require 'rails_helper'

RSpec.describe User, type: :model do
  it "Should creates user" do
    users_count = User.count
    create(:user)
    expect(users_count + 1).to eq(User.count)
  end
end
