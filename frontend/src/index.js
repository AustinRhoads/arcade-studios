////////// SOME IMPORTANT VARIABLES /////////////////

const BASE_URL = "http://localhost:3000";
const GAMES_URL = BASE_URL + "/games";
var currentGame;
var editorToolBox = document.getElementById("editor-toolbox");
const  DEFAULT_MAP = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
                       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
                       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
                       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
                       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
                       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
                       1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1  
                       ]
var addEarthButton = document.getElementById('add-earth-button')
var tile_size = 80;
var  minusEarthButton = document.getElementById('minus-earth-button');
var tileButton = document.getElementById('tile-placer');
var xy = document.getElementById('mouse-x-y')
var tile_selector = document.getElementById('tile-type');
var tile_sheet;
var viewport;
var borderDiv = document.getElementById("border-div");
//var traversing = false;
var map_edit_mode = false;
var tile_selector_x;
var tile_selector_y;
var tile_selector_on = false;
var coin_count = 0;
var coin_counter = document.getElementById('coin-counter');
var add_coin_btn = document.getElementById('add-coin-button');
var remove_coin_btn =  document.getElementById('remove-coin-button');
var coin_list = [];






function populate_load_list(){

  let loader_box = document.getElementById('game-loader')
  let game_load_list = document.getElementById('game-selector');
  let game_load_btn = document.getElementById('load_game');

  game_load_list.remove();
  game_load_btn.remove();
  game_load_list = document.createElement('SELECT');
  game_load_list.id = 'game-selector';
  game_load_btn = document.createElement("button");
  game_load_btn.id = 'load_game';
  game_load_btn.textContent = 'Load';

  game_load_btn.addEventListener("click", function(){
  
    loadGame(document.getElementById('game-selector').value);
   
  });

  loader_box.insertBefore(game_load_list, document.getElementById('reset_game_button'));
  loader_box.insertBefore(game_load_btn, document.getElementById('reset_game_button'));

 
  let all = fetch("http://localhost:3000/games")
   .then(resp => resp.json())
   .then( function(obj){


    //populate the select list
     dataArray = obj['data'];
    for(const game of dataArray){

      let opt = document.createElement('option');
      opt.value = game.id;
      opt.textContent = game.attributes.name;
      game_load_list.appendChild(opt);
      
    }

   });   
}




function populate_editor(obj){
  if (obj.name){
    document.getElementById('game_name').value = obj.name;
  }
  document.getElementById('game_world_gravity').value = obj.gravity;
  document.getElementById('game_world_friction').value = obj.friction;
  if (obj.player.name){
    document.getElementById('player_name').value = obj.player.name;
  }
  document.getElementById('player_speed').value = obj.player.speed;
  document.getElementById('player_jumping_height').value = obj.player.jumping_height;

  if(obj.baddies){
 
    for(let x =0; x < obj.baddies.length; x++){


      newBadButton.click();

      let allBaddies = document.getElementsByClassName('baddy');


      allBaddies[allBaddies.length -1].querySelector('input[name="baddy_name"]').value = obj.baddies[x].name;
      allBaddies[allBaddies.length -1].querySelector('input[name="baddy_speed"]').value = obj.baddies[x].speed;
  }
 }
}



///baddies editor

var newBadButton = document.getElementById('add-baddy');

function addBaddy(){

 
  let editor = document.getElementById('baddies-box');

  let div = document.createElement('div');
  div.classList.add("baddy");

  let removeBaddyButton = document.createElement('button');
  removeBaddyButton.classList.add("removeBaddyButton");
  removeBaddyButton.textContent = "remove";
  removeBaddyButton.addEventListener("click", function(){
    removeMe(this);
   // currentGame.baddies.remove(this);
  });

  let nameInput = document.createElement('input')
  nameInput.style = "margin: 10px;";
  nameInput.type = "text";
  nameInput.name = "baddy_name";
  nameInput.placeholder = "--Name of baddy--";

  let br = document.createElement('br');
  let br2 = document.createElement('br');

  let speedLabel = document.createElement('label');
  speedLabel.for = "baddy_speed";
  speedLabel.textContent = "Baddy's Running speed (0.5-2):";

  let speedInput = document.createElement("input");
  speedInput.style = "margin: 10px;";
  speedInput.type = "number";
  speedInput.name = "baddy_speed";
  speedInput.min = "0.5";
  speedInput.max = "2";
  speedInput.step = "0.1";
  speedInput.value = "0.5";

  
  div.appendChild(nameInput);
  div.appendChild(removeBaddyButton);
  div.appendChild(br);
  div.appendChild(speedLabel);
  div.appendChild(speedInput);
  editor.appendChild(div)
  editor.appendChild(br2);

}


