console.log('Hello World');

const PositionCalculator = require('./positionCalculator');

let positionCalculator = new PositionCalculator(0, 0, -5, 6, 4, 6);

const express = require('express');
const bodyParser = require('body-parser');
let app = express();

const port = 8081;

var server = app.listen(port, function() {
	console.log('Listening on ' + port);
});

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

app.get('/send-data', function(req, res) {
	console.log('Received GET request');
	var pos = [];
	pos.push(Math.floor(Math.random() * 10) - 1);
	pos.push(Math.floor(Math.random() * 10) - 1);
	res.send(pos);
});


n = 2.3;
d = Math.pow(10, (-67 - (-67))/(10*n));
console.log(d);
n = 2.3;
d = Math.pow(10, (-67 - (-87))/(10*n));
console.log(d);
macs = ["CC:50:E3:95:93:64", "24:6F:28:16:6E:08", "3C:71:BF:FB:E2:BC"];
let measures = []
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

	let ni = (rssi - A)/(10 * Math.log10(2.65))
	//console.log("ni = " + ni);

	d = Math.pow(10, (-A - rssi)/(10*n));
	console.log(d);
	
	mac = req.body.sourceMac;

	measures[mac] = d;
	if(Object.keys(measures).length == 3) {
		console.log("Resposta");
		console.log(positionCalculator.calculate(measures[0], measures[1], measures[2]));
	}
	
	let response = `OK, the distance for the sniffed mac ${req.body.sniffedMac} is ${d})`;
	res.send(response);
});

