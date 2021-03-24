# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

DEFAULT_MAP = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1  
                ]


game_a = Game.create(name: "Super Mario World", gravity: 1.8, friction: 0.77)

player_a = Player.create(name: "Mario", game: game_a, speed: 1.8, jumping_height: 38)

baddie_a = Baddy.create(name: "Bowser", game: game_a)

game_a.map = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
               0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
               0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 0, 0, 
               0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 
               0, 0, 3, 0, 3, 0, 0, 2, 0, 3, 0, 0, 
               0, 0, 0, 1, 0, 0, 0, 2, 0, 0, 0, 0, 
               1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1  
               ]

game_a.coins = [[3, 4], [6, 1], [ 7, 1], [8, 1], [9, 1], [10, 1], [12, 3]]
game_a.save




game_b = Game.create(name: "Feather Cube", gravity: 0.1, friction: 0.79)
player_b =Player.create(name: "Feather Fast", speed: 27, jumping_height:33, game: game_b )

game_b.map = DEFAULT_MAP 
game_b.save




