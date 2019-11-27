/*
Captura de dados
1 - Pegar a relção mac dos sensores:sala verificada do banco de dados
2 - Ver qual dos sensores está mais próximo do beacon
3 - Enviar ao bd o mac do beacon, a hora e o mac do sensor ao bd

Requisição de dados em tempo real
1 - Enviar a quem está requisitando a sala em que se encontra o beacon no momento
*/

const express = require('express');
const bodyParser = require('body-parser');
const pg = require('pg'); 
const fs = require('fs')
let app = express();

/*
 ** Conectando database
 */
let Pool = pg.Pool;
let pool;
fs.readFile("./db/db_config.json", (err, content) => {
  if(err) console.log(err);
  let dbConfig = JSON.parse(content);
  pool = Pool(dbConfig);
  pool.connect();
  getRooms();
});

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

let rooms = [];
let rssis = [];
let measures = [];

function getRooms() {

	console.log("Retrieving information about building from database");
	pool.query(`SELECT * FROM rooms`).then(queryResult => {
		for(let i = 0; i < queryResult.rows.length; ++i)
			rooms[queryResult.rows[i].mac] = queryResult.rows[i].room;
		console.log("Query of rooms successful");
		work();
	}).catch(err => {
		console.log(err); 
	});

}

function calculateRooms() {
	measures = [];
	Object.keys(rssis).forEach((k, i) => {
		let closestMac = "";
		Object.keys(rssis[k]).forEach((r, i) => {
			if(closestMac.length == 0 || rssis[k][closestMac] > rssis[k][r]) {
				closestMac = r;
			}
		});

		let room = rooms[closestMac];

		if(room == undefined) {
			console.log("Sala nao encontrada");
		}

		measures[k] = room;
		console.log(`Beacon ${k} is in room ${room}`);
		pool.query(`INSERT INTO devices (mac, room) VALUES ('${k}', ${room})`).catch(err => {
			console.log(err);
		});
	});

	rssis = [];
}

function work() {

	// calculate rooms for each beacon captured every 5 seconds
	setInterval(calculateRooms, 5000);
	app.post('/send-data', function(req, res) {
		console.log('Received POST request');
		console.log(req.body);

		let rssi, sourceMac, sniffedMac;
		if(req.body.rssi != undefined) {
			rssi = req.body.rssi;
		} else {
			res.send('Error: rssi parameter is not set');
			return;
		}

		if(req.body.sniffedMac != undefined) {
			sniffedMac = req.body.sniffedMac;
		} else {
			res.send('Error: sniffedMac parameter is not set');
			return;
		}

		if(req.body.sourceMac != undefined) {
			sourceMac = req.body.sourceMac;
		} else {
			res.send('Error: sourceMac parameter is not set');
			return;
		}
		if(rssis[sniffedMac] == undefined) rssis[sniffedMac] = [];
		rssis[sniffedMac][sourceMac] = rssi;

	});

	app.get('/get-data', function(req, res) {
		console.log('Received GET request');

		let result = {};
		Object.keys(measures).forEach((k, i) => {
			result[k] = measures[k];
		});
		res.send(JSON.stringify(result));
	});
}
