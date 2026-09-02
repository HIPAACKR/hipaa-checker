# Run this ON YOUR LIVE SERVER (where the real, populated `suggestions`
# table lives), not in Docker:
#
#   cd /path/to/app/current
#   RAILS_ENV=production bundle exec rails runner script/export_suggestions.rb
#
# Suggestion's comment/code_snippet/expectations_from_hipaa are Action Text
# fields (see app/models/suggestion.rb), so their real content lives in the
# action_text_rich_texts table, not as plain columns - this pulls the
# resolved .body text so the export is self-contained.
#
# It writes db/seed_data/suggestions.json. Copy that one file down to your
# machine (e.g. `scp`) and drop it at backend/db/seed_data/suggestions.json
# in this repo, then `docker compose up -d --build backend` - db/seeds.rb
# picks it up automatically from there.

require 'json'
require 'fileutils'

data = Suggestion.find_each.map do |s|
  {
    rule_id: s.rule_id,
    subrule_id: s.subrule_id,
    severity: s.severity,
    vulnerability_category: s.vulnerability_category,
    platform: s.platform,
    dependent_subrule: s.dependent_subrule,
    patterns: s.patterns,
    comment: s.comment&.body&.to_s,
    code_snippet: s.code_snippet&.body&.to_s,
    expectations_from_hipaa: s.expectations_from_hipaa&.body&.to_s
  }
end.to_a

out_dir = Rails.root.join('db', 'seed_data')
FileUtils.mkdir_p(out_dir)
out_path = out_dir.join('suggestions.json')
File.write(out_path, JSON.pretty_generate(data))

puts "Exported #{data.size} suggestions to #{out_path}"
