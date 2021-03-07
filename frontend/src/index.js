////////// SOME IMPORTANT VARIABLES /////////////////

const BASE_URL = "http://localhost:3000/";
const GAMES_URL = BASE_URL + "/games";






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


  //<div class="baddy">
  //<input style="margin: 10px;" type="text" name="baddy_name" placeholder = "--Name of baddy--">
  //<br>
  //<label for="baddy_speed">Baddy's Running speed (0.5-2):</label>
  //<input style="margin: 10px;" type="number" name="baddy_speed" min="0.5" max="2" step="0.1">
  //</div>
  
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


let currentGame = {}

const gameDefaultSettings = {

}


    ///////////////
   ///LOAD GAME///
  ///////////////




function loadGame(id){


 let fetcher = fetch(GAMES_URL+`/${id}`)
 .then(resp => resp.json())
 .then(function(obj){
  console.log(obj);
 })




}








    /////////////////////////
   //// SIMPLY GAME BUILD///
  /////////////////////////
  
  var context, controller, rectangle, loop;

  

  context = document.querySelector("canvas").getContext("2d");

  context.canvas.height = 180; //replace with game.canvas_height attr
  context.canvas.width = 320; //replace with game.canvas_width attr

  rectangle = {
    height: 32,
    width: 32,
    jumping: true,
    x: 144, //center of canvas spawn placement
    y: 0,
    x_velocity: 0,
    y_velocity: 0
  };



   //////////////////////             ////////////////////////////   
  ///CONTROLLER LOGIC///             ///moved to controller.js/// 
 //////////////////////             ////////////////////////////   









  //////////////////////////  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///
 ///GAME ENGINE LOOP/////////  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  /// 
/////////////////////////// ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///   
                         ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///       





 loop = function(){

       if(controller.up && rectangle.jumping == false) { ////make sure to replace rectangel with player object
         rectangle.y_velocity -= 20; ///player.jumping_height
         rectangle.jumping = true;
       }
     
       if(controller.left){
         rectangle.x_velocity -= 0.5;   //replace with player.speed
       }
     
       if(controller.right){
         rectangle.x_velocity += 0.5;   //replace with player.speed
       }
        ////////////////////////\\\\\\\\\\\\\\\
       ///GMAE WORLD PHYSICS///\\\ WORLD \\\\\\\
      ////////////////////////\\\\\\\\\\\\\\\\\\\
     
      rectangle.y_velocity += 1.5;   //replace with game.gravity 1.5
      rectangle.x += rectangle.x_velocity
      rectangle.y += rectangle.y_velocity
      rectangle.x_velocity *= 0.9; //replace with game.friction
      rectangle.y_velocity *= 0.9; //replace with game.friction
     
     
            /////////////////////////////////////////////
           ///BASIC COLLISION DETECTION FOR THE FLOOR///
          /////////////////////////////////////////////
     
     
       //if rectangle is below the floor line
       if (rectangle.y > 180 - 16 - 32){    /// replace :::>>>  180 w/ game.canvas.height, 16 w/ height of floor from bottom of canvas, 32 w/ player.height
         rectangle.jumping = false;
         rectangle.y = 180 - 16 - 32;
         rectangle.y_velocity = 0;
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
     
     
       if(rectangle.x < - 32) { //32 is player.width
         rectangle.x = 320; //other side of canvas
       } else if (rectangle.x > 320) { // canvas width
         rectangle.x = -32; //other side of canvas
       }
     
       //fill background with dark grey
       context.fillStyle = '#202020'; //dark grey background
       context.fillRect(0, 0, 320, 180); //fill in the size of the game.canvas_width/height
     
       //draw rectangle
       context.fillStyle= "#ff0000" //hex code for red
       context.beginPath();
       context.rect(rectangle.x, rectangle.y, rectangle.width, rectangle.height); ///change to player. height/width etc
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

  ///////////////////////////////  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///                     
 ///END OF GAME ENGINE LOOP///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///                    
///////////////////////////////// ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///                   
                               ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///  ///      



 //wait until it all loads and then...

    ///////////////////////////
   ///START THE GAME ENGINE///
  ///////////////////////////
 //\       SIGHT OF        /
 // \  FUTURE ASCII ART   / 
//   \                   /
  //  \                 /  
  //   \    BOOM!      /


  
 window.addEventListener('DOMContentLoaded', () => {
  
  controller = new Controller();


  //game loader
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


