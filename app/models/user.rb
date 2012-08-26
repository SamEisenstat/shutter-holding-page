#require 'gibbon'

class User < ActiveRecord::Base
  attr_accessible :email, :first_name, :last_name

  def add_to_mailchimp
    Gibbon.new("863838db32f211cf004937d8eea7df93-us5").list_subscribe(:id => "132799819c", :email_address => email)
  end
end
