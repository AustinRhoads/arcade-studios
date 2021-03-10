////////// SOME IMPORTANT VARIABLES /////////////////

const BASE_URL = "http://localhost:3000";
const GAMES_URL = BASE_URL + "/games";
var currentGame;






let game_load_list = document.querySelector('select#game-selector');


function populate_load_list(){

  //clear old list
  let oldList = game_load_list.querySelectorAll('option')
  oldList.forEach((el) => el.parentElement.removeChild(el));
 
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


function newGame(){

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


  let postGameObject = {
    method: "POST",
    headers:{
        "Content-Type":"application/json",
        "Accept":"application/json"
    },
    body: JSON.stringify(gameData)
  };

  let lefetch = fetch(GAMES_URL, postGameObject)
  .then(resp => resp.json())
  .then(function(obj){
     loadGame(obj.id)
     populate_load_list()
    })
  .catch(function(error){
      alert ("holy shmokes");


  })
  
}

///event listeners to save game

document.getElementById('new_game_button').addEventListener("click", function(){
  newGame();
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
  console.log(currentGame.id + "==null");

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


  let fetcher = fetch(GAMES_URL+`/${id}`)
    .then(resp => resp.json())
    .then(function(obj){
      console.log(obj)
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
    currentGame.player.x = 144;
    currentGame.player.y = 0;
    currentGame.player.jumping = true;

    //populating the editor form

    document.getElementById('game_name').value = name;
    document.getElementById('game_world_gravity').value = gravity;
    document.getElementById('game_world_friction').value = friction;
    document.getElementById('player_name').value = currentGame.player.name;
    document.getElementById('player_speed').value = currentGame.player.speed;
    document.getElementById('player_jumping_height').value = currentGame.player.jumping_height;

   
 
   
   
//    if(removeBaddyButtons){
//    removeBaddyButtons.forEach((el) => {
//      el.click();
//    });
//  };
//    
    for(let x =0; x < currentGame.baddies.length; x++){
      newBadButton.click();
      let allBaddies = document.getElementsByClassName('baddy');
      
      allBaddies[allBaddies.length -1].querySelector('input[name="baddy_name"]').value = currentGame.baddies[x].name;
      allBaddies[allBaddies.length -1].querySelector('input[name="baddy_speed"]').value = currentGame.baddies[x].speed;
    }
   })

}



function defaultSettings(){

  let defaultGame = new Game(...Array(1), 1.5, 0.9, 320, 180 );
  defaultGame.player = new Player(...Array(1), 32, 32, 0.5, 20);  
  return defaultGame;
  

}






    /////////////////////////
   //// SIMPLY GAME BUILD///
  /////////////////////////
  
  



   //////////////////////             ////////////////////////////   
  ///CONTROLLER LOGIC///             ///moved to controller.js/// 
 //////////////////////             ////////////////////////////   





  
 window.addEventListener('DOMContentLoaded',  () => {
  
  currentGame = defaultSettings();
   currentGame.player.x = 144;
   currentGame.player.y = 0;
   currentGame.player.jumping = true;
  

  controller = new Controller();
  



  canvas = document.querySelector("canvas");
                      
  context = document.querySelector("canvas").getContext("2d");
   
 context.canvas.height = currentGame.canvas_height;
 context.canvas.width = currentGame.canvas_width;




 
                                              //////////////////////
                                             ///GAME ENGINE LOOP///
                                            //////////////////////                                                                                                              
 
                       loop = function(){
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
                         if (currentGame.player.y > currentGame.canvas_height - 16 - currentGame.player.height){    /// replace :::>>>  180 w/ game.canvas.height, 16 w/ height of floor from bottom of canvas, 32 w/ player.height
                           currentGame.player.jumping = false;
                           currentGame.player.y = currentGame.canvas_height - 16 - currentGame.player.height;
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
                       
                       
                         if(currentGame.player.x < - currentGame.player.width) { //32 is player.width
                           currentGame.player.x = currentGame.canvas_width; //other side of canvas
                         } else if (currentGame.player.x > currentGame.canvas_width) { // canvas width
                           currentGame.player.x = -currentGame.player.width; //other side of canvas
                         }
                       
                         //fill background with dark grey
                        // context.fillStyle = '#202020'; //dark grey background
                        // context.fillRect(0, 0, canvas.width, canvas.height); //fill in the size of the game.canvas_width/height
                         let testImg = document.createElement('img')
                         testImg.src = './public/images/grey_checkered_4px.png';
                         context.drawImage(testImg, 0, 0);
                       
                         //draw rectangle
                         context.fillStyle= "#ff0000" 
                         context.beginPath();
                         context.rect(currentGame.player.x, currentGame.player.y, currentGame.player.width, currentGame.player.height); ///change to player. height/width etc
                         context.fill();
                       
                         //draws the floor
                         context.strokeStyle = '#202830';
                         context.lineWidth = 4;
                         context.beginPath();
                         context.moveTo(0, 164);
                         context.lineTo(320, 164);
                         context.stroke();
                       
                         //calls upon itself
                         window.requestAnimationFrame(loop);
                       
                      }
                




                 
                                    ///////////////////////////
                                   //END OF GAME ENGINE LOOP///
                                  ////////////////////////////
                             

 
  populate_load_list();
  let loadButton = document.getElementById("load_game");
  loadButton.addEventListener("click", function(){
   
  
    loadGame(document.getElementById('game-selector').value);
  })


  //baddies editor
  
  newBadButton.addEventListener("click", () => addBaddy());



  //window.requestAnimationFrame(loop);
  window.requestAnimationFrame(loop);
  //move next two lines to bottom for cleanliness, "cleanliness is next to jimi hendrixliness"
  window.addEventListener("keydown", controller.keyListener)
  window.addEventListener("keyup", controller.keyListener)

});


