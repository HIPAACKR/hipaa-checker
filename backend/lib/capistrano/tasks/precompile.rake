namespace :deploy do
  namespace :assets do
    Rake::Task[:precompile].clear_actions
    desc 'Precompile assets locally and then rsync to web servers'
    task :precompile do
      run_locally do
        execute "RAILS_ENV=#{fetch(:rails_env)} bundle exec rake assets:precompile"
      end

      on roles(:web), in: :parallel do |server|
        run_locally do
          execute :rsync,
                  "-a --delete ./public/packs/ ubuntu@#{server.hostname}:#{shared_path}/public/packs/"
          execute :rsync,
                  "-a --delete ./public/assets/ ubuntu@#{server.hostname}:#{shared_path}/public/assets/"
        end
      end

      run_locally do
        execute :rm, '-rf public/assets'
        execute :rm, '-rf public/packs'
      end
    end
  end
end