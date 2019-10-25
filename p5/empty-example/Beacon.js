let Beacon = class{
	position = [0, 0];
	constructor(x, y, mac){
		this.position[0] = x;
		this.position[1] = y;
		this.mac = mac;
	}

	setPos(x, y){
		this.position[0] = x;
		this.position[1] = y;
	}
	getPos(){
		return this.position;
	}

	renderBeacon(){
		fill(200, 10, 10);
        circle(width/2 + this.position[0], height/2 - this.position[1], 20);
        // fill(0);
        textAlign(CENTER);
        text("Beacon", width/2 + this.position[0], height/2 - this.position[1] + 20);
	}
}