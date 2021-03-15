# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
game_a = Game.create(name: "Super Mario World", gravity: 1.8, friction: 0.77)

player_a = Player.create(name: "Mario", game: game_a, speed: 1.8, jumping_height: 38)

baddie_a = Baddy.create(name: "Bowser", game: game_a)


game_b = Game.create(name: "Feather Cube", gravity: 0.1, friction: 0.79)
player_b =Player.create(name: "Feather Fast", speed: 27, jumping_height:33, game: game_b )