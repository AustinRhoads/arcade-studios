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
    this.range = 10,
    this.mode = "waiting",
    this.facing_left = false
   
    
    
}


Baddy.prototype = {
    getBottom: function() {return this.y + this.height},
    getTop: function(){return this.y },
    getLeft: function(){return this.x},
    getRight: function(){return this.x + this.width},
    getOldBottom: function(){return this.y_old + this.height},
    getOldTop: function(){return this.y_old  + this.height},//not sure why i had to add this.height
    getOldLeft: function(){return this.x_old  + this.width},//not sure why i had to add this.width
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
        this.mode = "waiting";
        let type = parseInt(this.type_of_baddy);
        switch(type){
            case 1:
               this.image = tile_sheet.block_head;
               this.behavior = block_head_behavior;
               this.width = 80;
               this.height = 80;
            break;
            case 2:
                this.image = tile_sheet.back_and_forth;
                this.first_image = tile_sheet.back_and_forth;
                this.second_image = tile_sheet.back_and_forth_flipped;
                this.behavior = back_and_forth_behavior;
                this.width = 60;
                this.height = 40;
                this.paces = 0;
                this.facing_left = false;
                this.mode = "waiting"
            break;
            case 3:
                this.image = tile_sheet.follower
                this.behavior = follower_behavior
                this.width = 40;
                this.height = 40;
                this.mode = "waiting"

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
    },
    respawn: function(){
        this.x = this.x_respawn; 
        this.y = this.y_respawn;
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
    let destination_x = currentGame.player.x;
   // let destination_y = currentGame.player.y;
    let baddy_width = this.width;
  //  let baddy_height = this.height;


  if(touching_baddy(this, currentGame.player)){
   baddy_collide(this.type_of_baddy, currentGame.player, this)
}
    
    switch(this.mode){
        case "waiting":
            this.y = this.y_respawn
            
        if(destination_x >= this.x - 80 && destination_x <= this.x + this.width + 80){
            this.mode = "active";
        }
        
        break;
        case "active":
            this.y_velocity += this.speed * 0.9;
            let t_v = Math.sqrt(this.y_velocity * this.y_velocity )
            this.y_velocity = t_v
           
            if(this.y_velocity <= this.speed * 0.9){
                
                 retrieve_in_x_seconds(this, 2)   
            } 
          
        break;
        case "retrieving":
            this.y_velocity -= 0.5 * 0.9;
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

    if(touching_baddy(this, currentGame.player)){
        baddy_collide(this.type_of_baddy, currentGame.player, this)
     }

    switch(this.mode){
        case "waiting":

        this.x = this.x_respawn;
        this.y = this.y_respawn;
            if(currentGame.player.x <= this.x + 600 && currentGame.player.x >= this.x - 600){
                this.mode = "patrolling";
            }
        break;
        case "patrolling":
          let baddy_x = this.x;
          let baddy_width = this.width;
          let baddy_speed = this.speed;
          //let baddy_x_velocity = this.x_velocity;
          //let baddy_y_velocity = this.x_velocity;
          let baddy_x_respawn = this.x_respawn;
          //let baddy_y_respawn = this.y_respawn;
          let destination_x = currentGame.player.x
          let player = currentGame.player;

            if(this.x_velocity == 0 || this.paces >= this.range || baddy_x == currentGame.canvas_width - baddy_width - 1){
                
                this.paces = 0;
                this.facing_left = !this.facing_left;

            }
            
            if(this.facing_left == true){
                
                this.x_velocity = baddy_speed
                this.x -= this.x_velocity;
                this.paces = Math.sqrt((this.x - baddy_x_respawn) * (this.x - baddy_x_respawn));
                this.image = this.second_image;
               }else if(this.facing_left == false){
                
                this.x_velocity = baddy_speed
                this.x += this.x_velocity; 

                this.paces = Math.sqrt((this.x - baddy_x_respawn) * (this.x - baddy_x_respawn));
                this.image = this.first_image;
               }

               //calling collision_destection



          


          

               if(destination_x > this.x + 600 && destination_x < this.x - 600){
                this.mode = "waiting";
            }
               
        break;
    }

    this.y += currentGame.gravity + this.speed;


}

function follower_behavior(baddy){
 
    if(touching_baddy(this, currentGame.player)){
        baddy_collide(this.type_of_baddy, currentGame.player, this)
     }
  
  switch(this.mode){
      case "waiting":
        this.x = this.x_respawn;
        this.y = this.y_respawn;
          if(currentGame.player.x <= this.x + 600 && currentGame.player.x >= this.x - 600){
              this.mode = "chasing"

          }
      break;
      case "chasing":
          let baddy_x = this.x
          let destination_x = currentGame.player.x
          let baddy_width = this.width

          let distance = destination_x - baddy_x
          this.x_velocity += distance * (0.0005 * this.speed);
          this.x += this.x_velocity;

          this.x_velocity *= 0.98;

    if(destination_x > baddy_x + 900 && destination_x < baddy_x - 900){
        this.mode = "waiting";
    }
       
      break;
  }
  this.y += currentGame.gravity + this.speed;
}









function spikes_behavior(baddy){
    
}




function jumper_behavior(baddy){
    
}




function retrieve_in_x_seconds(baddy, seconds){
    let num = seconds * 1000
    setTimeout(function(){
        baddy.mode = "retrieving";
    }, num)
}


function GameOver(x_pos, y_pos){
this.x_pos = x_pos,
this.y_pos = y_pos
}

GameOver.prototype = {
    set_image: function(tile_sheet){
        this.image = tile_sheet.game_over_door
    }
}