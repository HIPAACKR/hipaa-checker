# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2025_08_13_061045) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "action_text_rich_texts", force: :cascade do |t|
    t.string "name", null: false
    t.text "body"
    t.string "record_type", null: false
    t.bigint "record_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["record_type", "record_id", "name"], name: "index_action_text_rich_texts_uniqueness", unique: true
  end

  create_table "active_admin_comments", force: :cascade do |t|
    t.string "namespace"
    t.text "body"
    t.string "resource_type"
    t.bigint "resource_id"
    t.string "author_type"
    t.bigint "author_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["author_type", "author_id"], name: "index_active_admin_comments_on_author"
    t.index ["namespace"], name: "index_active_admin_comments_on_namespace"
    t.index ["resource_type", "resource_id"], name: "index_active_admin_comments_on_resource"
  end

  create_table "active_storage_attachments", force: :cascade do |t|
    t.string "name", null: false
    t.string "record_type", null: false
    t.bigint "record_id", null: false
    t.bigint "blob_id", null: false
    t.datetime "created_at", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", force: :cascade do |t|
    t.string "key", null: false
    t.string "filename", null: false
    t.string "content_type"
    t.text "metadata"
    t.string "service_name", null: false
    t.bigint "byte_size", null: false
    t.string "checksum", null: false
    t.datetime "created_at", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "active_storage_variant_records", force: :cascade do |t|
    t.bigint "blob_id", null: false
    t.string "variation_digest", null: false
    t.index ["blob_id", "variation_digest"], name: "index_active_storage_variant_records_uniqueness", unique: true
  end

  create_table "analyzed_results", force: :cascade do |t|
    t.string "filepath"
    t.string "filename"
    t.text "description"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.bigint "user_upload_id", null: false
    t.text "pattern"
    t.text "matched_data"
    t.string "rule_name"
    t.integer "severity"
    t.string "vulnerability_cat"
    t.string "subrule_id"
    t.index ["user_upload_id"], name: "index_analyzed_results_on_user_upload_id"
  end

  create_table "github_uploads", force: :cascade do |t|
    t.integer "user_id"
    t.text "github_url"
    t.integer "user_upload_id"
    t.string "platform"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.text "access_token"
    t.string "repo_type"
  end

  create_table "license_logs", force: :cascade do |t|
    t.integer "license_id"
    t.string "ip_address"
    t.text "user_agent"
    t.string "hostname"
    t.string "request_method"
    t.string "request_protocol"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "licenses", force: :cascade do |t|
    t.integer "user_id"
    t.text "license_key"
    t.boolean "is_active"
    t.datetime "expires_on"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["license_key"], name: "index_licenses_on_license_key", unique: true
  end

  create_table "mobile_user_requests", force: :cascade do |t|
    t.integer "user_id"
    t.string "package_name"
    t.string "app_name"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.integer "status", default: 0
    t.integer "user_upload_id"
  end

  create_table "organizations", force: :cascade do |t|
    t.string "name"
    t.text "description"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.integer "plan_id"
    t.string "stripe_subscription_id"
    t.string "stripe_customer_id"
    t.boolean "is_individual", default: false
    t.datetime "subscription_expires_on"
    t.integer "promotional_code_id"
    t.string "google_subscription_id"
  end

  create_table "plans", force: :cascade do |t|
    t.string "stripe_plan_id"
    t.string "name"
    t.decimal "price"
    t.string "interval"
    t.integer "user_count"
    t.boolean "is_active", default: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.integer "max_upload_quota", default: 0
    t.integer "limit_per_day"
    t.boolean "get_hipaa_score", default: false
    t.boolean "get_vulnerability_breakdown", default: false
    t.boolean "get_summerized_reports", default: false
    t.boolean "get_specific_reports", default: false
    t.boolean "view_source_code", default: false
    t.boolean "fix_vulnerabilities", default: false
    t.boolean "support_multiple_device", default: false
    t.boolean "support_customer_service", default: false
    t.boolean "support_dashboard_service", default: false
    t.boolean "support_hipaa_experts", default: false
  end

  create_table "promotional_codes", force: :cascade do |t|
    t.string "code"
    t.decimal "discount"
    t.string "discount_type"
    t.integer "promotional_length"
    t.string "stripe_coupon_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.date "expire_date"
  end

  create_table "roles", force: :cascade do |t|
    t.string "name"
    t.string "resource_type"
    t.bigint "resource_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["name", "resource_type", "resource_id"], name: "index_roles_on_name_and_resource_type_and_resource_id"
    t.index ["resource_type", "resource_id"], name: "index_roles_on_resource"
  end

  create_table "suggestions", force: :cascade do |t|
    t.string "rule_id", null: false
    t.string "subrule_id"
    t.text "expectations_from_hipaa"
    t.string "severity"
    t.string "vulnerability_category"
    t.text "code_snippet"
    t.string "platform"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "dependent_subrule"
    t.string "patterns", default: [], array: true
    t.index ["rule_id"], name: "index_suggestions_on_rule_id"
    t.index ["subrule_id"], name: "index_suggestions_on_subrule_id"
  end

  create_table "user_upload_histories", force: :cascade do |t|
    t.integer "user_id"
    t.integer "user_upload_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "user_uploads", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "upload_type", default: "Healthcare"
    t.string "platform", default: "apk"
    t.string "environment", default: "app"
    t.string "project_name"
    t.string "project_identifier"
    t.integer "status", default: 0
    t.integer "extraction_progress"
    t.text "failure_message"
    t.integer "completed_rules_count", default: 0
    t.index ["user_id"], name: "index_user_uploads_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "first_name"
    t.string "last_name"
    t.string "encrypted_otp_secret"
    t.string "encrypted_otp_secret_iv"
    t.string "encrypted_otp_secret_salt"
    t.integer "consumed_timestep"
    t.boolean "otp_required_for_login"
    t.string "otp_backup_codes", array: true
    t.string "confirmation_token"
    t.datetime "confirmed_at"
    t.datetime "confirmation_sent_at"
    t.string "unconfirmed_email"
    t.boolean "is_admin", default: false
    t.integer "failed_attempts", default: 0
    t.string "unlock_token"
    t.datetime "locked_at"
    t.boolean "approved", default: false, null: false
    t.integer "app_checking_count", default: 0
    t.string "jwt_token"
    t.integer "organization_id"
    t.boolean "is_accept_terms", default: false
    t.string "organization_name"
    t.integer "sign_in_count", default: 0, null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string "current_sign_in_ip"
    t.string "last_sign_in_ip"
    t.string "invitation_token"
    t.datetime "invitation_created_at"
    t.datetime "invitation_sent_at"
    t.datetime "invitation_accepted_at"
    t.integer "invitation_limit"
    t.integer "invited_by_id"
    t.string "invited_by_type"
    t.index ["approved"], name: "index_users_on_approved"
    t.index ["confirmation_token"], name: "index_users_on_confirmation_token", unique: true
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["invitation_token"], name: "index_users_on_invitation_token", unique: true
    t.index ["jwt_token"], name: "index_users_on_jwt_token"
    t.index ["organization_id"], name: "index_users_on_organization_id"
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
    t.index ["unlock_token"], name: "index_users_on_unlock_token"
  end

  create_table "users_roles", id: false, force: :cascade do |t|
    t.bigint "user_id"
    t.bigint "role_id"
    t.index ["role_id"], name: "index_users_roles_on_role_id"
    t.index ["user_id", "role_id"], name: "index_users_roles_on_user_id_and_role_id"
    t.index ["user_id"], name: "index_users_roles_on_user_id"
  end

  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "active_storage_variant_records", "active_storage_blobs", column: "blob_id"
  add_foreign_key "analyzed_results", "user_uploads"
  add_foreign_key "user_uploads", "users"
end
