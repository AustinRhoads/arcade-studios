const Controller = function(){

    this.left = new Controller.ButtonInput();
    this.up = new Controller.ButtonInput();
    this.right = new Controller.ButtonInput();


    this.keyDownUp = function(type, key_code){
        var isKeyDown = (type == "keyDown")? true:false;

        switch(key_code){
            case 37: this.left.getInput(isKeyDown); 
            break;
            case 38: this.up.getInput(isKeyDown);
            break;
            case 39: this.right.getInput(isKeyDown);
        };
    };

};

