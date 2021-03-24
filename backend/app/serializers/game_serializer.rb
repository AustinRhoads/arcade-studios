class GameSerializer
  include FastJsonapi::ObjectSerializer
  attributes :name, :player, :baddies, :gravity, :friction, :canvas_width, :canvas_height, :map, :columns, :rows, :coins 
end
