class GamesController < ApplicationController

    def index
        games = Game.all 
        options = {
            include: [:players, :baddies,  :name, :player, :gravity, :friction, :canvas_width, :canvas_height, :map, :coins]
        }
        render json: GameSerializer.new(games)
    end

    def create
        game = Game.create(game_params)
        player = game.build_player(player_params)
        game.coins = params['coins']
        game.save
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


    def show
        game = Game.find_by(:id => params[:id])
        render json: GameSerializer.new(game)
    end

    def update
        game = Game.find_by(:id => params[:id])
        game.player.update(player_params)
        game.player.save
        game.coins = params['coins']
         

         baddy_params[:baddies].each do |bad|
            
            baddy = Baddy.find_by(:id => bad['id'])
            if baddy.valid?
                baddy.update(bad)
                baddy.save
           end
        end
        game.update(game_params)
      #  binding.pry
        game.save

        render json: GameSerializer.new(game)
    end

    def destroy
        game = Game.find_by(:id => params[:id])
        game.player.delete
        game.delete
    end


    def game_params
        params.require(:game).permit( :name, :player, :gravity, :friction, :canvas_width, :canvas_height, :columns, :rows, coins: [], map: [])
    end

    def player_params
        params.require(:player).permit(:name, :speed, :jumping_height)
    end

    def baddy_params
        params.permit(baddies: [:id, :name, :speed, :height, :width, :d, :range, :x_velocity, :y_velocity, :x_respawn, :y_respawn, :type_of_baddy])
       
    end


end