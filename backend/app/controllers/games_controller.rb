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
        player = game.build_player(player_params)
        if player.valid?
         player.save
        end
      
    
        baddy_params[:baddies].each do |bad|
            baddy = game.baddies.build(bad)
            if baddy.valid?
                baddy.save
            end
        end


        render json: game, include: [:player, :baddies]
    end

    def game_params
        params.require(:game).permit(:name, :gravity, :friction)
    end

    def player_params
        params.require(:player).permit(:name, :speed, :jumping_height)
    end

    def baddy_params
        params.permit(baddies: [:name, :speed])
       
    end


end