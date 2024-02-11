var players = [];
var generatedNumbers = [];
var gameInterval;
for (var i = 0; i < 4; i++) {
    var name;
    do {
        name = prompt("Introduce el nombre del jugador " + (i + 1));
        if (players.find(player => player.name === name)) {
            alert("El nombre del jugador ya está en uso. Por favor, introduce un nombre diferente.");
        }
    } while (players.find(player => player.name === name));
    players.push({name: name, card: generateCard(), score: 0});
}

function generateCard() {
    var card = [];
    while (card.length < 16) {
        var num = Math.floor(Math.random() * 50) + 1;
        if (!card.includes(num)) {
            card.push(num);
        }
    }
    return card;
}

function startGame() {
    var turns = 0;
    gameInterval = setInterval(function() {
        if (turns < 25) {
            var num;
            do {
                num = Math.floor(Math.random() * 50) + 1;
            } while (generatedNumbers.includes(num));
            generatedNumbers.push(num);
            document.getElementById("turns").innerText = "Turno: " + (turns + 1) + ", Número generado: " + num;
            players.forEach(player => {
                var index = player.card.indexOf(num);
                if (index > -1) {
                    player.card[index] = "X";
                    document.getElementById(player.name + "-" + index).className = "marked";
                    updateScore(player);
                }
            });
            turns++;
        } else {
            clearInterval(gameInterval);
            alert("El juego ha terminado");
        }
    }, 1000);
}

function updateScore(player) {
    var card = player.card;
    var score = 0;

    // Verificar líneas horizontales
    for (var i = 0; i < 4; i++) {
        if (card.slice(i * 4, i * 4 + 4).every(num => num === "X")) {
            score += 1;
        }
    }

    // Verificar líneas verticales
    for (var i = 0; i < 4; i++) {
        if ([card[i], card[i + 4], card[i + 8], card[i + 12]].every(num => num === "X")) {
            score += 1;
        }
    }

    // Verificar líneas diagonales
    if ([card[0], card[5], card[10], card[15]].every(num => num === "X")) {
        score += 3;
    }
    if ([card[3], card[6], card[9], card[12]].every(num => num === "X")) {
        score += 3;
    }

    // Verificar cartón lleno
    if (card.every(num => num === "X")) {
        score += 5;
        clearInterval(gameInterval);
        alert(player.name + " ha llenado su cartón. ¡El juego ha terminado!");
    }

    player.score = score;
    document.getElementById("score-" + player.name).innerText = score;
}

function resetGame() {
    players = [];
    generatedNumbers = [];
    for (var i = 0; i < 4; i++) {
        var name;
        do {
            name = prompt("Introduce el nombre del jugador " + (i + 1));
            if (players.find(player => player.name === name)) {
                alert("El nombre del jugador ya está en uso. Por favor, introduce un nombre diferente.");
            }
        } while (players.find(player => player.name === name));
        players.push({name: name, card: generateCard(), score: 0});
    }
    document.getElementById("players").innerHTML = "";
    document.getElementById("turns").innerText = "";
    window.onload();
}

window.onload = function() {
    var playersDiv = document.getElementById("players");
    players.forEach(player => {
        var playerDiv = document.createElement("div");
        playerDiv.innerHTML = "<h2>" + player.name + "</h2><p>Puntuación: <span id='score-" + player.name + "'>0</span></p>";
        var cardDiv = document.createElement("div");
        cardDiv.className = "bingo-card";
        player.card.forEach((num, index) => {
            var numDiv = document.createElement("div");
            numDiv.id = player.name + "-" + index;
            numDiv.innerText = num;
            cardDiv.appendChild(numDiv);
        });
        playerDiv.appendChild(cardDiv);
        playersDiv.appendChild(playerDiv);
    });
};