function removeMe(el){
  let baddyEl = el.parentElement;
  baddyEl.parentElement.removeChild(baddyEl);
}




                /////////////////////////////////
               ///REAL TIME PARAMETER CHANGES///
              /////////////////////////////////




//real time parameter changes
let p_speed = document.getElementById('player_speed');

p_speed.addEventListener("click", function() {
  currentGame.player.speed = parseFloat(p_speed.value);
})



let p_jumping_height = document.getElementById('player_jumping_height');

p_jumping_height.addEventListener("click", function() {
  currentGame.player.jumping_height = p_jumping_height.value;
})

let game_gravity = document.getElementById('game_world_gravity');

game_gravity.addEventListener("click", function() {
  currentGame.gravity = parseFloat(game_gravity.value);
})

let game_friction = document.getElementById('game_world_friction');

game_friction.addEventListener("click", function() {
  currentGame.friction = parseFloat(game_friction.value);
})







  
                   ////////////// 
                  ///NEW GAME///
                 //////////////


document.getElementById('reset_game_button').addEventListener("click", function(){
  resetGame();
});




                ///////////////
               ///SAVE GAME///
              ///////////////


function saveGame(){

  let name = document.getElementById('game_name').value;  
  let gravity = document.getElementById('game_world_gravity').value;
  let friction = document.getElementById('game_world_friction').value;

  let gameData = new Game(name, gravity, friction)

  

  let player_name = document.getElementById('player_name').value;
  let player_speed = document.getElementById('player_speed').value;
  let player_jumping_height = document.getElementById('player_jumping_height').value;

  gameData.player = new Player(player_name, ...Array(2), player_speed, player_jumping_height);

  gameData.baddies = [];

  let allBaddies = document.getElementsByClassName('baddy');

  for(let x = 0; x < allBaddies.length; x++){
    gameData.baddies.push({
      name: allBaddies[x].querySelector('input[name="baddy_name"]').value,
      speed: allBaddies[x].querySelector('input[name="baddy_speed"]').value
     });
    
  }
  gameData.map = currentGame.map;
  gameData.columns = currentGame.columns;
  gameData.rows = currentGame.rows;
  gameData.canvas_width = currentGame.canvas_width;
  gameData.canvas_height = currentGame.canvas_height;
  gameData.coins = [];

  for(let i = currentGame.coins.length -1; i >=0; --i){
    gameData.coins.push([currentGame.coins[i].column, currentGame.coins[i].row]);
    
  }
  

if(currentGame.id == null){

    let postGameObject = {
      method: "POST",
      headers:{
          "Content-Type":"application/json",
          "Accept":"application/json"
      },
      body: JSON.stringify(gameData)
    };

  fetch(GAMES_URL, postGameObject)
  .then(resp => resp.json())
  .then(function(obj){

     loadGame(obj.id)

     populate_load_list()

    })
  .catch(function(error){

      alert ("holy shmokes");

  })
}

if(currentGame.id != null){
  
console.log(currentGame.id + "updated");
      let patchGameObject = {
        method: "PATCH",
        headers:{
            "Content-Type":"application/json",
            "Accept":"application/json"
        },
        body: JSON.stringify(gameData)
      };
    
    fetch(GAMES_URL + `/${currentGame.id}`, patchGameObject)
    .then(resp => resp.json())
    .then(function(obj){
      // loadGame(obj['data'].id)
       populate_load_list()
      })
    .catch(function(error){
        alert ("holy shmokes");
    
    
    })
}

  
}


///event listeners to save game

document.getElementById('game_save_button').addEventListener("click", function(){
  saveGame(currentGame);
});






                   ///////////////
                  ///LOAD GAME///
                 ///////////////
                            



