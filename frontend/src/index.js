////////// SOME IMPORTANT VARIABLES /////////////////

const BASE_URL = "http://localhost:3000/";
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
      opt.innerText = game.attributes.name;
      game_load_list.appendChild(opt);
    }



    // console.log(dataArray[0].attributes.name)



   });
   
   
}



///baddies editor

var newBadButton = document.getElementById('add-baddy');

function addBaddy(){

  let editor = document.getElementById('baddies-editor');

  let div = document.createElement('div');
  div.classList.add("baddy");

  let removeBaddyButton = document.createElement('button');
  removeBaddyButton.textContent = "remove";
  removeBaddyButton.addEventListener("click", function(){
    removeMe(this);
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
  console.log(baddyEl)
  baddyEl.parentElement.removeChild(baddyEl);
}

  
   /////////////// 
  ///SAVE GAME///
 ///////////////


function saveGame(){


  let gameData = {
    name: document.getElementById('game_name').value,
    gravity: document.getElementById('game_world_gravity').value,
    friction: document.getElementById('game_world_friction').value,
    player: {
      name: document.getElementById('player_name').value,
      speed: document.getElementById('player_speed').value,
      jumping_height: document.getElementById('player_jumping_height').value,
    },
    baddies: [
      //all baddies get pushed here
    ]

  }

  let allBaddies = document.getElementsByClassName('baddy');

  for(let x = 0; x < allBaddies.length; x++){
    gameData.baddies.push({
    name: allBaddies[x].querySelector('input[name="baddy_name"]').value,
    speed: allBaddies[x].querySelector('input[name="baddy_speed"]').value
  });
    //console.log(gameData.baddies)
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

document.getElementById('game_save_button').addEventListener("click", function(){
  saveGame();
});

window.addEventListener("keypress", function(e){
 if(e.key == "Enter"){
   saveGame()
 }
});






    ///////////////
   ///LOAD GAME///
  ///////////////




function loadGame(id){


  let fetcher = fetch(GAMES_URL+`/${id}`)
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
    console.log(currentGame);
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
  
  var context, controller, loop;

  

  

  //rectangle = {
  //  height: 32,
  //  width: 32,
  //  jumping: true,
  //  x: 144, //center of canvas spawn placement
  //  y: 0,
  //  x_velocity: 0,
  //  y_velocity: 0
  //};



   //////////////////////             ////////////////////////////   
  ///CONTROLLER LOGIC///             ///moved to controller.js/// 
 //////////////////////             ////////////////////////////   







   //////////////////////////
  ///GAME ENGINE WAS HERE///    
 //////////////////////////


 //wait until it all loads and then...

    ///////////////////////////
   ///START THE GAME ENGINE///
  ///////////////////////////
 //\       SIGHT OF        /
 // \  FUTURE ASCII ART   / 
//   \                   /
  //  \                 /  
  //   \    BOOM!      /


  
 window.addEventListener('DOMContentLoaded',  () => {
  
  currentGame = defaultSettings();
   currentGame.player.x = 144;
   currentGame.player.y = 0;
   currentGame.player.jumping = true;
  console.log(currentGame)

  controller = new Controller();
 // engine = new Engine();

   //////////////////////////  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///
 ///GAME ENGINE LOOP/////////  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  /// 
/////////////////////////// ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///   
                         ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///       



//function Engine(){
  var canvas = document.querySelector("canvas");
  canvas.style.width = currentGame.canvas_width;
  canvas.style.height = currentGame.canvas_height;
  var context = document.querySelector("canvas").getContext("2d");
    

  context.canvas.height = currentGame.canvas_height; //replace with game.canvas_height attr
  context.canvas.width = currentGame.canvas_width; //replace with game.canvas_width attr
  

                        loop = function(){

                          if(controller.up && currentGame.player.jumping == false) { ////make sure to replace rectangel with player object
                            currentGame.player.y_velocity -= currentGame.player.jumping_height; ///player.jumping_height
                            currentGame.player.jumping = true;
                          }
                        
                          if(controller.left){
                            currentGame.player.x_velocity -= currentGame.player.speed;   //replace with player.speed
                          }
                        
                          if(controller.right){
                            currentGame.player.x_velocity += currentGame.player.speed;   //replace with player.speed
                          }
                           ////////////////////////\\\\\\\\\\\\\\\
                          ///GMAE WORLD PHYSICS///\\\ WORLD \\\\\\\
                         ////////////////////////\\\\\\\\\\\\\\\\\\\
                        
                         currentGame.player.y_velocity += currentGame.gravity;   //replace with game.gravity 1.5
                         currentGame.player.x += currentGame.player.x_velocity
                         currentGame.player.y += currentGame.player.y_velocity
                         currentGame.player.x_velocity *= currentGame.friction; //replace with game.friction 0.9
                         currentGame.player.y_velocity *= currentGame.friction; //replace with game.friction 0.9
                        
                        
                               /////////////////////////////////////////////
                              ///BASIC COLLISION DETECTION FOR THE FLOOR///
                             /////////////////////////////////////////////
                        
                        
                          //if rectangle is below the floor line
                          if (currentGame.player.y > currentGame.canvas_height - 16 - currentGame.player.height){    /// replace :::>>>  180 w/ game.canvas.height, 16 w/ height of floor from bottom of canvas, 32 w/ player.height
                            currentGame.player.jumping = false;
                            currentGame.player.y = currentGame.canvas_height - 16 - currentGame.player.height;
                            currentGame.player.y_velocity = 0;
                          }
                        
                           ///////////////////\\\\\\\\\\\\\\\\\
                          ///side screen CD//  \\PACMAN STYLE\\\
                         ///////////////////    \\\\\\\\\\\\\\\\\
                        
                        
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
                          context.fillStyle = '#202020'; //dark grey background
                          context.fillRect(0, 0, canvas.width, canvas.height); //fill in the size of the game.canvas_width/height
                        
                          //draw rectangle
                          context.fillStyle= "#ff0000" //hex code for red
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
                  
//}



                   
                     ///////////////////////////////  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///                     
                    ///END OF GAME ENGINE LOOP///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///                    
                   ///////////////////////////////// ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///                   
                                                  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  

  
  populate_load_list();
  let loadButton = document.getElementById("load_game");
  loadButton.addEventListener("click", function(){
    loadGame(document.getElementById('game-selector').value);
  })


  //baddies editor
  
  newBadButton.addEventListener("click", () => addBaddy());



  window.requestAnimationFrame(loop);
  //move next two lines to bottom for cleanliness, "cleanliness is next to jimi hendrixliness"
  window.addEventListener("keydown", controller.keyListener)
  window.addEventListener("keyup", controller.keyListener)

});


