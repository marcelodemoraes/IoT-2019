let URL = "http://192.168.1.100:8081/get-data";

function setup(){
	frameRate(1);
	createCanvas(1010, 1010);
}

function requestData(){
	$.ajaxSetup({async: false});
	$.get(URL, function(data){
		response = JSON.parse(data);
	});
	return response;
}

function renderBeacon(response){
    ellipseMode(CENTER);
    fill(20);
    //parsing response
    //TODO
    
    //render circle TODO
    circle(x, y, z);
}

function draw(){
	response = requestData();	
    responle.log(response);
	if(response){
		renderBeacon(response);
	}
	else{
		console.log("Request error");
	}
}