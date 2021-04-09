class AddActiveToGameOver < ActiveRecord::Migration[6.0]
  def change
    add_column :game_overs, :active, :boolean, default: false
  end
end
