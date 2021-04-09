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
    this.sky_island.src = './public/images/sky_island_1.png',
    this.block_head = new Image(),
    this.block_head.src = './public/images/block_head.png',
    this.back_and_forth = new Image(),
    this.back_and_forth.src = './public/images/back_and_forth.png',
    this.back_and_forth_flipped = new Image(),
    this.back_and_forth_flipped.src = './public/images/back_and_forth_flipped.png',
    this.follower = new Image(),
    this.follower.src = './public/images/follower_40px.png',
    this.spikes = new Image(),
    this.spikes.src = './public/images/follow_cube.png',//change these images
    this.jumper = new Image()
    this.jumper.src = './public/images/follow_cube.png',//change these images
    this.game_over_door = new Image(),
    this.game_over_door.src =  './public/images/game_over_door.png'
    
    
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





function scrollLeft(viewport, player){
viewport.x -= 80;
player.x -= 80;
}

function scrollRight(viewport, player){
viewport.x += 80;
player.x += 80;
}




    ///////////
   ///COINS///
  ///////////


function placeCoins(coins, vp, ctx){

    
      
       for (let i = coins.length - 1; i >= 0; --i){
         
         let coin_img = document.createElement('img')
         coin_img.src = "./public/images/mario_coin_80px.png";

           let x = (coins[i].x - vp.x) - 22;
           let y = coins[i].y;
           ctx.drawImage(coin_img, x, y);
         
        

        }
      
   }



function draw_door(g, ctx, vp, ts){

let x = g.end_of_game.x_pos - vp.x;
let y = g.end_of_game.y_pos;
ctx.drawImage(ts.game_over_door, 0, 0, 80, 80, x, y, 80, 80)
}




   
   

