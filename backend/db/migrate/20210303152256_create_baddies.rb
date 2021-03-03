class CreateBaddies < ActiveRecord::Migration[6.0]
  def change
    create_table :baddies do |t|
      t.string :name
      t.integer :speed
      t.references :game, foreign_key: true
      t.timestamps
    end
  end
end
