class CreateEndOfGames < ActiveRecord::Migration[6.0]
  def change
    create_table :end_of_games do |t|
      t.integer :x_pos
      t.integer :y_pos
      t.integer :coin_min
      t.integer :player_lives, :default => 1
      t.references :game, null: false, foreign_key: true
      t.boolean :has_coin_min, :default => false
      t.boolean :active, :default => false

      t.timestamps
    end
  end
end
