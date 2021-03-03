class Game < ApplicationRecord
    has_one :player
    has_many :baddies


    accepts_nested_attributes_for :player
    accepts_nested_attributes_for :baddies
end
