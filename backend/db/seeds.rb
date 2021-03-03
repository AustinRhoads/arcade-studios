# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
game_a = Game.create(name: "Super Mario World")

player_a = Player.create(name: "Mario", game: game_a)

baddie_a = Baddy.create(name: "Bowser", game: game_a)