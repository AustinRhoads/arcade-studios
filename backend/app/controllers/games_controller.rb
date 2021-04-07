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
         
        current_baddies = []
         baddy_params[:baddies].each do |bad|
           
            if bad['id'] == "" || bad['id'] == nil
                
                baddy = Baddy.create(bad)
                baddy.game = game
                baddy.save
                current_baddies << baddy
            else
                
               baddy = Baddy.find_by(:id => bad['id'])
               baddy.update(bad)
               baddy.save
               current_baddies << baddy
            end
        end

      
        if game.baddies.length > current_baddies.length
            old_baddies = game.baddies - current_baddies
            old_baddies.each do |bad|
                bad.delete
            end
        end

        game.update(game_params)
      
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

    def game_over_params
        params.require(:game_over).permit(:x_pos, :y_pos, :coin_min, :has_coin_min, :player_lives)
    end


end