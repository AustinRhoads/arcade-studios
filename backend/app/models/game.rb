class Game < ApplicationRecord
    has_one :player
    has_many :baddies
    has_one :game_over
    serialize :map, JSON
    serialize :coins, JSON


end
