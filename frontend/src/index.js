


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



   //////////////////////
  ///CONTROLLER LOGIC///
 //////////////////////


 controller = {
   left: false,
   right: false,
   up: false,

  keyListener: function(event) {
    var key_state = (event.type == "keydown")? true:false;
    switch(event.keyCode){
      case 37: //left
        controller.left = key_state;
        console.log("left" + `${key_state}`);
      break;
      case 38: //up
        controller.up = key_state;
        console.log("up" + `${key_state}`);
      break;
      case 39: //right
        controller.right = key_state;
        console.log("right" + `${key_state}`);
      break;
    }
  }

 }



 //move next two lines to bottom for cleanliness, "cleanliness is next to jimi hendrixliness"
 window.addEventListener("keydown", controller.keyListener)
 window.addEventListener("keyup", controller.keyListener)




  //////////////////////
 ///GAME ENGINE LOOP///
//////////////////////
 
