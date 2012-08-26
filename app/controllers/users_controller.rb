class UsersController < ApplicationController
  include UsersHelper

  def index
    @user = User.new
    render :layout => false
  end

  def create
    User.new(params[:user]).add_to_mailchimp
  end
end
