ALLOWED_FILES = /\.(?:rb|txt|js|yml|java|php)$/.freeze
APKTOOL_PATH = "#{Rails.root}/utils/apktool"
JADX_PATH = "#{Rails.root}/utils/jadx/bin/jadx"
PATTERNS_PATH = "#{Rails.root}/patterns/released/*.yaml"
JADX_THREADS_COUNT = 2 # Best, set number of CPU-1 considering a single user
