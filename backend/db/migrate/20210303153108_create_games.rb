class CreateGames < ActiveRecord::Migration[6.0]
  def change
    create_table :games do |t|
      t.string :name
      t.float :gravity, :default => 1.5
      t.float :friction, :default => 0.9
      t.integer :canvas_width, :default => 320
      t.integer :canvas_height, :default => 180
      t.timestamps
    end
  end
end
