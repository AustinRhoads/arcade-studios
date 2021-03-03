


function newGame(){


let gameData = {
  name: document.getElementById('new_game_name').value
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

document.getElementById('new_game_name').value = "";
}

document.getElementById('new_game_button').addEventListener("click", function(){
  newGame();
});