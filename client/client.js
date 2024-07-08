console.log("hello from js");

const socket = io();
let roomUniqueId = null;
let player1 = false;

function createGame() {
    player1 = true;
    socket.emit('createGame');
}

function joinGame() {
    roomUniqueId = document.getElementById('roomUniqueId').value;
    socket.emit('joinGame', {roomUniqueId: roomUniqueId});
}

socket.on("newGame", (data) => {
    roomUniqueId = data.roomUniqueId;
    document.getElementById('initial').style.display = 'none';
    document.getElementById('gamePlay').style.display = 'block';
    let copyButton = document.createElement('button');
    copyButton.style.display = 'block';
    copyButton.classList.add('btn', 'btn-primary', 'py-2', 'my-2');
    copyButton.innerText = 'Copy Code';
    copyButton.addEventListener('click', () => {
        navigator.clipboard.writeText(roomUniqueId).then(function() {
            console.log('Async: Copying to clipboard was successful!');
        }, function(err) {
            console.error('Async: Could not copy text: ', err);
        });
    });
    document.getElementById('waitingArea').innerHTML = `Waiting for opponent, please share code ${roomUniqueId} to join`;
    waitingArea.classList.add('center', 'white-text');
    document.getElementById('waitingArea').appendChild(copyButton);
});

socket.on("playersConnected", () => {
    document.getElementById('initial').style.display = 'none';
    document.getElementById('waitingArea').style.display = 'none';
    document.getElementById('gameArea').style.display = 'flex';
});

socket.on("p1Choice", (data) => {
    if (!player1) {
        createOpponentChoiceButton(data);
    }
});

socket.on("p2Choice", (data) => {
    if (player1) {
        createOpponentChoiceButton(data);
    }
});

socket.on("result", (data) => {
    let winnerText = '';
    if (data.winner != 'd') {
        if (data.winner == 'p1' && player1) {
            winnerText = 'You win';
        } else if (data.winner == 'p1') {
            winnerText = 'You lose';
        } else if (data.winner == 'p2' && !player1) {
            winnerText = 'You win';
        } else if (data.winner == 'p2') {
            winnerText = 'You lose';
        }
    } else {
        winnerText = `It's a draw`;
    }
    document.getElementById('opponentState').style.display = 'none';
    document.getElementById('opponentButton').style.display = 'block';
    document.getElementById('winnerArea').innerHTML = winnerText;
    winnerArea.classList.add('white-text');
    document.getElementById('resultDivider').style.display = 'block';
});

function sendChoice(rpsValue) {
    const choiceEvent = player1 ? "p1Choice" : "p2Choice";
    socket.emit(choiceEvent, {
        rpsValue: rpsValue,
        roomUniqueId: roomUniqueId
    });
    const playerChoiceImg = document.createElement('img');
    playerChoiceImg.src = `./assets/${rpsValue.toLowerCase()}.png`;
    playerChoiceImg.alt = rpsValue;
    playerChoiceImg.classList.add('choice-image');
    document.getElementById('player1Choice').innerHTML = "";
    document.getElementById('player1Choice').appendChild(playerChoiceImg);
}

function createOpponentChoiceButton(data) {
    document.getElementById('opponentState').innerHTML = "Opponent made a choice";
    const opponentChoiceImg = document.createElement('img');
    opponentChoiceImg.src = `./assets/${data.rpsValue.toLowerCase()}.png`;
    opponentChoiceImg.alt = data.rpsValue;
    opponentChoiceImg.classList.add('choice-image');
    opponentChoiceImg.id = 'opponentButton';
    opponentChoiceImg.style.display = 'none';
    document.getElementById('player2Choice').appendChild(opponentChoiceImg);
}
