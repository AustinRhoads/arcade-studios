class CreateGameOvers < ActiveRecord::Migration[6.0]
  def change
    create_table :game_overs do |t|
      t.integer :x_pos
      t.integer :y_pos
      t.integer :coin_min
      t.integer :player_lives, :default => 1
      t.references :game, null: false, foreign_key: true

      t.timestamps
    end
  end
end
