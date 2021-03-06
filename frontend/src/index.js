

let game_load_list = document.querySelector('select.game-selector');


function populate_load_list(){
   let records = fetch("http://localhost:3000/games")
   .then(resp => resp.json())
   .then( function(obj){
    return obj
   });

console.log(records)

}




function saveGame(){


let gameData = {
  name: document.getElementById('game_name').value,
  gravity: document.getElementById('game_gravity').value,
  friction: document.getElementById('game_friction').value,
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
console.log(allBaddies);
console.log(allBaddies.length);

for(let x = 0; x < allBaddies.length; x++){
  gameData.baddies.push({
  name: allBaddies[x].querySelector('input[name="baddy_name"]').value,
  speed: allBaddies[x].querySelector('input[name="baddy_speed"]').value
});
  console.log(gameData.baddies)
}


let postGameObject = {
  method: "POST",
  headers:{
      "Content-Type":"application/json",
      "Accept":"application/json"
  },
  body: JSON.stringify(gameData)
};

let lefetch = fetch("http://localhost:3000/games", postGameObject)
.then(resp => resp.json())
.then(obj => loadGameObject(obj))
.catch(function(error){
    alert ("holy shmokes");
  
   
})

//document.getElementById('game_name').value = "";
//document.getElementById('player_name').value ="";
}

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

function loadGameObject(obj){

  console.log(obj);
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

  populate_load_list();
  

  window.requestAnimationFrame(loop);
  //move next two lines to bottom for cleanliness, "cleanliness is next to jimi hendrixliness"
  window.addEventListener("keydown", controller.keyListener)
  window.addEventListener("keyup", controller.keyListener)
});


