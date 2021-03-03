class GamesController < ApplicationController

    def index
        games = Game.all 
        options = {
            include: [:players, :baddies]
        }
        render json: games, include: [:player, :baddies]
    end

    def create
      
        game = Game.create(game_params)
       render json: game
    end

    def game_params
        params.require(:game).permit(:name)
    end

end