


function newGame(){


let gameData = {
  name: document.getElementById('game_name').value,
  player: {
    name: document.getElementById('player_name').value
  },
  baddies: [
    //all baddies get pushed here
  ]
  
}

let allBaddies = document.getElementsByClassName('baddy');
console.log(allBaddies);
console.log(allBaddies.length);

for(let x = 0; x < allBaddies.length; x++){
  gameData.baddies.push({name: allBaddies[x].querySelector('input[name="baddy_name"]').value});
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
  newGame();
});



function loadGameObject(obj){
  document.getElementById('game_name').value = obj.name;
  document.getElementById('player_name').value = obj.player.name;
  console.log(obj);
}