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


function Baddy(name, height, width, speed, type_of_baddy) {
   
    this.name = name,
    this.height = height,
    this.width = width,
    this.speed = speed,
    this.type_of_baddy = type_of_baddy,
    this.x_velocity = 0,
    this.y_velocity = 0,
    this.x_respawn = 300,
    this.y_respawn = 330,
    this.mode = "waiting"
   
    
    
}


Baddy.prototype = {
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
    setOldRight: function(x){this.x_old = x - this.width},
    behave: function(){this.behavior(this)},
    set_image_and_behavior: function (tile_sheet){
        let type = parseInt(this.type_of_baddy);
        switch(type){
            case 1:
               this.image = tile_sheet.block_head;
               this.behavior = block_head_behavior;
               this.x_respawn = 300;
               this.y_respawn = 80;
               this.width = 80;
               this.height = 80;
            break;
            case 2:
                this.image = tile_sheet.back_and_forth;
                this.behavior = back_and_forth_behavior;
                this.x_respawn = 380;
                this.y_respawn = 300;
            break;
            case 3:
                this.image = tile_sheet.follower
                this.behavior = follower_behavior
                this.x_respawn = 460;
                this.y_respawn = 300;
                this.width = 32;
                this.height = 32;
            break;
            case 4:
                this.image = tile_sheet.spikes
                this.behavior = spikes_behavior
                this.x_respawn = 380;
                this.y_respawn = 80;
            break;
            case 5:
                this.image = tile_sheet.jumper
                this.behavior = jumper_behavior
                this.x_respawn = 200;
                this.y_respawn = 300;
            break;
        }
    }
}

//
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


function Coin(column, row){
    this.column = column,
    this.row = row,
    this.x = this.column * tile_size,
    this.y = this.row * tile_size,
    this.height = 80,
    this.width = 80
}

Coin.prototype = {
    getBottom: function() {return this.y + this.height},
    getTop: function(){return this.y },
    getLeft: function(){return this.x},
    getRight: function(){return this.x + this.width},
}

function block_head_behavior(baddy){
    //console.log("")
    switch(this.mode){
        case "waiting":
            this.y = this.y_respawn
            
        if(currentGame.player.x >= this.x - 80 && currentGame.player.x <= this.x + this.width + 80){
            this.mode = "active";
        }
        
        break;
        case "active":
            this.y_velocity += this.speed * 0.9;
            let t_v = Math.sqrt(this.y_velocity * this.y_velocity )
            this.y_velocity = t_v
           
            if(this.y_velocity <= 0.9){
                
                 retrieve_in_x_seconds(this, 2.5)   
            } 
          
        break;
        case "retrieving":
            this.y_velocity -= this.speed * 0.9;
            if(this.y <= this.y_respawn){this.y = this.y_respawn}
            if(this.y <= this.y_respawn){this.mode = "waiting"}
        break;
    }
    
  
    this.x += this.x_velocity;

    this.y += this.y_velocity;
    this.x_velocity *= currentGame.friction; 
    this.y_velocity *= currentGame.friction; 


    if(this.x <= 0){
        this.x = 1;
      } else if(this.x >= currentGame.canvas_width - this.width){
        this.x = currentGame.canvas_width - this.width - 1 ;  
      }

}

function back_and_forth_behavior(baddy){
    console.log("this naddy's x: " + baddy.x + " b n f")
// baddy.x ++
}

function follower_behavior(baddy){
    console.log("this naddy's x: " + baddy.x + " follow")
}

function spikes_behavior(baddy){
    console.log("this naddy's x: " + baddy.x + " spikes")
}

function jumper_behavior(baddy){
    console.log("this baddy's x: " + baddy.x + " jumper")
}

function retrieve_in_x_seconds(baddy, seconds){
    let num = seconds * 1000
    setTimeout(function(){
        baddy.mode = "retrieving";
    }, num)
}
