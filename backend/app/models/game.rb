class Game < ApplicationRecord
    has_one :player
    has_many :baddies
    serialize :map, JSON
    serialize :coins, JSON


end
