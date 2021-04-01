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
var map_edit_mode = false;
var tile_selector_x;
var tile_selector_y;
var tile_selector_on = false;
var coin_count = 0;
var coin_counter = document.getElementById('coin-counter');
var add_coin_btn = document.getElementById('add-coin-button');
var remove_coin_btn =  document.getElementById('remove-coin-button');
var coin_list = [];
var dead_baddies_count = 0;
var current_x = document.getElementById('current-x');
var current_y = document.getElementById('current-y');






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

//let old_baddy_remove_btns = document.getElementsByClassName("removeBaddyButton");

  if (obj.name){
    document.getElementById('game_name').value = obj.name;
  } else if (!obj.name){
    document.getElementById('game_name').value = "";
  }
  document.getElementById('game_world_gravity').value = obj.gravity;
  document.getElementById('game_world_friction').value = obj.friction;
  if (obj.player.name){
    document.getElementById('player_name').value = obj.player.name;
  } else if(!obj.player.name){
    document.getElementById('player_name').value = "";
  }
  document.getElementById('player_speed').value = obj.player.speed;
  document.getElementById('player_jumping_height').value = obj.player.jumping_height;

  if(obj.baddies){
 
    for(let x = obj.baddies.length - 1; x >= 0; --x){


    //  newBadButton.click();
      addBaddy(obj.baddies[x])
      
      let allBaddies = document.getElementsByClassName('baddy');

/*
      allBaddies[allBaddies.length -1].querySelector('input[name="baddy_name"]').value = obj.baddies[x].name;
      allBaddies[allBaddies.length -1].querySelector('input[name="baddy_speed"]').value = obj.baddies[x].speed;
      allBaddies[allBaddies.length -1].querySelector('input[name="baddy_d"]').value = obj.baddies[x].d;
      allBaddies[allBaddies.length -1].querySelector('input[name="baddy_range"]').value = obj.baddies[x].range;
      allBaddies[allBaddies.length -1].querySelector('input[name="baddy_x_respawn"]').value = obj.baddies[x].x_respawn;
      allBaddies[allBaddies.length -1].querySelector('input[name="baddy_y_respawn"]').value = obj.baddies[x].y_respawn;
      */

   let type_options = allBaddies[allBaddies.length -1].getElementsByTagName('option');

      for(let t = type_options.length - 1; t >= 0; --t){
        if(type_options[t].value == obj.baddies[x].type_of_baddy){ type_options[t].selected = true;}
      }
   
      allBaddies[allBaddies.length -1].querySelector('input[name="baddy_id"]').value = obj.baddies[x].id;
  }
 }
}



///baddies editor

var newBadButton = document.getElementById('add-baddy');

function default_baddy(){
  let new_baddy = new Baddy("", 80, 80, 2, 1);
  new_baddy.d = 0.5;
  new_baddy.range = 10;
  new_baddy.set_image_and_behavior(new TileSheet())
  currentGame.baddies.push(new_baddy)
  reset_alive_baddies()
  new_baddy.respawn();
  return new_baddy;
}

