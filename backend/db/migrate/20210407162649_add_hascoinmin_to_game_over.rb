class AddHascoinminToGameOver < ActiveRecord::Migration[6.0]
  def change
    add_column :game_overs, :has_coin_min, :boolean, default: false
  end
end
