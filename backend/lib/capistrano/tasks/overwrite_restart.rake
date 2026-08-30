namespace :puma do
  Rake::Task[:restart].clear_actions

  desc "Overwritten puma:restart task"
  task :restart do
    invoke 'puma:stop'
    invoke 'puma:start'
  end
end
