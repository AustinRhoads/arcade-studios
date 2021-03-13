let earth = new Image();
earth.src = './public/images/earth_1.png';


function TileSheet(){
    
    this.sky = new Image(),
    this.sky.src = './public/images/sky_block_1.png',
    this.earth = new Image(),
    this.earth.src = './public/images/earth_1.png',
    this.crate = new Image(),
    this.crate.src = './public/images/crate_1.png',
    this.sky_island = new Image(),
    this.sky_island.src = './public/images/sky_island_1.png'
    
}






function imageRef(num, ts){
switch(num){
 case 0:
     return ts.sky;
 break;
 case 1:
     return ts.earth;
 break;
 case 2:
     return ts.crate;
 break;
 case 3:
     return ts.sky_island;
 break;
}


}

