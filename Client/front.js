

var canvas;
var context;

const positions = [[123, 80], [490, 80], [490, 350], [123, 350]];
const radius = 15;

function requestData() {
    const url = "192.168.1.100/get-data";
    $.get(url, gotData);
}

function clearCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
}

function drawCircle(x, y, r) {
    context.beginPath();
    context.arc(x, y, r, 0, 2 * Math.PI, false);
    context.fillStyle = 'green';
    context.fill();
    context.lineWidth = 1;
    context.strokeStyle = '#003300';
    context.stroke();
}

function gotData(data) {
    data = JSON.parse(data);

    Object.keys(data).forEach((mac, i) => {
        let room = data[mac];
        console.log(`Beacon with mac ${mac} is in room ${room}`);
        drawCircle(positions[room-1][0], positions[room-1][1], radius);
    });

    setTimeout(5000, requestData);
}

$(function() {
    console.log('Starting live tracking');

    canvas = document.querySelector("#canvas");
    context = canvas.getContext('2d');
    requestData();
});