let earth = new Image();
earth.src = './public/images/earth_1.png';


function TileSheet(){
    
    this.sky = new Image(),
    this.sky.src = './public/images/sky_block_1.png',
    this.earth = new Image(),
    this.earth.src = './public/images/earth_1.png',
    this.crate = new Image(),
    this.crate.src = './public/images/crate_1.png',
    this.sky_island = new Image(),
    this.sky_island.src = './public/images/sky_island_1.png'
    
}






function imageRef(num, ts){
switch(num){
 case 0:
     return ts.sky;
 break;
 case 1:
     return ts.earth;
 break;
 case 2:
     return ts.crate;
 break;
 case 3:
     return ts.sky_island;
 break;
}


}

function collideTop(player, tile_top){

    if (player.getBottom() > tile_top && player.getOldBottom() <= tile_top){
      
        player.setBottom(tile_top - 0.03);
        
        player.y_velocity = 0;
        player.jumping = false;
        
        return true;
    } return false;
}

function collideLeft(player, tile_left){
  
    if (player.getRight() > tile_left && player.getOldRight() <= tile_left){
    
        player.setRight(tile_left - 0.03);
        player.x_velocity = 0;
        return true;
    } return false;
    
}

function collideBottom(player, tile_bottom){

    if(player.getTop() < tile_bottom && player.getOldTop()){
        console.log(player.getOldTop(), tile_bottom);
    }
    

    if(player.getTop() < tile_bottom && player.getOldTop() >= tile_bottom){
      
        player.setTop(tile_bottom + 0.01);
        player.y_velocity = 0;
        return true;
    } return false;
}

function collideRight(player, tile_right){

    if(player.getLeft() < tile_right && player.getOldLeft() >= tile_right){
        
        player.setLeft(tile_right + 0.03);
        player.x_velocity = 0;
        return true;
    } return false;
}