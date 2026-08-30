Rails.application.routes.draw do
  require 'sidekiq/web'
  Rails.application.routes.draw do
    mount Sidekiq::Web => '/sidekiq'
  end
  get '/health', to: 'health#index'
  get :developers_guides, to: "developer_guides#index", as: :developers_guides
  get :user_guides, to: "user_guides#index", as: :user_guides
  get :download_android_studio_plugin, to: "developer_guides#download_android_studio_plugin", as: :download_android_studio_plugin
  get :terms_and_conditions, to: "developer_guides#terms_and_conditions", as: :terms_and_conditions
  root to: 'home#index'
  post '/check_vulnerabilities', to: 'home#check_vulnerabilities', as: :check_vulnerabilities
  post '/admins/ckeditor_uploads', to: 'ckeditor_uploads#create'
  devise_for :users, controllers: {
    passwords: 'passwords',
    sessions: 'sessions',
    registrations: 'registrations'
  }
  ActiveAdmin.routes(self)

  namespace :admin do
    get 'payouts/:id', to: 'payouts#show', as: 'payout'
    post 'suggestions/update_subrule', to: 'suggestions#update_subrule'
    post 'suggestions/update_rules', to: 'suggestions#update_rules'
    post 'suggestions/update_severity', to: 'suggestions#update_severity'
    post 'suggestions/update_patterns', to: 'suggestions#update_patterns'
  end

  resource :two_factor_settings, except: [:index, :show]
  resource :subscription, only: [:create, :new, :update]
  resources :user_uploads do
    member do
      get :report
    end
    resources :analyzed_results
  end

  post '/extract/:id', to: 'user_uploads#extract', as: :extract
  get 'preview', to: 'home#preview', as: :file_preview
  get 'check_all_vulnerabilities', to: 'home#check_all_vulnerabilities', as: :check_all_vulnerabilities

  put :update_jwt_token, to: 'users#update_jwt_token', as: :update_jwt_token
  get :api_credentials, to: 'users#api_credentials', as: :api_credentials
  resources :github_uploads

  namespace :api do
    namespace :v1 do
      resources :blogs, only: [:create, :update, :show, :index] do
        collection do
          get :categories
        end
      end
      post 'manual_selection', to: 'manual_selection#setIgnore'
      post 'contact_us', to: 'user_contacts#create'
      post 'newsletter', to: 'newsletter#create'
      get :invoices, to: "invoices#index"
      get 'invoices/:id', to: 'invoices#show', as: :invoice
      get :dashboard, to: "dashboard#index"
      namespace :ios do
        resources :user_uploads
        resources :analyzed_results
      end
      resources :user_uploads do
        member do
          get :rule_wise
          get :file_wise
          get :file_content
          get :show_progress
          put :extract
          put :generate_reports
        end
        resources :analyzed_results
      end
      resources :github_uploads
      resources :mobile_user_requests
      post :user_auth_checks, to: 'user_auth_checks#index'
      resources :sessions, only: [:create, :destroy] do
        collection do
          get :check_license_from_json
        end
      end
      resources :rules, only: [:index]
      resources :addresses, only: [:create, :update, :destroy]
      resources :user
      resources :payment_methods do
        member do
          put :make_default
        end
      end
      resources :passwords, only: [:create, :update] do
        patch :update_password, on: :collection
      end
      resources :registrations
      resources :confirmations
      resources :organizations, only: [:index, :show]
      resources :subscriptions do
        collection do
          delete :cancel
          post :subscribe_to_google
        end
      end
      resources :plans, only: :index
      resources :roles, only: :index
      resources :promotional_codes, only: :index
      resources :licenses do
        collection do
          post :validate
          post :validate_license_key_from_server
          post :validate_license_key_from_lib
        end
      end
      resources :members do
        member do
          post :resend_invitation
        end
        collection do
          post :invite
        end
      end
    end
  end

  namespace :webhooks do
    namespace :stripe do
      resources :event_notifications, only: [:create]
    end
    namespace :google do
      post 'event_notifications_google', to: 'event_notifications_google#handle'
    end

  end


  namespace :api do
    namespace :v1 do
      post 'payment-android', to: 'payment_api#create_payment'
      get 'fetchPlans', to: 'payment_api#new'
      get 'getUserPlanInfo', to: 'payment_api#userPlanInfo'
      get 'suggestions', to: "suggestions#index"
    end
  end
  namespace :api do
    namespace :v2 do
      get :dashboard, to: "dashboard#index"
      resources :user_uploads, only: [] do
        member do
          get :rule_wise
          get :file_wise
          get :report
        end
      end
    end
  end

end
