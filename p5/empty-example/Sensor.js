let Sensor = class{
	position = [0,0];
	radius = 0;
	constructor(x, y, mac, number){
		this.position[0] = x;
		this.position[1] = y;
		this.mac = mac;
		this.number = number;
	}
	
	getPos(){
		return this.position;
	}
	setPos(x, y){
		this.position[0] = x;
		this.position[1] = y;
	}

	getRadius(){
		return this.radius;
	}
	setRadius(radius){
		this.radius = radius;
	}

	renderSensor(){
		stroke(200);
		noFill();
		circle(width/2 + this.position[0], height/2 - this.position[1], this.radius);
		fill(20);
		circle(width/2 + this.position[0], height/2 - this.position[1], 5);
	}
} 