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
	let room = response['mac do beacon']

	if(room == 1){
		cirlce(20, 20, 20);
	}

	else if(room == 2){
		circle(30, 30, 20);
	}
	else if(room == 3){
		circle(40, 40, 20);
	}
	else{
		console.log("Sala nao mapeada");
	}
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