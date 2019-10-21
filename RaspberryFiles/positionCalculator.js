
// Este objeto calcula a posicao do beacon
// x1, y1: posicao da ESP32 de referencia 1
// x2, y2: posicao da ESP32 de referencia 2
// x3, y3: posicao da ESP32 de referencia 3
function positionCalculator(x1, y1, x2, y2, x3, y3) {
	this.x1 = x1;
	this.x2 = x2;
	this.x3 = x3;
	this.y1 = y1;
	this.y2 = y2;
	this.y3 = y3;

	let D = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2)); // distancia de (x1, y1) pra (x2, y2)
	
	// Vamos usar P1 = (x1, y1) e P2 = (x2, y2) pra calcular os dois pontos de interseccao, e entao d3 pra desempatar
	// d1 = distancia1 ate o mac da esp 2: CC:50:E3:95:93:64
	// d2 = distancia2 ate o mac da esp 3: 24:6F:28:16:6E:08
	// d3 = distancia3 ate o mac da esp 4: 3C:71:BF:FB:E2:BC
	this.calculate = function(d1, d2, d3) {
		
		// Quando as circunferencias nao se intersectam, aumenta a medicao das distancias ate se intersectarem
		if(d1 + d2 < D) {
			let aux = D - (d1 + d2);
			d1 += D/2 + 1e-5;
			d2 += D/2 + 1e-5;
			d3 += D/2 + 1e-5;
		}
		let a = (d1 * d1 - d2 * d2 + D * D)/(2 * D); // distancia do P1 ate o centro da interseccao dos circulos, como explicado em https://stackoverflow.com/questions/3349125/circle-circle-intersection-points 
		let h = Math.sqrt(d1 * d1 - a * a); // altura ate um ponto de interseccao
		
		xmid = this.x1 + a * (this.x2 - this.x1)/D // x do meio
		ymid = this.y1 + a * (this.y2 - this.y1)/D // y do meio
		
		console.log("Centro");
		console.log([xmid, ymid]);

		let x = xmid + h * (this.y2 - this.y1)/D; // primeiro candidato
		let y = ymid - h * (this.x2 - this.x1)/D;
		let xx = xmid - h * (this.y2 - this.y1)/D; // segundo candidato
		let yy = ymid + h * (this.x2 - this.x1)/D;
		console.log([x, y])
		console.log([xx, yy])
		let d = Math.sqrt((x - this.x3) * (x - this.x3) + (y - this.y3) * (y - this.y3)); // distancia do primeiro candidato ate o terceiro ponto, da esp 4
		let dd = Math.sqrt((xx - this.x3) * (xx - this.x3) + (yy - this.y3) * (yy - this.y3)); // distancia do segundo candidato ate o terceiro ponto, da esp 4

		// ve qual distancia se aproxima mais da distancia 3, pra retornar
		if(Math.abs(d - d3) < Math.abs(dd - d3)) {
			return [x, y];
		} else {
			return [xx, yy];
		}
	}
}


// Testes
pos = new positionCalculator(0, 0, -5, 6, 4, 6);

console.log(pos.calculate(5, 3, 8.2));
console.log(pos.calculate(6, 5, 4))

module.exports = positionCalculator;
