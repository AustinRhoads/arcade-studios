class CreateBaddies < ActiveRecord::Migration[6.0]
  def change
    create_table :baddies do |t|
      t.string :name
      t.float :speed, :default => 0.5
      t.integer :height, :default => 32
      t.integer :width, :default => 32
      t.integer :x_velocity, :default => 0
      t.integer :y_velocity, :default => 0
      t.integer :x_respawn, :default => 300
      t.integer :y_respawn, :default => 300
      t.integer :d
      t.integer :range, :default => 20
      t.integer :type_of_baddy, :default => 1

      t.references :game, foreign_key: true
      t.timestamps
    end
  end
end