function loadGame(id){


  let editor = document.getElementById('baddies-box');
  editor.innerHTML = "";
  
  removeDeleteButton();

    fetch(GAMES_URL+`/${id}`)
    .then(resp => resp.json())
    .then(function(obj){


    let gameData = obj['data'].attributes


     //game properties
    let name = gameData.name;
    let gravity = gameData.gravity;
    let friction = gameData.friction;
    let canvas_width = gameData.canvas_width;
    let canvas_height = gameData.canvas_height;
    let map = gameData.map;
    let columns = gameData.columns;
    let rows = gameData.rows;
    let coins = gameData.coins;

    let loadedGame = new Game(name, gravity, friction, canvas_width, canvas_height );
    loadedGame.id = id;
    loadedGame.map = map;
    loadedGame.columns = columns;
    loadedGame.rows = rows;
    loadedGame.coins = [];

    for(let x = coins.length - 1; x >= 0; --x){
      loadedGame.coins.push(new Coin(coins[x][0], coins[x][1]));
    } 


    //player properties
    let p_name = gameData.player.name;
    let p_height = gameData.player.height;
    let p_width = gameData.player.width;
    let p_speed = gameData.player.speed;
    let p_jumping_height = gameData.player.jumping_height;
    
    loadedGame.player = new Player(p_name, p_height, p_width, p_speed, p_jumping_height);


    //baddy properties
    loadedGame.baddies = [];
    gameData.baddies.forEach((el) => 
      loadedGame.baddies.push(new Baddy(el.name, el.height, el.width, el.speed))
    )

    


    currentGame = loadedGame;
   
    resetGame(currentGame);
  
   })


   createDeleteButton();
   

}





function createDeleteButton(){


  let btn = document.createElement('button');
  btn.id = "delete-button";
  btn.textContent = "Delet Game";


  btn.addEventListener("click", function(){
    deleteGame(currentGame.id);
  })


  editorToolBox.appendChild(btn);

}



function removeDeleteButton(){

  let btn = document.getElementById("delete-button");

  if(btn){
   btn.remove();
  }

}


 
              /////////////////
             ///DELETE GAME///
            /////////////////

  function deleteGame(){

    if(confirm("Are you sure you want to delete this game?")){
 
  
      let configurationObject = {
        method: "DELETE",
        header: {
            "Content-Type" : "application/json",
            "Accept" : "application/json"
        },
        body: JSON.stringify(currentGame)
      }


      fetch(GAMES_URL+`/${currentGame.id}`, configurationObject)
      .then()
      .then(function() {
         removeDeleteButton()
         resetGame()
        }
      )
    }
    
    
  }         


function defaultSettings(){

  let editor = document.getElementById('baddies-box');
  editor.innerHTML = "";

  let defaultGame = new Game(...Array(1), 1.5, 0.9, 960, 560 );
  defaultGame.map = DEFAULT_MAP;
  defaultGame.columns = 12;
  defaultGame.rows = 7;
  defaultGame.player = new Player(...Array(1), 32, 32, 0.5, 20);  
  defaultGame.coins = []
  return defaultGame;
  

}

                 //////////////////
                /// RESET GAME ///
               //////////////////

function resetGame(gameObj){
   populate_load_list();
   gameObj ||= defaultSettings();
   currentGame = gameObj;
   map_edit_mode = false;
   currentGame.player.x = currentGame.player.x_respawn;//add currentGame.x_respawn 
   currentGame.player.y = currentGame.player.y_respawn;//add currentGame.y_respawn
   currentGame.player.edit_x = 144;
   currentGame.player.edit_y = 0; 
   currentGame.player.jumping = true;
   currentGame.coins = gameObj.coins;
   populate_editor(gameObj);
   coin_count = 0;
   coin_list = currentGame.coins.slice();
   
}


function respawnPlayer(){
  currentGame.player.x = currentGame.player.x_respawn;
  currentGame.player.y = currentGame.player.y_respawn;
}

                  ////////////////////////////
                 ////MAP EDITING FUNCTIONS///
                ////////////////////////////

