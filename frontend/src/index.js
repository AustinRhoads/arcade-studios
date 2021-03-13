////////// SOME IMPORTANT VARIABLES /////////////////

const BASE_URL = "http://localhost:3000";
const GAMES_URL = BASE_URL + "/games";
var currentGame;
var editorToolBox = document.getElementById("editor-toolbox");






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

    let loadedGame = new Game(name, gravity, friction, canvas_width, canvas_height );
    loadedGame.id = id;


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
  defaultGame.player = new Player(...Array(1), 32, 32, 0.5, 20);  
  return defaultGame;
  

}

                 //////////////////
                /// RESET GAME ///
               //////////////////

function resetGame(gameObj){
   populate_load_list();
   gameObj ||= defaultSettings();
   currentGame = gameObj;
   currentGame.player.x = currentGame.player.x_respawn;//add currentGame.x_respawn 
   currentGame.player.y = currentGame.player.y_respawn;//add currentGame.y_respawn
   currentGame.player.edit_x = 144;
   currentGame.player.edit_y = 0; 
   currentGame.player.jumping = true;
   populate_editor(gameObj);
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

  document.addEventListener('keydown', function(event){
    if (game_paused == false || player_editor_paused == false){
      switch(event.keyCode){
        case 37:
          event.preventDefault();
        break;
        case 38:
          event.preventDefault();
        break;
        case 39:
          event.preventDefault();
        break;
        case 40:
          event.preventDefault();
        break;
      }
      
      }
    });
  

  

  game_canvas = document.querySelector("#game-canvas");
  game_canvas.height = currentGame.canvas_height;
  game_canvas.width = currentGame.canvas_width;

 game_context = document.querySelector("#game-canvas").getContext("2d");
   
 game_context.canvas.height = currentGame.canvas_height;
 game_context.canvas.width = currentGame.canvas_width;


  
                                              //////////////////////
                                             ///GAME ENGINE LOOP///
                                            //////////////////////                                                                                                              
 
                                            game_loop = function(){
                                              

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
                                            
                                            
                                                   /////////////////////////////////////////////
                                                  ///BASIC COLLISION DETECTION FOR THE FLOOR///
                                                 /////////////////////////////////////////////
                                            
                                            
                                              //if rectangle is below the floor line
                                              if (currentGame.player.y > currentGame.canvas_height - 80 - currentGame.player.height){    /// replace :::>>>  180 w/ game.canvas.height, 16 w/ height of floor from bottom of canvas, 32 w/ player.height /// floor
                                                currentGame.player.jumping = false;
                                                currentGame.player.y = currentGame.canvas_height - 80 - currentGame.player.height;   ///replace 16 with game.canvas_floor
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
                                            
                                            
                                          /*    if(currentGame.player.x < - currentGame.player.width) { //32 is player.width
                                                currentGame.player.x = currentGame.canvas_width; //other side of canvas
                                              } else if (currentGame.player.x > currentGame.canvas_width) { // canvas width
                                                currentGame.player.x = -currentGame.player.width; //other side of canvas
                                              }
                                              */

                                              if(currentGame.player.x <= 0){
                                                currentGame.player.x = 0;
                                              } else if(currentGame.player.x >= currentGame.canvas_width - currentGame.player.width){
                                                currentGame.player.x = currentGame.canvas_width - currentGame.player.width ;
                                                
                                              }
                                            
                                              //fill background with dark grey
                                              game_context.fillStyle = '#1696ab'; //teal background
                                              game_context.fillRect(0, 0, game_canvas.width, game_canvas.height); //fill in the size of the game.canvas_width/height
                                            //  let testImg = document.createElement('img')
                                            //  testImg.src = './public/images/grey_checkered_4px.png';
                                            //  game_context.drawImage(testImg, 0, 0);
                                              let tile_sheet = new TileSheet();
                                              let map = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                                                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                                                0, 0, 0, 0, 3, 3, 3, 3, 0, 0, 0, 0,
                                                0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0,
                                                0, 0, 3, 0, 3, 0, 3, 0, 3, 2, 3, 0,
                                                0, 0, 0, 2, 0, 2, 0, 0, 0, 2, 0, 0,
                                                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1
                                               ]

                                               function drawMap(map, tile_sheet) {
                                                for(let x = 0; x < map.length; x++){
                                                    let img =  imageRef(map[x], tile_sheet)
                                                    let dest_y = Math.floor((x / 12) * 80);
                                                    
                                                    let dest_x = ((x % 12) * 80) ; 

                                                    dest_y = dest_y - ((dest_x / 80) * 6.6666666667)
                                                    game_context.drawImage(img, dest_x, dest_y);
                                                }
                                            }

                                               drawMap(map, tile_sheet);
                                              //let crate = tile_sheet.crate;
                                              //game_context.drawImage(crate, 80, 480);

                                              
                                              //let earth = tile_sheet.earth;
                                              //game_context.drawImage(earth, 0, 480);

                                              
                                              //let sky_island = tile_sheet.sky_island;
                                              //game_context.drawImage(sky_island,  160, 480);

                                            
                                              //draw rectangle
                                              game_context.fillStyle= "#ff0000" 
                                              game_context.beginPath();
                                              game_context.rect(currentGame.player.x, currentGame.player.y, currentGame.player.width, currentGame.player.height); ///change to player. height/width etc
                                              game_context.fill();
                                            
                                              //draws the floor
                                              game_context.strokeStyle = '#202830';
                                              game_context.lineWidth = 4;
                                              game_context.beginPath();
                                              game_context.moveTo(0, currentGame.canvas_height - 80);//floor
                                              game_context.lineTo(currentGame.canvas_width, currentGame.canvas_height - 80);//.floor
                                              game_context.stroke();
                                            
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
                        if (currentGame.player.edit_y > 180 - 16 - currentGame.player.height){    /// replace :::>>>  180 w/ game.canvas.height, 16 w/ height of floor from bottom of canvas, 32 w/ player.height
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
                      
                        //fill background with dark grey
                       // context.fillStyle = '#202020'; //dark grey background
                       // context.fillRect(0, 0, canvas.width, canvas.height); //fill in the size of the game.canvas_width/height
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


   

console.log(currentGame.player.x_respawn)      
console.log(currentGame.player.y_respawn)    
    currentGame.player.x = currentGame.player.x_respawn;
    currentGame.player.y = currentGame.player.y_respawn;


    player_editor_paused = true;
    
    window.requestAnimationFrame(game_loop);  
  })
  

  //move next two lines to bottom for cleanliness, "cleanliness is next to jimi hendrixliness"
  window.addEventListener("keydown", controller.keyListener)
  window.addEventListener("keyup", controller.keyListener)

});


//tile sheet
//basic tiles
///new variables
//game floor
//game respawn_x, respawn_y
//build a map editor
