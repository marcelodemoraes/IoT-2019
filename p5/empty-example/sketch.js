let x, y;
let response;
let nSensores;
let mySensors = [];
let myBeacon;
let MACs = [];

let URL = "http://192.168.1.100:8081/get-data";

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
		console.log(this.position);

		stroke(200);
		noFill();
		circle(this.position[0], this.position[1], this.radius);
		fill(20);
		circle(this.position[0], this.position[1], 5);
	}
} 

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
		fill(10, 10, 10);
		circle(this.position[0], this.position[1], 10);
	}
}

function changeOrigin(x, y){

}

function setup() {
	frameRate(1);
	createCanvas(1000, 1000);

	nSensores = 3;

	myBeacon = new Beacon();
	MACs = [null, null, null];
	for(let i = 0; i < nSensores; i++){
		mySensors.push(new Sensor(0, 0, MACs[i], i+1));
	}
}

function draw() {
	$.ajaxSetup({async: false});
	$.get(URL, function(data){
		response = JSON.parse(data);
	});
	background(220);
	rectMode(CENTER);
	fill(255);
	rect(width/2, height/2, 950, 950);
	x += 10;
	console.log(response);
	if(response){
		//'{ "beacon":{"x":1, "y":2}, "sensores":[{"x":1, "y":2, "raio":40}, {"x":1, "y":2, "raio":-40}, {"x":1, "y":2, "raio":-40}]}';
		//"{ "beacon": {'x': 3, 'y': 4}, "sensores": [ { "x": 0, "y": 0, "mac": 'CC:50:E3:95:93:64', "raio": 3, }, { "x": -5, "y": 6, "mac": '24:6F:28:16:6E:08', "raio": 7, }, { "x": 4, "y": 6, "mac": '3C:71:BF:FB:E2:BC', "raio": 3, } ] };"
		x = response.beacon.x * 20 + 500;
		y = response.beacon.y * 20 + 500;
		myBeacon.setPos(x, y);
		for(let i = 0; i < nSensores; i++){
			mySensors[i].setPos(response.sensores[i].x * 20 + 500, response.sensores[i].y * 20 + 500);
			mySensors[i].setRadius(response.sensores[i].raio * 20);
			mySensors[i].renderSensor();
		}
		myBeacon.renderBeacon();
	}
}
