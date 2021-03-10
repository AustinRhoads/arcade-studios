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
  //  this.x = 144,
  //  this.y = 0,
    this.x_velocity = 0,
    this.y_velocity = 0,
    this.jumping = false
}


function Baddy(name, height, width, speed) {
   
    this.name = name,
    this.height = height,
    this.width = width,
    this.speed = speed,
    this.x_velocity = 0,
    this.y_velocity = 0
}