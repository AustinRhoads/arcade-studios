class Game < ApplicationRecord
    has_one :player, :dependent => :destroy
    has_many :baddies, :dependent => :destroy
    has_one :end_of_game, :dependent => :destroy
    serialize :map, JSON
    serialize :coins, JSON


end
