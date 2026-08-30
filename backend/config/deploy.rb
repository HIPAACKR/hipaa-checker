# config valid for current version and patch releases of Capistrano
set :application, "hipaachecker.health"
set :repo_url, "git@github.com:HIPAACKR/hipaachecker.health.git"

# Default branch is :master
 ask :branch, `git rev-parse --abbrev-ref HEAD`.chomp

# Default deploy_to directory is /var/www/my_app_name
 set :deploy_to, "/home/ubuntu/projects/hipaachecker.health"
set :scm, :git
set :branch, 'production'
set :rvm_ruby_version, '3.0.2'
set :whenever_identifier, ->{ "#{fetch(:application)}_#{fetch(:stage)}" }



# Default value for :format is :airbrussh.
# set :format, :airbrussh

# You can configure the Airbrussh format using :format_options.
# These are the defaults.
# set :format_options, command_output: true, log_file: "log/capistrano.log", color: :auto, truncate: :auto

# Default value for :pty is false
# set :pty, true

# Default value for :linked_files is []
 append :linked_files, "config/database.yml", ".env", "config/root-emissary-442213-k5-8cf2b28357cc.json", "public/.well-known/assetlinks.json"

# Default value for linked_dirs is []
 append :linked_dirs, "log", "tmp/pids", "tmp/cache", "tmp/sockets", "public/system", "public/packs", "public/assets", "storage", "extracted"

# Default value for default_env is {}
# set :default_env, { path: "/opt/ruby/bin:$PATH" }

# Default value for local_user is ENV['USER']
# set :local_user, -> { `git config user.name`.chomp }

# Default value for keep_releases is 5
 set :keep_releases, 3

# Uncomment the following to require manually verifying the host key before first deploy.
# set :ssh_options, verify_host_key: :secure
