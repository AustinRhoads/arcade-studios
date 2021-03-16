class Game < ApplicationRecord
    has_one :player
    has_many :baddies
    serialize :map


end
