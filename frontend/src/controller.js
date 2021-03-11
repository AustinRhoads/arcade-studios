//more advanced game controller come back later homey


//const Controller = function(){
//
//    this.left = new Controller.ButtonInput();
//    this.up = new Controller.ButtonInput();
//    this.right = new Controller.ButtonInput();
//
//
//    this.keyDownUp = function(type, key_code){
//        var isKeyDown = (type == "keyDown")? true:false;
//
//        switch(key_code){
//            case 37: this.left.getInput(isKeyDown); 
//            console.log("left" + `${isKeyDown}`);
//            break;
//            case 38: this.up.getInput(isKeyDown);
//            console.log("up" + `${isKeyDown}`);
//            break;
//            case 39: this.right.getInput(isKeyDown);
//            console.log("down" + `${isKeyDown}`);
//        };
//    };
//
//};
//
//Controller.prototype = {
//    contructor : Controller
//};
//
//
//Controller.ButtonInput = function() {
//    this.active = this.isKeyDown = false;
//}
//
//Controller.ButtonInput.prototype = {
//    constructor : Controller.ButtonInput,
//    getInput : function(isKeyDown) {
//        if (this.isKeyDown != isKeyDown) this.active = isKeyDown;
//        this.isKeyDown = isKeyDown;
//    }
//}






   //////////////////////
  ///CONTROLLER LOGIC///
 //////////////////////


 function Controller() {
     return{
    left: false,
    right: false,
    up: false,
    down: false,
 
   keyListener: function(event) {
     var key_state = (event.type == "keydown")? true:false;
     switch(event.keyCode){
       case 37: //left
         controller.left = key_state;
         event.preventDefault();
       break;
       case 38: //up
         controller.up = key_state;
         event.preventDefault();
       break;
       case 39: //right
         controller.right = key_state;
         event.preventDefault();
       break;
       case 40: //down
         controller.down = key_state;
         event.preventDefault();
       break;
     }
   }
}
 
  }

  