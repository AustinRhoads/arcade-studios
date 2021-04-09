class Game < ApplicationRecord
    has_one :player
    has_many :baddies
    has_one :end_of_game
    serialize :map, JSON
    serialize :coins, JSON


end