function addBaddy(new_baddy){
//name, height, width, speed, type_of_baddy

  new_baddy ||= default_baddy()

  let editor = document.getElementById('baddies-box');

  let div = document.createElement('div');
  div.classList.add("baddy");

  let removeBaddyButton = document.createElement('button');
  removeBaddyButton.classList.add("removeBaddyButton");
  removeBaddyButton.textContent = "remove";
  removeBaddyButton.addEventListener("click", function(){
    removeMe(this);
    let index = currentGame.baddies.indexOf(new_baddy)
    console.log(index);
    currentGame.baddies.splice(index, 1);
    reset_alive_baddies()
   // currentGame.alive_baddies = currentGame.baddies.slice()

   // currentGame.baddies.remove(this);
  });

  let nameInput = document.createElement('input')
  nameInput.style = "margin: 10px;";
  nameInput.type = "text";
  nameInput.name = "baddy_name";
  nameInput.placeholder = "--Name of baddy--";
  nameInput.value = new_baddy.name;

  let br = document.createElement('br');
  let br2 = document.createElement('br');
  let br3 = document.createElement('br');
  let br4 = document.createElement('br');
  let br5 = document.createElement('br');
  let br6 = document.createElement('br');

  let x_respawnLabel = document.createElement('label');
  x_respawnLabel.for = "baddy_x_respawn";
  x_respawnLabel.textContent = "Baddy's respawn X postion: ";

  let x_respawnInput = document.createElement("input");
  x_respawnInput.style = "margin: 10px;";
  x_respawnInput.type = "number";
  x_respawnInput.name = "baddy_x_respawn";
  x_respawnInput.min = "0";
  x_respawnInput.max = currentGame.canvas_width;
  x_respawnInput.step = "1";
  x_respawnInput.value = new_baddy.x_respawn;
  x_respawnInput.addEventListener("change", function(){
    new_baddy.x_respawn = parseInt(this.value);
    new_baddy.x = parseInt(this.value);
  })

  let y_respawnLabel = document.createElement('label');
  y_respawnLabel.for = "baddy_y_respawn";
  y_respawnLabel.textContent = "Baddy's respawn Y postion: ";

  let y_respawnInput = document.createElement("input");
  y_respawnInput.style = "margin: 10px;";
  y_respawnInput.type = "number";
  y_respawnInput.name = "baddy_y_respawn";
  y_respawnInput.addEventListener("change", function(){
    new_baddy.y_respawn = parseInt(this.value);
  })
  y_respawnInput.min = "0";
  y_respawnInput.max = currentGame.canvas_height;
  y_respawnInput.step = "1";
  y_respawnInput.value = new_baddy.y_respawn;

  let respawn_button = document.createElement('button');
  respawn_button.textContent = "Respawn"
  respawn_button.addEventListener("click", function(){
    reset_alive_baddies()
   // currentGame.alive_baddies = currentGame.baddies.slice();
    new_baddy.respawn();
  })


  let speedLabel = document.createElement('label');
  speedLabel.for = "baddy_speed";
  speedLabel.textContent = "Baddy's Running speed (0.5-2):";


 

  let speedInput = document.createElement("input");
  speedInput.style = "margin: 10px;";
  speedInput.type = "number";
  speedInput.name = "baddy_speed";
  speedInput.min = "1";
  speedInput.max = "70";
  speedInput.step = "1";
  speedInput.value = new_baddy.speed;
  speedInput.addEventListener("change", function(){
   
    new_baddy.speed = parseInt(this.value);
    
    
  })

  let dLabel = document.createElement('label');
  dLabel.for = "baddy_d";
  dLabel.textContent = "Baddy's Running distance (0.5-2):";

  let dInput = document.createElement("input");
  dInput.style = "margin: 10px;";
  dInput.type = "number";
  dInput.name = "baddy_d";
  dInput.min = "0.1";
  dInput.max = "2";
  dInput.step = "0.1";
  dInput.value = new_baddy.d;

  let rangeLabel = document.createElement('label');
  rangeLabel.for = "baddy_range";
  rangeLabel.textContent = "Baddy's Range of Movement:";

  let rangeInput = document.createElement("input");
  rangeInput.style = "margin: 10px;";
  rangeInput.type = "number";
  rangeInput.name = "baddy_range";
  rangeInput.min = "1";
  rangeInput.max = currentGame.canvas_width;
  rangeInput.step = "1";
  rangeInput.value = new_baddy.range;

  rangeInput.addEventListener("change", function(){
    
    new_baddy.range = parseInt(this.value);
  })

  let type_of_baddyLabel = document.createElement('label');
  type_of_baddyLabel.for = "baddy_type_of_baddy";
  type_of_baddyLabel.textContent = "Type of Baddy";

  let type_of_baddyInput = document.createElement("SELECT");
  type_of_baddyInput.name = "baddy_type_of_baddy";
  type_of_baddyInput.style = "margin: 10px;";
  type_of_baddyInput.type = "number";
type_of_baddyInput.addEventListener("click", function(){
  let init_id = this.parentElement.querySelector('input[name="baddy_id').value;
  console.log()
  if(init_id){
    let bad_boy = currentGame.baddies.find(bad => bad.id == init_id);
    bad_boy.type_of_baddy = this.value;
    bad_boy.set_image_and_behavior(new TileSheet());
    bad_boy.mode = "waiting";
    reset_alive_baddies()
    spawn_baddy(bad_boy)
  }else{
   
    new_baddy.type_of_baddy = this.value;
    
    new_baddy.set_image_and_behavior(new TileSheet());
    new_baddy.mode = "waiting"
    new_baddy.respawn();
    
  }

})
let block_head_option = document.createElement('option');
block_head_option.value = 1;
block_head_option.innerHTML = "Block Head";

let back_and_forth_option = document.createElement('option');
back_and_forth_option.value = 2;
back_and_forth_option.innerHTML = "Back and forth";

let follower_option = document.createElement('option');
follower_option.value = 3;
follower_option.innerHTML = "Follower";

let spikes_option = document.createElement('option');
spikes_option.value = 4;
spikes_option.innerHTML = "Spikes";

let jumper_option = document.createElement('option');
jumper_option.value = 5;
jumper_option.innerHTML = "Jumper";


type_of_baddyInput.appendChild(block_head_option);  
type_of_baddyInput.appendChild(back_and_forth_option);
type_of_baddyInput.appendChild(follower_option);
type_of_baddyInput.appendChild(spikes_option);
type_of_baddyInput.appendChild(jumper_option);






  let idInput =  document.createElement("input");
  idInput.type = "hidden";
  idInput.name = "baddy_id"
 // idInput.style.visibility = false;

  
  div.appendChild(nameInput);
  div.appendChild(removeBaddyButton);
  div.appendChild(br);
  div.appendChild(x_respawnLabel);
  div.appendChild(x_respawnInput);
  div.appendChild(y_respawnLabel);
  div.appendChild(y_respawnInput);
  div.appendChild(respawn_button);
  div.appendChild(br4);
  div.appendChild(speedLabel);
  div.appendChild(speedInput);
  div.appendChild(dLabel);
  div.appendChild(dInput);
  div.appendChild(rangeLabel);
  div.appendChild(rangeInput);
  div.appendChild(br3);
  div.appendChild(type_of_baddyLabel);
  div.appendChild(type_of_baddyInput);
  div.appendChild(idInput);
  editor.appendChild(div)
  editor.appendChild(br2);

}


