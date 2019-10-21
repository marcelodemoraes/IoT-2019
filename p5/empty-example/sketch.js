let x, y;
let xDir;
let yDir;
let response;

let URL = "http://localhost:8081/send-data";



function setup() {
	frameRate(1);
	createCanvas(800, 800);
	x = width/2;
	y = height/2;
	xDir = 1;
	yDir = 2;
}



function draw() {
	$.ajaxSetup({async: false});
	$.get(URL, function(data){
		response = data;
	});
	background(220);
	rectMode(CENTER);
	fill(255);
	rect(width/2, height/2, 750, 750);
	fill(100, 150, 200);
	circle(x, y, 20);
	x += 10;
	console.log(response);
	if(response){
		x = response[0] + 200;
		y = response[1] + 200;
	}




}
