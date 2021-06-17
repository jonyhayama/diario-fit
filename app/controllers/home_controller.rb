class HomeController < ApplicationController
  def index
    render json: { diariofit:  { version: '0.1' } }
  end
end