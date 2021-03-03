class ApplicationController < ActionController::API

    def index
        games = Game.all 
        render json: games, include: [:player, :baddies]
    end

end
