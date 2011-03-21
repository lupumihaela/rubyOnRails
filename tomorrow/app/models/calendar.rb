class Calendar < ActiveRecord::Base
  has_many :calendar_users
  has_many :users, :through => :calendar_users

  has_many :events
end
