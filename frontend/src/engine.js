function setOld(game){
    let player = game.player;
    let x = player.x;
    let y = player.y;
    player.setOldTop(y);
    player.setOldLeft(x);
    player.setOldBottom(y);
    player.setOldRight(x);


    if(currentGame.alive_baddies){
      currentGame.alive_baddies.forEach(function(el){

        let b_x = el.x;
        let b_y = el.y;
        el.setOldTop(b_y);
        el.setOldLeft(b_x);
        el.setOldBottom(b_y);
        el.setOldRight(b_x);
      })
    }


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




  
function collision_detection(game, player){

    var top, left, bottom, right, val
 
 
   top = Math.floor(player.getTop() / tile_size);
    left = Math.floor(player.getLeft() / tile_size);
    val = game.map[top * game.columns + left]
    collide(val, player, left * tile_size, top * tile_size, tile_size);
  //  console.log(currentGame.player.getTop() /tile_size);
 
 
    top = Math.floor(player.getTop() / tile_size);
    right = Math.floor(player.getRight() / tile_size);
    val = game.map[top * game.columns + right]
    collide(val, player, right * tile_size, top * tile_size, tile_size)
    
    bottom = Math.floor(player.getBottom() / tile_size);
    left = Math.floor(player.getLeft() / tile_size);
    val = game.map[bottom * game.columns + left]
    collide(val, player, left * tile_size, bottom * tile_size, tile_size)
    
    bottom = Math.floor(player.getBottom() / tile_size);
    right = Math.floor(player.getRight() / tile_size);
    val = game.map[bottom * game.columns + right]     
    collide(val, player, right * tile_size, bottom * tile_size, tile_size)
 }
 
                                                  
   function collide(val, player, tile_x, tile_y, tile_size){
     
     switch(val){
       case 0:
       //sky
       break;
       case 1: if(collideTop   (player, tile_y             )); break;   // return; //earth
       case 2: if(collideTop   (player, tile_y             )) return; //crate
               if(collideLeft  (player, tile_x             )) return;
               if(collideRight (player, tile_x + tile_size )) return;
                  collideBottom(player, tile_y + tile_size  ); break;
                  
       case 3: if(collideTop   (player, tile_y             )); break; //sky_island

                                                                          
 
   } 
 }





 
function collideTop(player, tile_top){

  if (player.getBottom() > tile_top && player.getOldBottom() <= tile_top){
    
      player.setBottom(tile_top - 0.01);
      
      player.y_velocity = 0;
      player.jumping = false;
      
      return true;
  } return false;
}

function collideLeft(player, tile_left){

  if (player.getRight() > tile_left && player.getOldRight() <= tile_left){
  
      player.setRight(tile_left - 1);
      player.x_velocity = 0;
      return true;
  } return false;
  
}

function collideBottom(player, tile_bottom){


  

  if(player.getTop() < tile_bottom && player.getOldTop() >= tile_bottom){
    
      player.setTop(tile_bottom + 0.01);
      player.y_velocity = 0;
      return true;
  } return false;
}

function collideRight(player, tile_right){
  
  
  if(player.getLeft() < tile_right && player.getOldLeft() >= tile_right){
    
      player.setLeft(tile_right + 1);
      player.x_velocity = 0;
      return true;
  } return false;
}





///BADDY VERSIONS








function coinCollide(coin, player , vp){
       

  let rightOver = player.getRight() <= coin.getRight() - 11 && player.getRight() >= coin.getLeft() + 11;
  let leftOver = player.getLeft() >= coin.getLeft() + 11 && player.getLeft() <= coin.getRight() - 11;
  let topOver = player.getTop() <= coin.getBottom() && player.getTop() >= coin.getTop();
  let bottomOver = player.getBottom() >= coin.getTop() && player.getBottom() <= coin.getBottom();
  
   if( (rightOver || leftOver) && (bottomOver || topOver) ){
       return true;
   };
  }



  

function touching_baddy(bad, player){

let leftOver =  player.getLeft() <= bad.getRight() &&  player.getLeft() >= bad.getLeft();
let topOver = player.getTop() <= bad.getBottom() && player.getTop() >= bad.getTop();
let rightOver = player.getRight() >= bad.getLeft() && player.getRight() <= bad.getRight();
let bottomOver = player.getBottom() >= bad.getTop() && player.getBottom() <= bad.getBottom();

  if((leftOver || rightOver) && (bottomOver || topOver)){
      return true;
  }else{return false}


}


  function baddy_collide(val, player, bad){
    //var val = bad.type_of_baddy
    switch(val){
      case 1:
              
             if(baddyCollideTop       (player, bad  )) return; //blockhead
             if(baddyCollideLeft      (player, bad  )) return;
             if(baddyCollideBottom    (player, bad  )) return;
                baddyCollideRight     (player, bad  );  break;
      
      case 2: //back and forth
            if(baddyCollideTopMortal ( player, bad  )) return;
            if(baddyCollideRight     ( player, bad  )) return;
               baddyCollideLeft      ( player, bad  );  break;
       

     
   
      
      case 3://follower
            if(baddyCollideTopMortal ( player, bad  )) return;
            if(baddyCollideRight     ( player, bad  )) return;
               baddyCollideLeft      ( player, bad  );  break;

           
     
    }
  }



  function baddyCollideTop(player, bad){

    if (player.getBottom() > bad.getTop() && player.getOldBottom() <= bad.getTop()){
      
        player.setBottom(bad.getTop() - 0.01);
        console.log("dead")
        
        player.y_velocity = 0;
        player.jumping = false;
        
        return true;
    } return false;
  }

  function baddyCollideTopMortal(player, bad){

    if (player.getBottom() > bad.getTop() && player.getOldBottom() <= bad.getTop()){
      
        player.setBottom(bad.getTop() - 0.01);
        
        player.y_velocity = -27;
        player.jumping = false;
        let dead_index = currentGame.alive_baddies.indexOf(bad);
        currentGame.alive_baddies.splice(dead_index, 1);
        return true;
    } return false;
  }
  
  function baddyCollideLeft(player, bad){
  
    if (player.getRight() > bad.getLeft() && player.getOldRight() <= bad.getLeft()){
        player.setRight(bad.getLeft() - 1);
        player.x_velocity = 0;
        console.log("dead")
        return true;
    } return false;
    
  }



  function baddyCollideRight(player, bad){

    if (player.getLeft() < bad.getRight() && player.getOldLeft() >= bad.getOldRight()){  
        player.setLeft(bad.getRight() + 1);
        player.x_velocity = 0;
        console.log("dead")
        return true;
      } return false;

  }
  
  function baddyCollideBottom(player, bad){
   
  //    if(player.getTop() <= bad.getBottom() && player.getOldTop() >= bad.getBottom()){
        player.setTop(bad.getBottom() + 0.01);
        player.y_velocity = 0;
        
        bad.setBottom(player.getTop() - 10);
        bad.y_velocity = 0;
        console.log("dead")
        return true;
     // } return false;
   
  }


 function spawn_baddy(bad){
  bad.x = bad.x_respawn;
  bad.y = bad.y_respawn;
 }


 function spawn_all_baddies(baddies){
  baddies.forEach((b) => spawn_baddy(b))
 }

 function draw_baddy(bad, ctx, vp){
  let x = (bad.x - vp.x);
  let y = bad.y;
  
  
 /* if(bad.type_of_baddy == 2){
    if(bad.facing_left == true){
      ctx.drawImage(bad.second_image, x, y);
    }else{ctx.drawImage(bad.image, x, y)}
  } else {ctx.drawImage(bad.image, x, y)}
 */

  ctx.drawImage(bad.image, x, y)

 }

 function draw_all_baddies(baddies, ctx, vp){
  baddies.forEach((b) => draw_baddy(b, ctx, vp))
 }