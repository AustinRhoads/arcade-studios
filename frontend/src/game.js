function Game( name, gravity, friction, canvas_width, canvas_height ) {
    return {
        
        name,
        gravity,
        friction,
        canvas_width,
        canvas_height
    }

}



function Player( name, height, width, speed, jumping_height) {
    
    this.name = name,
    this.height = height,
    this.width = width,
    this.speed = speed,
    this.jumping_height = jumping_height,
  
    this.x_velocity = 0,
    this.y_velocity = 0,
    this.jumping = false,
    this.x_respawn = 100,
    this.y_respawn = 330
    this.x = this.x_respawn,
    this.y = this.y_respawn,
    this.x_old = this.x,
    this.y_old = this.y
}


function Baddy(name, height, width, speed) {
   
    this.name = name,
    this.height = height,
    this.width = width,
    this.speed = speed,
    this.x_velocity = 0,
    this.y_velocity = 0
}


Player.prototype = {
    getBottom: function() {return this.y + this.height},
    getTop: function(){return this.y },
    getLeft: function(){return this.x},
    getRight: function(){return this.x + this.width},
    getOldBottom: function(){return this.y_old + this.height},
    getOldTop: function(){return this.y_old + this.height},//not sure why i had to add this.height
    getOldLeft: function(){return this.x_old + this.width},//not sure why i had to add this.width
    getOldRight: function(){return this.x_old + this.width},
    setBottom: function(y){this.y = y - this.height},
    setTop: function(y){this.y = y},
    setLeft: function(x){this.x = x},
    setRight: function(x){this.x = x - this.width},
    setOldBottom: function(y){this.y_old = y - this.height},
    setOldTop: function(y){this.y_old = y},
    setOldLeft: function(x){this.x_old = x },
    setOldRight: function(x){this.x_old = x - this.width}
}



