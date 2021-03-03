


function newGame(){


let gameData = {
  name: document.getElementById('game_name').value,
  player: {
    name: document.getElementById('player_name').value
  }
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
.then(obj => console.log(obj))
.catch(function(error){
    alert ("holy shmokes");
   addP(error.message);
   
})

document.getElementById('game_name').value = "";
document.getElementById('player_name').value ="";
}

document.getElementById('game_save_button').addEventListener("click", function(){
  newGame();
});