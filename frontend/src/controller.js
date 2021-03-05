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


