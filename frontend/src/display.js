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




const Viewport = function(x, y, w, h){


    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
}

Viewport.prototype = {
    scrollTo: function(x, y){
        this.x = x - (this.w * 0.5);// + 336;
       // this.y = y - (this.w * 0.5);// + 32;
      this.y = 0;
    }
};








function set_game_canvas(){
    game_canvas = document.querySelector("#game-canvas");
    game_canvas.height = currentGame.canvas_height;
    
    
    game_context = document.querySelector("#game-canvas").getContext("2d");
     
    game_context.canvas.height = currentGame.canvas_height;
    
    game_context.canvas.width = 900;
}














function runTileEditor(){

let tileType = document.getElementById('tile-type');
let tileDisplay = document.querySelector('#tile-display');
let tile_sheet = new TileSheet();


tileDisplay.height = 80;
tileDisplay.width = 80;


tileType.addEventListener("click", function(){

  let testImg = document.createElement('img')
  testImg.src = './public/images/grey_checkered_4px.png';

  
  let img = imageRef(parseInt(tileType.value), tile_sheet);
  let ctx = tileDisplay.getContext('2d');

  ctx.drawImage(testImg, 0, 0);
  ctx.drawImage(img, 0, 0);
  
})
}





function scrollLeft(viewport){
viewport.x -= 80;
}

function scrollRight(viewport){
viewport.x += 80;
}


function placeCoins(coins, vp, ctx){

    
      
       for (let i = coins.length - 1; i >= 0; --i){
         
         let coin_img = document.createElement('img')
         coin_img.src = "./public/images/mario_coin_80px.png";

           let x = (coins[i].x - vp.x) - 22;
           let y = coins[i].y;
           ctx.drawImage(coin_img, x, y);
         
        

        }
      
   }

   function coinCollide(coin, player , vp){
       

   let rightOver = player.getRight() <= coin.getRight() - 11 && player.getRight() >= coin.getLeft() + 11;
   let leftOver = player.getLeft() >= coin.getLeft() + 11 && player.getLeft() <= coin.getRight() - 11;
   let topOver = player.getTop() <= coin.getBottom() && player.getTop() >= coin.getTop();
   let bottomOver = player.getBottom() >= coin.getTop() && player.getBottom() <= coin.getBottom();
   
    if( (rightOver || leftOver) && (bottomOver || topOver) ){
        return true;
    };
   }








   