function removeMe(el){
  let baddyEl = el.parentElement;
  baddyEl.parentElement.removeChild(baddyEl);
}

function reset_alive_baddies(){
  currentGame.alive_baddies = currentGame.baddies.slice()
}



                /////////////////////////////////
               ///REAL TIME PARAMETER CHANGES///
              /////////////////////////////////




//real time parameter changes
let p_speed = document.getElementById('player_speed');

p_speed.addEventListener("change", function() {
  currentGame.player.speed = parseFloat(p_speed.value);
})



let p_jumping_height = document.getElementById('player_jumping_height');

p_jumping_height.addEventListener("change", function() {
  currentGame.player.jumping_height = p_jumping_height.value;
})

let game_gravity = document.getElementById('game_world_gravity');

game_gravity.addEventListener("change", function() {
  currentGame.gravity = parseFloat(game_gravity.value);
})

let game_friction = document.getElementById('game_world_friction');

game_friction.addEventListener("change", function() {
  currentGame.friction = parseFloat(game_friction.value);
})

//function updateBaddySpeed(num){
// // console.log("real time update functions for baddy later")
// 
//}










  
                   ////////////// 
                  ///NEW GAME///
                 //////////////


document.getElementById('reset_game_button').addEventListener("click", function(){
  currentGame = defaultSettings();
  resetGame(currentGame);
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

 /* let allBaddies = document.getElementsByClassName('baddy');

  for(let x = 0; x < allBaddies.length; x++){
    console.log(allBaddies[x].querySelector('select[name="baddy_type_of_baddy"]').value)
    gameData.baddies.push({
      id: allBaddies[x].querySelector('input[name="baddy_id"]').value,
      name: allBaddies[x].querySelector('input[name="baddy_name"]').value,
      speed: allBaddies[x].querySelector('input[name="baddy_speed"]').value,
   //   id: allBaddies[x].querySelector('input[name="baddy_id"]').value,.id,
      d: allBaddies[x].querySelector('input[name="baddy_d"]').value,
      range: allBaddies[x].querySelector('input[name="baddy_range"]').value,
      x_respawn: allBaddies[x].querySelector('input[name="baddy_x_respawn"]').value,
      y_respawn: allBaddies[x].querySelector('input[name="baddy_y_respawn"]').value,
   
     type_of_baddy: allBaddies[x].querySelector('select[name="baddy_type_of_baddy"]').value

     });
    
  }
  */

  gameData.baddies = currentGame.baddies;

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
    gameData.baddies.forEach(function(el){
      let new_b = new Baddy(el.name, el.height, el.width, el.speed, el.type_of_baddy);
      new_b.id = el.id;
      new_b.d = el.d;
      new_b.range = el.range;
      new_b.x_respawn = el.x_respawn;
      new_b.y_respawn = el.y_respawn;
    //  new_b.type_of_baddy = el.type_of_baddy;
      loadedGame.baddies.push(new_b)
    })

    for(let i = loadedGame.baddies.length -1; i >= 0; --i){
      loadedGame.baddies[i].set_image_and_behavior(tile_sheet);
     }
     

    


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
  defaultGame.baddies = []
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
   set_game_canvas()
   
   if(currentGame.baddies){
    reset_alive_baddies()
  //  currentGame.alive_baddies = currentGame.baddies.slice();
     spawn_all_baddies(currentGame.alive_baddies)}

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
  
  map_edit_mode = !map_edit_mode;

  if(map_edit_mode == true){

    clearMapEdit("tiles");

    tile_selector.click();    

    tile_selector.addEventListener("click", () => setCursor());

    setCursor();
      
    mapSelectEdit(e);


  }else{
    clearMapEdit();
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
  if(coin_edit_mode == true){
    clearMapEdit("coins")

    tile_selector_on = true;
    setCursor();
    mapSelectEdit(e);

  } else {
    clearMapEdit()
  }
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

  tile_selector_x = ((column - Math.round(viewport.x / tile_size)) * tile_size) - viewport.x % tile_size
  tile_selector_y = Math.floor((e.offsetY + (tile_size * 0.5)) / tile_size) * tile_size;

  if(e.offsetX >= tile_selector_x + (tile_size * 0.5)){
    tile_selector_x += tile_size
  }


  if(tile_selector_x <= 0){tile_selector_x = 0 - (viewport.x % tile_size)};
  if(tile_selector_y <= 0){tile_selector_y = 0};

  

  var coor = "column: " + column + ", row: " + row  + "  vp.x: " + viewport.x % tile_size;
  var ts_coor = "tile_selector_x: " +  tile_selector_x + "   tile_selector_y: " +  tile_selector_y;
  var testing_coor = "mouse: " + e.offsetX + "  selector: " +  tile_selector_x 


  xy.innerHTML = testing_coor;

  borderDiv.onclick = () => placeTile(currentGame, column, row);
  }

}

function placeTile(game, column, row){
  if(map_edit_mode == true){
     let tileType = document.getElementById('tile-type');
     let val = parseInt(tileType.value);
     let index = row * game.columns + column;
  
     currentGame.map[index] = val;
  }else if(coin_edit_mode == true){
      game.coins.push(new Coin(column, row));
      coin_list = game.coins.slice()
      coin_count = 0;
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
  





  
 window.addEventListener('DOMContentLoaded',  () => {

 

  
  resetGame();
  

  controller = new Controller();
  tile_sheet = new TileSheet();
  viewport = new Viewport(0, 0, 900, 500);

  set_game_canvas()



  
                                              //////////////////////
                                             ///GAME ENGINE LOOP///
                                            //////////////////////                                                                                                              
 
                                            game_loop = function(){

                                              current_x.textContent = "X: " + Math.round(currentGame.player.x);
                                              current_y.textContent = "Y: " + Math.round(currentGame.player.y);
                                              
                                              coin_counter.innerHTML = "COINS: " + coin_count;

                                              var height = document.documentElement.clientHeight;
                                              var width = document.documentElement.clientWidth;

                                            setOld(currentGame);
                                              
                                                          
                                                          
                                                          

                                                               
                                                               
                                //////////////////             /////////////////////////
                               ///GAME PHYSICS///  ///AND///  ///COLLISION DETECTION///
                              //////////////////             /////////////////////////

                              if(currentGame.alive_baddies){
                                for(let b = currentGame.alive_baddies.length - 1; b >= 0; --b){
                                  currentGame.alive_baddies[b].behave();
                                //  baddies_collision_detection(currentGame, currentGame.player, currentGame.alive_baddies[b]);
                                }
                              }

                              if(currentGame.alive_baddies){
                                for(let b = currentGame.alive_baddies.length - 1; b >= 0; --b){

                                  if(currentGame.alive_baddies[b].x <= 0){
                                    currentGame.alive_baddies[b].x = 1;
                                  } else if(currentGame.alive_baddies[b].x >= currentGame.canvas_width - currentGame.alive_baddies[b].width){
                                    currentGame.alive_baddies[b].x = currentGame.canvas_width - currentGame.alive_baddies[b].width - 1 ;  
                                  }

                                  collision_detection(currentGame, currentGame.alive_baddies[b]); 
                                  currentGame.alive_baddies[b].x = Math.round(currentGame.alive_baddies[b].x)

                                }
                              }
                                         
                                            velocity_controll(currentGame);
                                            collision_detection(currentGame, currentGame.player); 

                                            if(currentGame.alive_baddies){
                                              for(let b = currentGame.alive_baddies.length - 1; b >= 0; --b){
                                                
                                              }
                                            }
                                          
                                        //    baddies_collision_detection( currentGame.player, currentGame.alive_baddies)

                                          


                                            currentGame.player.x = Math.round(currentGame.player.x)
                                            
                                              


                                               //////////////
                                              ///VIEWPORT///
                                             //////////////


                                             //fill background with dark grey #202020
                                             game_context.fillStyle = '#1696ab' ; //teal background
                                             game_context.fillRect(0, 0, viewport.w, viewport.h); //fill in the size of the game.canvas_width/height


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



                                     if(coin_list.length != 0){
                                      placeCoins(coin_list, viewport, game_context);

                                      for(let i = coin_list.length - 1; i >= 0; --i){

                                        if( coinCollide(coin_list[i], currentGame.player, viewport)){
                                          coin_list.splice( i, 1);
                                          coin_count += 1;
                                        }

                                      }  
                                  }


                                  if(currentGame.alive_baddies){draw_all_baddies(currentGame.alive_baddies, game_context, viewport)}
                                  


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
                                     
                     
                     
                     
                     
                                      
                                                         ////////////////////////////
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

  //game_paused = true;
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



