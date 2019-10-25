let response;
let nSensores;
let mySensors = [];
let myBeacon;
let MACs = [];

let URL = "http://192.168.1.100:8081/get-data";

function setup() {
	frameRate(1);
	createCanvas(1010, 1010);

	nSensores = 3;

	myBeacon = new Beacon();
	MACs = [null, null, null];
	for(let i = 0; i < nSensores; i++){
		mySensors.push(new Sensor(0, 0, MACs[i], i+1));
	}
}

function renderMap(response){
	//'{ "beacon":{"x":1, "y":2}, "sensores":[{"x":1, "y":2, "raio":40}, {"x":1, "y":2, "raio":-40}, {"x":1, "y":2, "raio":-40}]}';
	//"{ "beacon": {'x': 3, 'y': 4}, "sensores": [ { "x": 0, "y": 0, "mac": 'CC:50:E3:95:93:64', "raio": 3, }, { "x": -5, "y": 6, "mac": '24:6F:28:16:6E:08', "raio": 7, }, { "x": 4, "y": 6, "mac": '3C:71:BF:FB:E2:BC', "raio": 3, } ] };"
	myBeacon.setPos(response.beacon.x * 100, response.beacon.y * 100);
	for(let i = 0; i < nSensores; i++){
		mySensors[i].setPos(response.sensores[i].x * 100, response.sensores[i].y * 100);
		mySensors[i].setRadius(response.sensores[i].raio * 100);
		mySensors[i].renderSensor();
	}
	myBeacon.renderBeacon();
}

function requestData(){
	$.ajaxSetup({async: false});
	$.get(URL, function(data){
		response = JSON.parse(data);
	});
	return response;
}

function renderGrid(){
	rectMode(CORNER);
	let jump = 100;
	for (let y = 0; y < 10; y++) {
		for (let x = 0; x < 10; x++) {
		rect(x * jump + 5, y * jump + 5, 100, 100);
		}
	}
}

function draw() {
	background(220);
	rectMode(CENTER);
	fill(255);
	rect(width/2, height/2, 1000, 1000);

	renderGrid();


	response = requestData();	

	console.log(response);
	if(response){
		renderMap(response);
	}
	else{
		console.log("Request error");
	}
}
