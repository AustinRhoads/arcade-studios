function setOld(game){
    let player = game.player;
    let x = player.x;
    let y = player.y;
    player.setOldTop(y);
    player.setOldLeft(x);
    player.setOldBottom(y);
    player.setOldRight(x);
    }


    
function velocity_controll(game){
    if(controller.up && game.player.jumping == false) { 
      game.player.y_velocity -= game.player.jumping_height; 
      game.player.jumping = true;
    }
  
    if(controller.left){
      game.player.x_velocity -= game.player.speed; 
   
    }
  
    if(controller.right){
      game.player.x_velocity += game.player.speed; 
  
    }
    if(controller.down && game.player.jumping == true){
     game.player.y_velocity += game.player.speed
    }


    game.player.y_velocity += game.gravity;
    game.player.x += game.player.x_velocity;

    game.player.y += game.player.y_velocity;
    game.player.x_velocity *= game.friction; 
    game.player.y_velocity *= game.friction; 


    if(game.player.x <= 0){
        game.player.x = 1;
      } else if(game.player.x >= game.canvas_width - game.player.width){
        game.player.x = game.canvas_width - game.player.width - 1 ;  
      }

  }




  
function collision_detection(game){

    var top, left, bottom, right, val
 
 
   top = Math.floor(game.player.getTop() / tile_size);
    left = Math.floor(game.player.getLeft() / tile_size);
    val = game.map[top * game.columns + left]
    collide(val, game.player, left * tile_size, top * tile_size, tile_size);
  //  console.log(currentGame.player.getTop() /tile_size);
 
 
    top = Math.floor(game.player.getTop() / tile_size);
    right = Math.floor(game.player.getRight() / tile_size);
    val = game.map[top * game.columns + right]
    collide(val, game.player, right * tile_size, top * tile_size, tile_size)
    
    bottom = Math.floor(game.player.getBottom() / tile_size);
    left = Math.floor(game.player.getLeft() / tile_size);
    val = game.map[bottom * game.columns + left]
    collide(val, game.player, left * tile_size, bottom * tile_size, tile_size)
    
    bottom = Math.floor(game.player.getBottom() / tile_size);
    right = Math.floor(game.player.getRight() / tile_size);
    val = game.map[bottom * game.columns + right]     
    collide(val, game.player, right * tile_size, bottom * tile_size, tile_size)
 }
 
                                                  
   function collide(val, player, tile_x, tile_y, tile_size){
     
     switch(val){
       case 0:
       //sky
       break;
       case 1: if(collideTop   (player, tile_y             )); break;   // return; //earth
            //      collideBottom(player, tile_y + tile_size ); break;
       case 2: if(collideTop   (player, tile_y             )) return; //crate
               if(collideLeft  (player, tile_x             )) return;
               if(collideRight (player, tile_x + tile_size )) return;
                  collideBottom(player, tile_y + tile_size  ); break;
                  
       case 3: if(collideTop   (player, tile_y             )); break; //sky_island
                                                                          
 
   } 
 }