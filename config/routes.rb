Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  namespace :api do
    namespace :v1 do
      get 'me', to: 'users#me'
    end
  end

  root to: 'home#index'
  post 'refresh', controller: :refresh, action: :create
  post 'signup', controller: :signup, action: :create
  post 'signin', to: 'signin#create'
  delete 'signin', to: 'signin#destroy'
end
