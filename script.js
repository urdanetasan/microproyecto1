var players = [];
      var generatedNumbers = [];
      var currentPlayerIndex = 0;
      var turns = 0;
      var cardSize;

      function getCardSize() {
        do {
          cardSize = parseInt(
            prompt("¿Qué tamaño de cartón quieres? (3x3, 4x4, 5x5)")
          );
        } while (![3, 4, 5].includes(cardSize));
      }

      getCardSize();

      for (var i = 0; i < 4; i++) {
        var name;
        do {
          name = prompt("Introduce el nombre del jugador " + (i + 1));
          if (players.find((player) => player.name === name)) {
            alert(
              "El nombre del jugador ya está en uso. Por favor, introduce un nombre diferente."
            );
          }
        } while (players.find((player) => player.name === name));
        players.push({ name: name, card: generateCard(), score: 0 });
      }

      function generateCard() {
        var card = [];
        while (card.length < cardSize * cardSize) {
          var num = Math.floor(Math.random() * 50) + 1;
          if (!card.includes(num)) {
            card.push(num);
          }
        }
        return card;
      }

      function generateNumber() {
        if (turns < 25) {
          var num;
          do {
            num = Math.floor(Math.random() * 50) + 1;
          } while (generatedNumbers.includes(num));
          generatedNumbers.push(num);
          document.getElementById("turns").innerText =
            "Turno: " + (turns + 1) + " - Número generado: " + num;
          players.forEach((player) => {
            var index = player.card.indexOf(num);
            if (index > -1) {
              player.card[index] = "X";
              document.getElementById(player.name + "-" + index).className =
                "marked";
              updateScore(player);
            }
          });
          turns++;
        } else {
          var maxScore = Math.max(...players.map((player) => player.score));
          var winners = players.filter((player) => player.score === maxScore);
          if (winners.length === 1) {
            alert(
              "¡El ganador es " +
                winners[0].name +
                " con " +
                maxScore +
                " punto(s)!"
            );
          } else {
            alert(
              "¡Hay un empate entre " +
                winners.map((player) => player.name).join(", ") +
                " con " +
                maxScore +
                " punto(s)! "
            );
          }
        }
      }

      function updateScore(player) {
        var card = player.card;
        var score = 0;

        for (var i = 0; i < cardSize; i++) {
          if (
            card
              .slice(i * cardSize, i * cardSize + cardSize)
              .every((num) => num === "X")
          ) {
            score += 1;
            for (var j = 0; j < cardSize; j++) {
              document.getElementById(
                player.name + "-" + (i * cardSize + j)
              ).className = "completed";
            }
          }
        }

        for (var i = 0; i < cardSize; i++) {
          if (
            [...Array(cardSize).keys()]
              .map((j) => card[i + j * cardSize])
              .every((num) => num === "X")
          ) {
            score += 1;
            for (var j = 0; j < cardSize; j++) {
              document.getElementById(
                player.name + "-" + (i + j * cardSize)
              ).className = "completed";
            }
          }
        }

        if (
          [...Array(cardSize).keys()]
            .map((i) => card[i * (cardSize + 1)])
            .every((num) => num === "X")
        ) {
          score += 3;
          for (var i = 0; i < cardSize; i++) {
            document.getElementById(
              player.name + "-" + i * (cardSize + 1)
            ).className = "completed";
          }
        }
        if (
          [...Array(cardSize).keys()]
            .map((i) => card[(i + 1) * (cardSize - 1)])
            .every((num) => num === "X")
        ) {
          score += 3;
          for (var i = 0; i < cardSize; i++) {
            document.getElementById(
              player.name + "-" + (i + 1) * (cardSize - 1)
            ).className = "completed";
          }
        }

        if (card.every((num) => num === "X")) {
          score += 5;
          for (var i = 0; i < cardSize * cardSize; i++) {
            document.getElementById(player.name + "-" + i).className =
              "completed";
          }
          alert(player.name + " ha llenado su cartón. ¡El juego ha terminado!");
        }

        player.score = score;
        document.getElementById("score-" + player.name).innerText = score;
      }

      function resetGame() {
        players = [];
        generatedNumbers = [];
        turns = 0;
        getCardSize();
        for (var i = 0; i < 4; i++) {
          var name;
          do {
            name = prompt("Introduce el nombre del jugador " + (i + 1));
            if (players.find((player) => player.name === name)) {
              alert(
                "El nombre del jugador ya está en uso. Por favor, introduce un nombre diferente."
              );
            }
          } while (players.find((player) => player.name === name));
          players.push({ name: name, card: generateCard(), score: 0 });
        }
        document.getElementById("players").innerHTML = "";
        document.getElementById("turns").innerText =
          "Turno: 0 - Número generado: ##";
        window.onload();
      }

      function showNextPlayer() {
        var playerDivs = document.getElementsByClassName("player");
        playerDivs[currentPlayerIndex].classList.add("hidden");
        currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
        playerDivs[currentPlayerIndex].classList.remove("hidden");
      }

      function showPreviousPlayer() {
        var playerDivs = document.getElementsByClassName("player");
        playerDivs[currentPlayerIndex].classList.add("hidden");
        currentPlayerIndex =
          (currentPlayerIndex - 1 + players.length) % players.length;
        playerDivs[currentPlayerIndex].classList.remove("hidden");
      }

      window.onload = function () {
        var playersDiv = document.getElementById("players");
        players.forEach((player, index) => {
          var playerDiv = document.createElement("div");
          playerDiv.className = "player" + (index > 0 ? " hidden" : "");
          playerDiv.innerHTML =
            "<h2>" +
            player.name +
            "</h2><p>Puntuación: <span id='score-" +
            player.name +
            "'>0</span></p>";
          var cardDiv = document.createElement("div");
          cardDiv.className = "bingo-card";
          cardDiv.style.gridTemplateColumns = "repeat(" + cardSize + ", 1fr)";
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