function addEarth(){
  //let map = currentGame.map;
  let ary = [0, 0, 0, 0, 0, 0, 1]
  
  
  for(let x = 0; x < ary.length; x++){
    currentGame.map.splice(((x + 1) * currentGame.columns) + x, 0, ary[x])
  }

//currentGame.map = map
  currentGame.columns += 1;
  currentGame.canvas_width += tile_size;

  game_canvas = document.querySelector("#game-canvas");
  
  game_canvas.width = currentGame.canvas_width;

  currentGame.player.x = currentGame.canvas_width - tile_size;
  // respawnPlayer();
  
}

function minusEarth(){

  let total = currentGame.rows
  for(let x = total; x >= 1; --x){
    currentGame.map.splice((total * currentGame.columns) -1, 1)
    total -= 1;
  }


  currentGame.columns -= 1;
  
  currentGame.canvas_width -= tile_size;

  game_canvas = document.querySelector("#game-canvas");
  
  game_canvas.width = currentGame.canvas_width;
 currentGame.player.x = currentGame.canvas_width - tile_size;
 // respawnPlayer();
  console.log(currentGame.map.length)
}



function minusEarthFromBeginning(){

  let total = currentGame.rows
  for(let x = total; x >= 1; --x){
    currentGame.map.splice((total * currentGame.columns), 1)
    total -= 1;
  }

currentGame.map[-1] = 1;
  currentGame.columns -= 1;
  
  currentGame.canvas_width -= tile_size;

  game_canvas = document.querySelector("#game-canvas");
  
  game_canvas.width = currentGame.canvas_width;

  respawnPlayer();
}

game_canvas = document.querySelector("#game-canvas");
g_canvas = document.getElementById("game-canvas");




function mapEdit(e){
  borderDiv.classList.remove("sky_cursor");
  borderDiv.classList.remove("earth_cursor");
  borderDiv.classList.remove("crate_cursor");
  borderDiv.classList.remove("island_cursor");
  borderDiv.classList.remove("coin_cursor");
  
 
 // traversing = !traversing;
  map_edit_mode = !map_edit_mode;

  if(map_edit_mode == true){
    clearMapEdit("tiles")

    
    tile_selector.click();
    
   
        

    tile_selector.addEventListener("click", () => setCursor());
    setCursor();
      
    mapSelectEdit(e);


  }else{
    clearMapEdit();
   
  //  borderDiv.onmousemove = null;
  //  borderDiv.onclick = null;
    //tile_selector_on = false;
  }


}


var coin_edit_mode = false;

function coinAdder(e){
  
  coin_edit_mode = !coin_edit_mode;

  if(coin_edit_mode == true){
    clearMapEdit("coins")

    tile_selector_on = true;
    setCursor();
    mapSelectEdit(e);

  } else {
    clearMapEdit()
  }

}

function coinRemover(){

}


function setCursor(){

  var cursorType;
  if(map_edit_mode == true){
     cursorType = document.getElementById('tile-type').value;
  } else if(coin_edit_mode == true){
     cursorType = 9;
  }
  
 
  borderDiv.classList.remove("sky_cursor");
  borderDiv.classList.remove("earth_cursor");
  borderDiv.classList.remove("crate_cursor");
  borderDiv.classList.remove("island_cursor");
  borderDiv.classList.remove("coin_cursor");
  

    switch(parseInt(cursorType)){
      case 0:
        borderDiv.classList.add("sky_cursor");
      break;
      case 1:
        borderDiv.classList.add("earth_cursor");
       
      break;
      case 2:
        borderDiv.classList.add("crate_cursor");
      break;
      case 3:
        borderDiv.classList.add("island_cursor");
      break;
      case 9:
        borderDiv.classList.add("coin_cursor");
      break


    }
 
}

function mapSelectEdit(e){

  borderDiv.onmousemove = function(e){



  let column = Math.floor((e.offsetX + (tile_size * 0.5)) / tile_size) + Math.round(viewport.x / tile_size);
  let row = Math.floor((e.offsetY + tile_size * 0.5)/ tile_size);

 // tile_selector_on = true;
  tile_selector_x = (Math.floor((e.offsetX + (tile_size * 0.5)) / tile_size) * tile_size) + (viewport.x % tile_size);
  tile_selector_y = Math.floor((e.offsetY + (tile_size * 0.5)) / tile_size) * tile_size;


  if(tile_selector_x <= 0){tile_selector_x = 0 - (viewport.x % tile_size)};
  if(tile_selector_y <= 0){tile_selector_y = 0};

  

  var coor = "column: " + column + ", row: " + row ;
  xy.innerHTML = coor;


  borderDiv.onclick = () => placeTile(column, row);
  }
  

function placeTile(column, row){
  if(map_edit_mode == true){
    let tileType = document.getElementById('tile-type');
     let val = parseInt(tileType.value);
     let index = row * currentGame.columns + column;
 
     currentGame.map[index] = val;
  } else if(coin_edit_mode == true){
    currentGame.coins.push(new Coin(column, row));
    coin_list = currentGame.coins.slice()
  }


 



      }


  

}


