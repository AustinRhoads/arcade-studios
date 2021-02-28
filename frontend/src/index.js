
//Game Token Demo





var context, controller, rectangle, loop;

context = document.querySelector("canvas").getContext("2d");
context.canvas.height = 180;
context.canvas.width = 320;


let defaultToken = {
    jumpingHeight: 25, //25 is good starting point
    speed: 0.8   //0.5 is avg, 1.2 is fast but good
}

let defaultEnvironment = {
    gravity: 1.1,  //1.5 is good starting point
    xFriction: 0.93,
    yFriction: 0.93    //friction at 0.9 for SP
}

rectangle = {

    height:32,
    jumping:true,
    width:32,
    x:144, // center of the canvas *** change to drop point
    x_velocity:0,
    y:0,
    y_velocity:0
  
  };
  
  controller = {
  
    left:false,
    right:false,
    up:false,
    keyListener:function(event) {
  
      var key_state = (event.type == "keydown")?true:false;
  
      switch(event.keyCode) {
  
        case 37:// left key
          controller.left = key_state;
        break;
        case 38:// up key
          controller.up = key_state;
        break;
        case 39:// right key
          controller.right = key_state;
        break;
  
      }
  
    }
  
  };
  
  loop = function() {
  
    if (controller.up && rectangle.jumping == false) {
  
      rectangle.y_velocity -= defaultToken.jumpingHeight; //jumping height
      rectangle.jumping = true;
  
    }
  
    if (controller.left) {
  
      rectangle.x_velocity -= defaultToken.speed;//speed 0.5
  
    }
  
    if (controller.right) {
  
      rectangle.x_velocity += defaultToken.speed;//speed 0.5
  
    }
  
    rectangle.y_velocity += defaultEnvironment.gravity;// gravity 1.5 SP
    rectangle.x += rectangle.x_velocity;
    rectangle.y += rectangle.y_velocity;
    rectangle.x_velocity *= defaultEnvironment.xFriction;// friction 0.9 SP
    rectangle.y_velocity *= defaultEnvironment.yFriction;// friction 0.9 SP
  
    // if rectangle is falling below floor line
    if (rectangle.y > 180 - 16 - 32) {
  
      rectangle.jumping = false;
      rectangle.y = 180 - 16 - 32;
      rectangle.y_velocity = 0;
  
    }
  
    // if rectangle is going off the left of the screen
    if (rectangle.x < -32) {
  
      rectangle.x = 320;
  
    } else if (rectangle.x > 320) {// if rectangle goes past right boundary
  
      rectangle.x = -32;
  
    }
  
    context.fillStyle = "#202020";
    context.fillRect(0, 0, 320, 180);// x, y, width, height
    context.fillStyle = "#ff0000";// hex for red
    context.beginPath();
    context.rect(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
    context.fill();
    context.strokeStyle = "#202830";
    context.lineWidth = 4;
    context.beginPath();
    context.moveTo(0, 164);
    context.lineTo(320, 164);
    context.stroke();
  
    // call update when the browser is ready to draw again
    window.requestAnimationFrame(loop);
  
  };
  
  window.addEventListener("keydown", controller.keyListener)
  window.addEventListener("keyup", controller.keyListener);
  window.requestAnimationFrame(loop);





////test me


  /////front end functions
  function User(name) {
      return{
          name
      }
  }

  function Player(name, speed, jump_height){
      return {
          name,
          speed,
          jump_height
      }
  }

  