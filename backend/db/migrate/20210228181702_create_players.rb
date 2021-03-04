class CreatePlayers < ActiveRecord::Migration[6.0]
  def change
    create_table :players do |t|
      t.string :name
      t.float :speed, :default => 0.5
      t.integer :jumping_height, :default => 25

      t.references :game, foreign_key: true
      t.timestamps
    end
  end
end
