console.log('Hello World');

const express = require('express');
const bodyParser = require('body-parser');
let app = express();

const port = 8081; // when using this port, run node index.js with sudo

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

app.post('/send-data', function(req, res) {
	console.log('Received POST request');
	console.log(req.body);
	res.send('OK');
});

