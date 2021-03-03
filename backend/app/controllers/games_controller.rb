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
        if player_params[:name] != "" #tempfix
         player = game.build_player(player_params).save
        end
      
       render json: game, include: [:player]
    end

    def game_params
        params.require(:game).permit(:name)
    end

    def player_params
        params.require(:player).permit(:name)
    end


end