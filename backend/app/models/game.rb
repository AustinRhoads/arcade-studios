class Game < ApplicationRecord
    has_one :player
    has_many :baddies
end
