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
    this.game_over_door.src =  './public/images/game_over_door.png',
    this.coin = new Image(),
    this.coin.src = './public/images/mario_coin_80px.png'
    
    
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
 case 4:
    return ts.coin;
break;
case 5:
    return ts.game_over_door;
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


    tileType.addEventListener("click", function(){ x_func(this) })
    tileType.addEventListener("change", function(){ x_func(this) })
}


function x_func(tt){

    let tileDisplay = document.querySelector('#tile-display');
    let tile_sheet = new TileSheet();


    tileDisplay.height = 80;
    tileDisplay.width = 80;
    let tileType = tt;
    let testImg = document.createElement('img')
    testImg.src = './public/images/grey_checkered_4px.png';
  
    
    let img = imageRef(parseInt(tileType.value), tile_sheet);
    let ctx = tileDisplay.getContext('2d');
  
    let all_palette_images = document.querySelectorAll("img.palette-img")
  
    for(let x = all_palette_images.length -1; x >= 0; --x){
      if(all_palette_images[x].getAttribute("value") == tileType.value){
          palette_select(all_palette_images[x])
      }
    }
  
  
  
   
    if(img.src == tile_sheet.coin.src){
     // ctx.drawImage(testImg, 0, 0);
      ctx.drawImage(img, -23, 0);
    }else{
      //  ctx.drawImage(testImg, 0, 0);
        ctx.drawImage(img, 0, 0);
    }

    if(tileType.value >=0 && tileType.value <= 3){
        console.log(tileType.value)
        if(painter_on == true){


            map_edit_mode = true;
            clearMapEdit("tiles");

            player_editor_paused = true;
            mapEdit();

            

        } else if(eraser_on == true){

            map_edit_mode = true;
            clearMapEdit("tiles");

            tileType.value = 0;
            tileType.click();
            
            player_editor_paused = true;
            mapEdit();
            

            
        }
        
    }else if(tileType.value == 4){  ////coins
        
        if(painter_on == true){

            coin_edit_mode = true;
            clearMapEdit("coins")


            player_editor_paused = true;
 
            coinAdder();

            

           } else if(eraser_on == true){

            erase_coins_mode = true;
            clearMapEdit("erase-coins")

            remove_coin()

               
           }
    }else if(tileType.value == 5){
        if(painter_on == true){

            door_edit_mode = true;
            clearMapEdit("door")
            mapSelectEdit()
            setCursor()
           } else if(eraser_on == true){

               clearMapEdit()
           }
    }
    tileType.click();

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



function selectEditTab(evt, tabName) {
    // Declare all variables
    var i, tabcontent, tablinks;
  
    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
  
    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
  
    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
    if(tabName == "map-editor"){
        tileType.click();
    }
  }
   
   

