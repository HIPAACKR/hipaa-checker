class CreateApplicationRoles < ActiveRecord::Migration[6.1]
  def self.up
    ['client', 'client_manager'].each do |role_name|
      Role.create! name: role_name
    end
  end
  def self.down
    Role.where(name: ['client', 'client_manager']).destroy_all
  end
end
