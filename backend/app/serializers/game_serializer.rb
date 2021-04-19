class GameSerializer
  include FastJsonapi::ObjectSerializer
  attributes :name, :id, :player, :baddies, :gravity, :friction, :canvas_width, :canvas_height, :map, :columns, :rows, :coins, :end_of_game
end
