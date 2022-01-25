const statusDisplay = document.querySelector('.game--status');

let gameActive, currentPlayer, gameState, currentGameState;

let roomId = "123"
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

    if (roundWon) {
        statusDisplay.innerHTML = winningMessage();
        return;
    }

    let roundDraw = !gameState.includes("");
    if (roundDraw) {
        statusDisplay.innerHTML = drawMessage();
        return;
    }

    if (!updateAble) {
        handlePlayerChange();
        await update()
    }
}

async function handleCellClick(clickedCellEvent) {
    const clickedCell = clickedCellEvent.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-cell-index'));

    if (gameState[clickedCellIndex] !== "" || !gameActive) {
        return;
    }

    handleCellPlayed(currentPlayer, clickedCell, clickedCellIndex);
    handleResultValidation(false);
}

function handleCellChange(player, clickedCellIndex) {

    const clickedCell = document.querySelectorAll(`[data-cell-index="${clickedCellIndex}"]`)[0];

    handleCellPlayed(player, clickedCell, clickedCellIndex);
    handleResultValidation(true);

    statusDisplay.innerHTML = currentPlayerTurn();
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
}

document.querySelectorAll('.cell').forEach(cell => cell.addEventListener('click', handleCellClick));
document.querySelector('.game--restart').addEventListener('click', handleRestartGame);
// document.querySelector('.game--newRoom').addEventListener('click', handleCreateNewRoom);

const room = firebase.database().ref(`room/${roomId}`)

room.on('value', function (snapshot) {
    gameActive = snapshot.val().gameActive
    currentPlayer = snapshot.val().currentPlayer
    gameState = snapshot.val().gameState
    
    console.log(gameActive, currentPlayer, gameState);
    for (let i = 0; i < gameState.length; i++) {
        handleCellChange(gameState[i], i)
    }
});

async function update() {
    await firebase.database().ref(`room/${roomId}`).set({
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
