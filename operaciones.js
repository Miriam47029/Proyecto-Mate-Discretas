let currentIndex = 0;
let nValue = 0;
let resaltado = ''; 
let combinacionIndex = 0;
let radius = 700; // Tamaño inicial del radio del círculo

function deBruijn(n) {
    let k = 2;
    let sequence = Array(n).fill(0);
    let result = [];
    
    let db = function(t, p) {
        if (t > n) {
            if (n % p === 0) {
                for (let i = 1; i <= p; i++) {
                    result.push(sequence[i]);
                }
            }
        } else {
            sequence[t] = sequence[t - p];
            db(t + 1, p);
            for (let j = sequence[t - p] + 1; j < k; j++) {
                sequence[t] = j;
                db(t + 1, t);
            }
        }
    }
    
    db(1, 1);
    return result.join("").padStart(Math.pow(2, n), '0');
}

function generarConjuntos() {
let n = document.getElementById("j1").value;
if (n >= 9) {
document.getElementById("conjuntos").style.display = "none";
} else {
document.getElementById("conjuntos").style.display = "block";
}

let inicio = performance.now();
let cantidad = Math.pow(2, n);
let dbSequence = deBruijn(n);
let tablaCombinaciones = ""; // Inicializar la tabla de combinaciones

// Construir la tabla de combinaciones
for (let i = 0; i < n; i++) {
tablaCombinaciones += "<tr>"; // Iniciar una fila
for (let j = i; j < cantidad; j += parseInt(n)) {
    let binario = dbSequence.substr(j, n).padEnd(n, '0');
    tablaCombinaciones += `<td>${binario}</td>`; // Agregar la celda a la fila
}
tablaCombinaciones += "</tr>"; // Cerrar la fila
}

let fin = performance.now();
let tiempo = fin - inicio;
document.getElementById("tiempo").innerHTML = "Tiempo de ejecución: " + tiempo + " milisegundos";
document.getElementById("cantidad").innerHTML = "Cantidad de conjuntos generados: " + cantidad;
document.getElementById("debruijn").innerHTML = "Secuencia: " + deBruijn(n);
document.getElementById("debruijn").style.color = "red"; // Resaltar la secuencia en azul

// Ajustar el tamaño del círculo según el número de combinaciones
radius = 600 + (n - 10) * 50;
drawCircle();

// Actualizar la tabla con las combinaciones
document.getElementById("result").innerHTML = tablaCombinaciones;
}

function resaltarNumeros() {
let n = document.getElementById("j1").value;
if (n !== nValue) {
nValue = n;
currentIndex = 0;
combinacionIndex = 0;
resaltadoSecuencia = ''; // Limpiar el resaltado de la secuencia
}

let dbSequence = deBruijn(nValue);
let length = dbSequence.length;
let end = (currentIndex + parseInt(nValue)) % length;

resaltadoSecuencia = ''; // Limpiar el resaltado de la secuencia
let tablaResaltada = "<tr>"; // Iniciar una fila
for (let i = 0; i < length; i++) {
if (i % parseInt(nValue) === 0 && i !== 0) {
    tablaResaltada += "</tr><tr>"; // Cerrar la fila actual e iniciar una nueva fila
}
if ((i >= currentIndex && i < end) || (end < currentIndex && (i < end || i >= currentIndex))) {
    resaltadoSecuencia += '1'; // Marcar como resaltado
    tablaResaltada += `<td style="background-color: yellow;">${dbSequence[i]}</td>`; // Resaltar la celda en la tabla
} else {
    resaltadoSecuencia += '0';
    tablaResaltada += `<td>${dbSequence[i]}</td>`; // Agregar la celda normal a la tabla
}
}
tablaResaltada += "</tr>"; // Cerrar la última fila
document.getElementById("result").innerHTML = tablaResaltada; // Actualizar la tabla con las columnas resaltadas

drawCircle(resaltadoSecuencia); // Pasar el resaltado al dibujar el círculo
combinacionIndex = (combinacionIndex + 1) % length;
currentIndex = (currentIndex + 1) % length;
}



function drawCircle(resaltado) {
    let n = document.getElementById("j1").value;
    if (n >= 9) return; // No dibujar el círculo si n es 9 o más

    let canvas = document.getElementById("conjuntos");
    let ctx = canvas.getContext("2d");
    canvas.width = canvas.height = radius * 4;
    let centerX = canvas.width / 2;
    let centerY = canvas.height / 2;
    let angleIncrement = Math.PI * 2 / Math.pow(2, nValue);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let dbSequence = deBruijn(nValue);
    let length = dbSequence.length;

    for (let i = 0; i < length; i++) {
        let angle = i * angleIncrement;
        let x = centerX + radius * Math.cos(angle);
        let y = centerY + radius * Math.sin(angle);
        ctx.font = "16px Arial";
        ctx.textAlign = "center"; // Alinea el texto al centro
        ctx.textBaseline = "middle"; // Alinea el texto en el centro verticalmente
        if (resaltado && resaltado[i] === '1') {
            ctx.fillStyle = 'blue'; // Dibujar en azul si está resaltado
            ctx.shadowColor = 'rgba(0, 0, 255, 0.5)'; // Color de la sombra azul
            ctx.shadowBlur = 17;
            ctx.backgraund = 'red';
        } else {
            ctx.fillStyle = dbSequence[i] === '0' ? 'black' : 'black';
            ctx.shadowColor = 'transparent'; // No hay sombra
            ctx.shadowBlur = 0;
        }
        ctx.fillText(dbSequence[i], x, y);
    }
}