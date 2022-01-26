const statusDisplay = document.querySelector('.game--status');
const roomIdDisplay = document.querySelector('.game--roomId');
const roomInput = document.querySelector('input[name="roomInput"]')

let gameActive, currentPlayer, gameState, currentGameState, selectPlayer;

let roomId;
let number = 0

const winningMessage = () => `Player ${currentPlayer} has won!`;
const drawMessage = () => `Game ended in a draw!`;
const currentPlayerTurn = () => `It's ${currentPlayer}'s turn`;

statusDisplay.innerHTML = currentPlayerTurn();

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

/*===================================================
                    Handler
=====================================================*/
function handleCellPlayed(player, clickedCell, clickedCellIndex) {
    gameState[clickedCellIndex] = player;
    clickedCell.innerHTML = player;
}

function handlePlayerChange() {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusDisplay.innerHTML = currentPlayerTurn();
}

async function handleResultValidation(updateAble) {
    let roundWon = false;
    let roundDraw = !gameState.includes("");
    for (let i = 0; i <= 7; i++) {
        const winCondition = winningConditions[i];
        let a = gameState[winCondition[0]];
        let b = gameState[winCondition[1]];
        let c = gameState[winCondition[2]];
        if (a === '' || b === '' || c === '') {
            continue;
        }
        if (a === b && b === c) {
            roundWon = true;
            break
        }
    }

    if (!updateAble) {
        if (!roundWon && !roundDraw) {
            handlePlayerChange();
        }
        await update()
    }

    if (roundWon) {
        console.log('roundWon');
        statusDisplay.innerHTML = winningMessage();
        gameActive = false
        return 'win';
    }

    if (roundDraw) {
        console.log('roundDraw');
        statusDisplay.innerHTML = drawMessage();
        gameActive = false
        return 'draw';
    }

    return;
}

async function handleCellClick(clickedCellEvent) {
    const clickedCell = clickedCellEvent.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-cell-index'));
    
    if ((gameState[clickedCellIndex] !== "") || (currentPlayer != selectPlayer) || !gameActive) {
        return;
    }

    handleCellPlayed(currentPlayer, clickedCell, clickedCellIndex);
    handleResultValidation(false);
    console.log(gameState[clickedCellIndex] !== "", !gameActive, (currentPlayer != selectPlayer));
}

async function handleCellChange(player, clickedCellIndex) {

    const clickedCell = document.querySelectorAll(`[data-cell-index="${clickedCellIndex}"]`)[0];

    handleCellPlayed(player, clickedCell, clickedCellIndex);
    const status = await handleResultValidation(true);
    if (!status) {
        statusDisplay.innerHTML = currentPlayerTurn();
    }
}

async function handleRestartGame() {
    gameActive = true;
    currentPlayer = "X";
    gameState = ["", "", "", "", "", "", "", "", ""];

    statusDisplay.innerHTML = currentPlayerTurn();
    document.querySelectorAll('.cell').forEach(cell => cell.innerHTML = "");

    await update()
}

async function handleCreateNewRoom() {
    roomId = makeid(5)
    gameActive = true;
    currentPlayer = "X";
    gameState = ["", "", "", "", "", "", "", "", ""];
    statusDisplay.innerHTML = currentPlayerTurn();
    document.querySelectorAll('.cell').forEach(cell => cell.innerHTML = "");

    await update()
    subscribe()
    roomInput.value = roomId
    console.log(roomId);
}

function handleSelectPlayer(selectEvent) {
    selectPlayer = selectEvent.target.value
    const section = document.querySelector("section");

    if (selectPlayer == "X" || selectPlayer == "O") {
        section.style.display = "inline";
    } else {
        section.style.display = "none";
    }
}

function handleJoin() {
    roomId = roomInput.value
    subscribe()
}

/*===================================================
                    EventListener
=====================================================*/
document.querySelectorAll('.cell').forEach(cell => cell.addEventListener('click', handleCellClick));
document.querySelector('.game--restart').addEventListener('click', handleRestartGame);
document.querySelector('.game--join').addEventListener('click', handleJoin);
document.querySelectorAll('select[name="player"] option').forEach(cell => cell.addEventListener('click', handleSelectPlayer));
document.querySelector('.game--newRoom').addEventListener('click', handleCreateNewRoom);

/*===================================================
                     Function
=====================================================*/
function subscribe() {
    const room = firebase.database().ref(`room/${roomId}`)
    room.on('value', function (snapshot) {
        const data = snapshot.val()
        if (data) {
            gameActive = data.gameActive
            currentPlayer = data.currentPlayer
            gameState = data.gameState

            // console.log(gameActive, currentPlayer, gameState);
            for (let i = 0; i < gameState.length; i++) {
                handleCellChange(gameState[i], i)
            }

            roomIdDisplay.innerHTML = roomId
        }
    });
}

async function update() {
    firebase.database().ref(`room/${roomId}`).set({
        gameActive: gameActive,
        currentPlayer: currentPlayer,
        gameState: gameState
    })
}

function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}
