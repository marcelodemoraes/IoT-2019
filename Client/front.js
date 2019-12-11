var canvas;
var context;

// Coordenadas dos circulos verdes no canvas que indicam a posicao do beacon
const positions = [
  [123, 80], // superior esquerda
  [490, 80], // inferior esquerda
  [490, 350], // inferior direita
  [123, 350] // superior direita
];
const radius = 15; // raio do circulo verde

// Realiza um GET request para o servidor (Raspberry PI), que retorna dicionario JSON com chave MAC e valor: id da sala.
// Por exemplo {"23:34:B7:23:12": 1, "45:FF:G3:A2:12" : 2}
function requestData() {
  const url = "http://192.168.1.100:8081/get-data";
  $.get(url, gotData);
  setTimeout(5000, requestData);
}

function gotData(data) {
  data = JSON.parse(data);

  clearCanvas();
  Object.keys(data).forEach((mac, i) => {
    let room = data[mac];
    console.log(`Beacon with mac ${mac} is in room ${room}`);
    drawCircle(positions[room - 1][0], positions[room - 1][1], radius);
  });

}

// ------------------ RENDERIZACAO ------------------- //
function clearCanvas() {
  context.clearRect(0, 0, canvas.width, canvas.height);
}

function drawCircle(x, y, r) {
  context.beginPath();
  context.arc(x, y, r, 0, 2 * Math.PI, false);
  context.fillStyle = "green";
  context.fill();
  context.lineWidth = 1;
  context.strokeStyle = "#003300";
  context.stroke();
}
// --------------------------------------------------- //

$(function() {
    console.log('Starting live tracking');

    canvas = document.querySelector("#canvas");
    context = canvas.getContext('2d');
    requestData();
});

