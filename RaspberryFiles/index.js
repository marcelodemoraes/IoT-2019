console.log('Hello World');

const PositionCalculator = require('./positionCalculator');

const nodes = [
	{'x': 0, 'y': 0, 'mac': 'CC:50:E3:95:93:64'},
	{'x': -5, 'y': 6, 'mac': '24:6F:28:16:6E:08'},
	{'x': 4, 'y': 6, 'mac': '3C:71:BF:FB:E2:BC'}
];


let positionCalculator = 
	new PositionCalculator(nodes[0].x, nodes[0].y, nodes[1].x, nodes[1].y, nodes[2].x, nodes[2].y);


const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose'); 
let app = express();

const port = 8081;

var server = app.listen(port, function() {
	console.log('Listening on ' + port);
});

mongoose.connect("mongodb://localhost/tracking", { useNewUrlParser: true, useUnifiedTopology: true });

const DeviceModel = Mongoose.model("device", {
    macAdd: String, 
    rssi: Number,
    dist: Number,
    time: Date
});

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());



/*
Testes da distancia
n = 2.3;
d = Math.pow(10, (-67 - (-67))/(10*n));
console.log(d);
n = 2.3;
d = Math.pow(10, (-67 - (-87))/(10*n));
console.log(d);
*/

let measures = []
let lastMeasures = []
app.post('/send-data', function(req, res) {
	console.log('Received POST request');
	console.log(req.body);

	let rssi;
	if(req.body.rssi != undefined) {
		rssi = req.body.rssi;
	} else {
		res.send('Error: rssi parameter is not set');
		return;
	}

	if(req.body.sniffedMac != undefined) {
		mac = req.body.sniffedMac;
	} else {
		res.send('Error: sniffedMac parameter is not set');
		return;
	}

	// Formula original eh RSSI = -(10n log_10(d) + A)
	// Isolando d, d = 10^{(A - RSSI)/10n}
	// A eh a medicao do RSSI a um metro de distancia
	// n eh chamado de "environmental factor"
	// Pra n, eu acho que a gente pega varias medicoes de (RSSI - A)/(10 * log_10(d)) e faz uma media
	// Entao vamos assumir por enquanto que a gente sabe o A e o n
	// medicao do RSSI a um metro de distancia
	A = 67;
	// medicao do fator de environment
	n = 2.0;

	d = Math.pow(10, (-A - rssi)/(10*n));
	console.log(`Distance: ${d}`);
	
	mac = req.body.sourceMac;

	measures[mac] = d;
	if(Object.keys(measures).length == 3) {
		console.log("Resposta");
		console.log(positionCalculator.calculate(measures[nodes[0].mac], measures[nodes[1].mac], measures[nodes[2].mac]));
		lastMeasures = measures;
		measures = [];
	}
	
	try {
        var device = new DeviceModel(request.body);
        var result = await device.save();
		let response = `OK, the distance for the sniffed mac ${req.body.sniffedMac} is ${d})`;
        res.send(response);
    } catch (error) {
        res.status(500).send(error);
    }

});

app.get('/get-data', function(req, res) {
	console.log('Received GET request');

	let pos = positionCalculator.calculate(lastMeasures[nodes[0].mac], lastMeasures[nodes[1].mac], lastMeasures[nodes[2].mac]);
	var response = {
		"beacon": {'x': pos[0], 'y': pos[1]},
		"sensores": [
			{
				"x": nodes[0].x,
				"y": nodes[0].y,
				"mac": nodes[0].mac,
				"raio": lastMeasures[nodes[0].mac],
			},
			{
				"x": nodes[1].x,
				"y": nodes[1].y,
				"mac": nodes[1].mac,
				"raio": lastMeasures[nodes[1].mac],
			},
			{
				"x": nodes[2].x,
				"y": nodes[2].y,
				"mac": nodes[2].mac,
				"raio": lastMeasures[nodes[2].mac],
			}
		]
	};
	res.send(JSON.stringify(response));
});