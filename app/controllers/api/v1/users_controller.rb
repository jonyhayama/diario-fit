class Api::V1::UsersController < ApplicationController
  before_action :authorize_access_request!

  def me
    render json: { id: current_user.id, email: current_user.email }
  end
end