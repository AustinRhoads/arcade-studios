
//Game Token Demo





//var context, controller, defaultToken.rectangle, loop;
var context, controller, loop;

context = document.querySelector("canvas").getContext("2d");
context.canvas.height = 180;
context.canvas.width = 320;





  
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
  
    if (controller.up && defaultToken.rectangle.jumping == false) {
  
      defaultToken.rectangle.y_velocity -= defaultToken.jumpingHeight; //jumping height
      defaultToken.rectangle.jumping = true;
  
    }
  
    if (controller.left) {
  
      defaultToken.rectangle.x_velocity -= defaultToken.speed;//speed 0.5
  
    }
  
    if (controller.right) {
  
      defaultToken.rectangle.x_velocity += defaultToken.speed;//speed 0.5
  
    }
  
    defaultToken.rectangle.y_velocity += defaultEnvironment.gravity;// gravity 1.5 SP
    defaultToken.rectangle.x += defaultToken.rectangle.x_velocity;
    defaultToken.rectangle.y += defaultToken.rectangle.y_velocity;
    defaultToken.rectangle.x_velocity *= defaultEnvironment.xFriction;// friction 0.9 SP
    defaultToken.rectangle.y_velocity *= defaultEnvironment.yFriction;// friction 0.9 SP
  
    // if defaultToken.rectangle is falling below floor line
    if (defaultToken.rectangle.y > 180 - 16 - 32) {
  
      defaultToken.rectangle.jumping = false;
      defaultToken.rectangle.y = 180 - 16 - 32;
      defaultToken.rectangle.y_velocity = 0;
  
    }
  
    // if defaultToken.rectangle is going off the left of the screen
    if (defaultToken.rectangle.x < -32) {
  
      defaultToken.rectangle.x = 320;
  
    } else if (defaultToken.rectangle.x > 320) {// if defaultToken.rectangle goes past right boundary
  
      defaultToken.rectangle.x = -32;
  
    }
  
    context.fillStyle = "#202020";
    context.fillRect(0, 0, 320, 180);// x, y, width, height
    context.fillStyle = "#ff0000";// hex for red
    context.beginPath();
    context.rect(defaultToken.rectangle.x, defaultToken.rectangle.y, defaultToken.rectangle.width, defaultToken.rectangle.height);
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


  /////front end functions and models


  function Player(name, speed, jump_height){
      return {
          name,
          speed,
          jump_height
      }
  }

  