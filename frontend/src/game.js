function Game(name, gravity, friction, canvas_width, canvas_height ) {
    return {
        name,
        gravity,
        friction,
        canvas_width,
        canvas_height
    }

}



function Player(name, height, width, speed, jumping_height, x_velocity, y_velocity) {
    return {
        name,
height,
width,
speed,
jumping_height,
x_velocity,
y_velocity
    },

this.jumping = false
}