class CreatePlayers < ActiveRecord::Migration[6.0]
  def change
    create_table :players do |t|
      t.string :name
      t.integer :speed
      t.integer :jump_height

      t.timestamps
    end
  end
end
