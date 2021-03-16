class CreateGames < ActiveRecord::Migration[6.0]
  def change
    create_table :games do |t|
      t.string :name
      t.float :gravity, :default => 1.5
      t.float :friction, :default => 0.9
      t.integer :canvas_width, :default => 960
      t.integer :canvas_height, :default => 560
      t.integer :columns, :default => 12
      t.integer :rows, :default => 7
      t.text :map, array: true
      t.timestamps
    end
  end
end