function clearMapEdit(safe_mode){

switch(safe_mode){
  case "coins":
    map_edit_mode = false;
    tile_selector_on = false;
  break;
  case "tiles":
    coin_edit_mode = false;
    tile_selector_on = false;
  break;
  default:
    map_edit_mode = false;
    coin_edit_mode = false;
    tile_selector_on = false;
  break;
}


  let modes = [map_edit_mode, coin_edit_mode, tile_selector_on]

  

  borderDiv.classList.remove("sky_cursor");
  borderDiv.classList.remove("earth_cursor");
  borderDiv.classList.remove("crate_cursor");
  borderDiv.classList.remove("island_cursor");
  borderDiv.classList.remove("coin_cursor");

  borderDiv.onmousemove = null;
  borderDiv.onclick = null;
  xy.innerHTML = "";
}



    /////////////////////////
   //// SIMPLY GAME BUILD///
  /////////////////////////
  
  



   //////////////////////             ////////////////////////////   
  ///CONTROLLER LOGIC///             ///moved to controller.js/// 
 //////////////////////             ////////////////////////////   





  
 window.addEventListener('DOMContentLoaded',  () => {

 

  
  resetGame();
  

  controller = new Controller();
  tile_sheet = new TileSheet();
  viewport = new Viewport(0, 0, 900, 500);

 
    game_canvas = document.querySelector("#game-canvas");
    game_canvas.height = currentGame.canvas_height;
  //  game_canvas.width = currentGame.canvas_width;
  
   game_context = document.querySelector("#game-canvas").getContext("2d");
     
   game_context.canvas.height = currentGame.canvas_height;
  // game_context.canvas.width = currentGame.canvas_width;

 
   


  function setOld(player, x, y){
  player.setOldTop(y);
  player.setOldLeft(x);
  player.setOldBottom(y);
  player.setOldRight(x);
  }





  
                                              //////////////////////
                                             ///GAME ENGINE LOOP///
                                            //////////////////////                                                                                                              
 
                                            game_loop = function(){

                                              coin_counter.innerHTML = "COINS: " + coin_count;

                                              var height = document.documentElement.clientHeight;
                                              var width = document.documentElement.clientWidth;

                                          
                                              
                                            //  game_context.canvas.width = currentGame.canvas_width;
                                              game_context.canvas.width = 900;
                                             
                                      

                                            setOld(currentGame.player, currentGame.player.x, currentGame.player.y);
                                              

                                              if(controller.up && currentGame.player.jumping == false) { 
                                                currentGame.player.y_velocity -= currentGame.player.jumping_height; 
                                                currentGame.player.jumping = true;
                                              }
                                            
                                              if(controller.left){
                                                currentGame.player.x_velocity -= currentGame.player.speed; 
                                             
                                              }
                                            
                                              if(controller.right){
                                                currentGame.player.x_velocity += currentGame.player.speed; 
                                            
                                              }
                                              if(controller.down && currentGame.player.jumping == true){
                                               currentGame.player.y_velocity += currentGame.player.speed
                                              }
                                               
                                                                 //////////////////
                                                                ///GAME PHYSICS///
                                                               //////////////////
                     
                                             currentGame.player.y_velocity += currentGame.gravity;
                                             currentGame.player.x += currentGame.player.x_velocity;
                     
                                             currentGame.player.y += currentGame.player.y_velocity;
                                             currentGame.player.x_velocity *= currentGame.friction; 
                                             currentGame.player.y_velocity *= currentGame.friction; 
                                            
                                            
                                                   //////////////////////////
                                                  ///COLLISION DETECTION ///
                                                 //////////////////////////
                                            
                                    

                                              if(currentGame.player.x <= 0){
                                                currentGame.player.x = 1;
                                              } else if(currentGame.player.x >= currentGame.canvas_width - currentGame.player.width){
                                                currentGame.player.x = currentGame.canvas_width - currentGame.player.width - 1 ;
                                                
                                              }
                                            
                                              //fill background with dark grey #202020
                                              game_context.fillStyle = '#1696ab' ; //teal background
                                              game_context.fillRect(0, 0, viewport.w, viewport.h); //fill in the size of the game.canvas_width/height



                                                          /////////////////////////
                                                         ///COLLISION DETECTION///
                                                        /////////////////////////

                                                
                                     


                                                         ///TOP LEFT BOTTOM RIGHT///

                                             var top, left, bottom, right, val


                                              top = Math.floor(currentGame.player.getTop() / tile_size);
                                              left = Math.floor(currentGame.player.getLeft() / tile_size);
                                              val = currentGame.map[top * currentGame.columns + left]
                                              collide(val, currentGame.player, left * tile_size, top * tile_size, tile_size);
                                            //  console.log(currentGame.player.getTop() /tile_size);


                                              top = Math.floor(currentGame.player.getTop() / tile_size);
                                              right = Math.floor(currentGame.player.getRight() / tile_size);
                                              val = currentGame.map[top * currentGame.columns + right]
                                              collide(val, currentGame.player, right * tile_size, top * tile_size, tile_size)
                                              
                                              bottom = Math.floor(currentGame.player.getBottom() / tile_size);
                                              left = Math.floor(currentGame.player.getLeft() / tile_size);
                                              val = currentGame.map[bottom * currentGame.columns + left]
                                              collide(val, currentGame.player, left * tile_size, bottom * tile_size, tile_size)
                                              
                                              bottom = Math.floor(currentGame.player.getBottom() / tile_size);
                                              right = Math.floor(currentGame.player.getRight() / tile_size);
                                              val = currentGame.map[bottom * currentGame.columns + right]     
                                              collide(val, currentGame.player, right * tile_size, bottom * tile_size, tile_size)
                                              
                                             

                                              
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


                                              currentGame.player.x = Math.round(currentGame.player.x)



                                               //////////////
                                              ///VIEWPORT///
                                             //////////////
                                             if(map_edit_mode == false){
                                              viewport.scrollTo(currentGame.player.x,  currentGame.player.y )
                                             }



                                           if(viewport.x > currentGame.canvas_width - viewport.w){viewport.x = currentGame.canvas_width - viewport.w};
                                           if(viewport.x < 0){viewport.x = 0};

                                              var x_min = Math.floor(viewport.x / tile_size);
                                              var y_min = Math.floor(viewport.y / tile_size);
                                              var x_max = Math.ceil((viewport.x + viewport.w) / tile_size);
                                              var y_max = Math.ceil((viewport.y + viewport.h) / tile_size);

                                              if(x_min < 0){x_min = 0;};
                                              if(x_max > width){x_min = width;};
                                              if(y_min < 0){y_min = 0;};
                                              if(y_max > height){y_min = height;};



                                                          ///////////////////
                                                         /// MAP DRAWING ///
                                                        ///////////////////

                                                        

                                          
                                         
                                                for(let x = x_max - 1; x >= x_min; --x){

                                                  for(let y =  y_max - 1; y >= y_min; --y){
                                            
                                                    
                                                    let val = currentGame.map[y * currentGame.columns + x];
                                            
                                                    let img =  imageRef(val, tile_sheet)
                                                    let tile_x = Math.floor(x * tile_size - viewport.x );
                                                    let tile_y = Math.floor(y * tile_size - viewport.y);
                                                    game_context.drawImage(img, tile_x, tile_y);
                                                  }

                                                }


                                   /*              if(currentGame.coins.length != 0){
                                                     placeCoins(currentGame.coins, viewport, game_context);

                                                     for(let i = currentGame.coins.length - 1; i >= 0; --i){

                                                       if( coinCollide(currentGame.coins[i], currentGame.player, viewport)){
                                                         currentGame.coins.splice( i, 1);
                                                         coin_count += 1;
                                                       }

                                                     }  
                                                 }



                                      */

                                     if(coin_list.length != 0){
                                      placeCoins(coin_list, viewport, game_context);

                                      for(let i = coin_list.length - 1; i >= 0; --i){

                                        if( coinCollide(coin_list[i], currentGame.player, viewport)){
                                          coin_list.splice( i, 1);
                                          coin_count += 1;
                                        }

                                      }  
                                  }
                                              //draw rectangle
                                              game_context.fillStyle= "#ff0000" 
                                              game_context.beginPath();
                                              game_context.rect(Math.round(currentGame.player.x - viewport.x), currentGame.player.y, currentGame.player.width, currentGame.player.height); ///change to player. height/width etc
                                              game_context.fill();


                                              if(tile_selector_on = true){
                                                game_context.beginPath();
                                                game_context.strokeStyle = 'rgba(' + [200, 200, 200, 0.5] + ')';
                                                game_context.lineWidth = "10";
                                                game_context.rect(tile_selector_x, tile_selector_y, tile_size, tile_size);
                                                game_context.stroke()
                                              }
                                              





                                              //calls upon itself
                                              if(game_paused == false){

                                                window.requestAnimationFrame(game_loop);

                                              }
                                             
                                            
                                           }
                                     
                     
                     
                     
                     
                                      
                                                         ///////////////////////////
                                                        //END OF GAME ENGINE LOOP///
                                                       ////////////////////////////


 
                      
  player_editor_context = document.querySelector("#pe_canvas").getContext("2d");
                                
  player_editor_context.canvas.height = 180;
  player_editor_context.canvas.width = 320;


 
                                    ///////////////////////////////
                                   ///PLAYER EDITOR ENGINE LOOP///
                                  ///////////////////////////////                                                                                                              
 
                       player_editor_loop = function(){


                        document.addEventListener('keydown', function(event){
                          if (game_paused == false || player_editor_paused == false){
                            switch(event.key){
                              case "ArrowLeft":
                                event.preventDefault();
                              break;
                              case "ArrowUp":
                                event.preventDefault();
                              break;
                              case "ArrowRight":
                                event.preventDefault();
                              break;
                              case "ArrowDown":
                                event.preventDefault();
                              break;
                            }
                            
                            }
                          });


                        if(controller.up && currentGame.player.jumping == false) { 
                          currentGame.player.y_velocity -= currentGame.player.jumping_height; 
                          currentGame.player.jumping = true;
                        }
                      
                        if(controller.left){
                          currentGame.player.x_velocity -= currentGame.player.speed; 
                       
                        }
                      
                        if(controller.right){
                          currentGame.player.x_velocity += currentGame.player.speed; 
                      
                        }
                        if(controller.down && currentGame.player.jumping == true){
                         currentGame.player.y_velocity += currentGame.player.speed
                        }
                         
                                           //////////////////
                                          ///GAME PHYSICS///
                                         //////////////////

                       currentGame.player.y_velocity += currentGame.gravity;
                       currentGame.player.edit_x += currentGame.player.x_velocity;
                      

                       currentGame.player.edit_y += currentGame.player.y_velocity;
                       currentGame.player.x_velocity *= currentGame.friction; 
                       currentGame.player.y_velocity *= currentGame.friction; 
                      
                       currentGame.player.x = Math.round(currentGame.player.edit_x);//experiment
                       
                      
                             /////////////////////////////////////////////
                            ///BASIC COLLISION DETECTION FOR THE FLOOR///
                           /////////////////////////////////////////////
                      
                      
                        //if rectangle is below the floor line
                        if (currentGame.player.edit_y > 180 - 16 - currentGame.player.height){    /// replace :::>>>  1tile_size w/ game.canvas.height, 16 w/ height of floor from bottom of canvas, 32 w/ player.height
                          currentGame.player.jumping = false;
                          currentGame.player.edit_y = 180 - 16 - currentGame.player.height;
                          currentGame.player.y_velocity = 0;
                        }
                      
                         ///////////////////                          \\\\\\\\\\\\\\\\\
                        ///side screen CD//                            \\PACMAN STYLE\\\
                       ///////////////////                              \\\\\\\\\\\\\\\\\
                      
                      
                     //    __________________|      |____________________________________________
                     //       ,--.    ,--.          ,--.   ,--.
                     //      |oo  | _  \  `.       | oo | |  oo|
                     //  o  o|~~  |(_) /   ;       | ~~ | |  ~~|o  o  o  o  o  o  o  o  o  o  o
                     //      |/\/\|   '._,'        |/\/\| |/\/\|
                     //    __________________        ____________________________________________
                     //                      |      |
                      
                      
                        if(currentGame.player.edit_x < - currentGame.player.width) { //32 is player.width
                          currentGame.player.edit_x = 320; //other side of canvas
                        } else if (currentGame.player.edit_x > 320) { // canvas width
                          currentGame.player.edit_x = -currentGame.player.width; //other side of canvas
                        }
                      

                        let testImg = document.createElement('img')
                        testImg.src = './public/images/grey_checkered_4px.png';
                        player_editor_context.drawImage(testImg, 0, 0);

                      
                        //draw rectangle
                        player_editor_context.fillStyle= "#ff0000" 
                        player_editor_context.beginPath();
                        player_editor_context.rect(currentGame.player.edit_x, currentGame.player.edit_y, currentGame.player.width, currentGame.player.height); ///change to player. height/width etc
                        player_editor_context.fill();
                      
                        //draws the floor
                        player_editor_context.strokeStyle = '#202830';
                        player_editor_context.lineWidth = 4;
                        player_editor_context.beginPath();
                        player_editor_context.moveTo(0, 164);
                        player_editor_context.lineTo(320, 164);
                        player_editor_context.stroke();

                         //calls upon itself
                         if(player_editor_paused == false){
                         window.requestAnimationFrame(player_editor_loop);
                         }

                        
                       
                      }
                




                 
                        //////////////////////////////////////
                       ///END OF PLAYER EDITOR ENGINE LOOP///
                      //////////////////////////////////////
                             

 

  


  //baddies editor
  
  newBadButton.addEventListener("click", () => addBaddy());

  //widen map

  addEarthButton.addEventListener("click", () => addEarth());

  //shorten map
  minusEarthButton.addEventListener("click", () => minusEarth());

  //tile editor

  tileButton.addEventListener("click", function() {
  //  game_paused = true;
    player_editor_paused = true;
    mapEdit();
  });



  //tile editor

  runTileEditor();

  //scrollers

  var scrollLeftBtn = document.getElementById("scroll-left");
  var scrollRightBtn = document.getElementById("scroll-right");

  //coin editor
add_coin_btn.addEventListener("click", function(){
  player_editor_paused = true;
 
  coinAdder();
})

remove_coin_btn.addEventListener("click", function(){
  coinRemover();
})
  

  scrollLeftBtn.onmousedown = function () { map_edit_mode = true; scrollLeft(viewport)};
  scrollRightBtn.onmousedown = function () { map_edit_mode = true; scrollRight(viewport)};






              //////////////////////////////////
             ///RUNNING PLAYER EDITOR ENGINE///
            //////////////////////////////////
  
  let player_editor_button = document.getElementById('player_editor_button')

  let player_editor_paused = false;

  window.requestAnimationFrame(player_editor_loop);

  player_editor_button.addEventListener("click",function(){

      player_editor_paused = !player_editor_paused;
      game_paused = true;
    
      window.requestAnimationFrame(player_editor_loop);  
    
  });

                 /////////////////////////
                ///RUNNING GAME ENGINE///
               /////////////////////////

  let game_play_button = document.getElementById('game-play-button');

  let game_paused = true;
  

  game_play_button.addEventListener("click", function(){
    game_paused = !game_paused;
    if(map_edit_mode == true){
      game_paused = true;
    }
    map_edit_mode = false;
    clearMapEdit()





    player_editor_paused = true;
let img_1 = new Image();
img_1.src = "./public/images/crate_1.png";
    img_1.addEventListener('load', function(){
      let img_2 =new Image();
      img_2.src = "./public/images/earth_1.png";

      img_2.addEventListener('load', function(){

         window.requestAnimationFrame(game_loop);  
      })
    })
    
    
  })

  game_play_button.click()
  

  //move next two lines to bottom for cleanliness, "cleanliness is next to jimi hendrixliness"
  window.addEventListener("keydown", controller.keyListener)
  window.addEventListener("keyup", controller.keyListener)

});



