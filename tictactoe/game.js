let origBoard;
const huPlayer = 'O';
const aiPlayer = 'X';
const winCombos = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [6,4,2]
]

const cells = document.querySelectorAll(".cell");


const startGame = () => {
    document.querySelector(".endgame").style.display = "none"
    origBoard = Array.from(Array(9).keys());
    for (let i = 0; i < cells.length; i++) {
        cells[i].innerText = '';
        cells[i].style.removeProperty('background-color');
        cells[i].addEventListener('click', turnClick, false)
    }
}

const turnClick = (square) => {
    if(typeof origBoard[square.target.id] == 'number'){
        turn(square.target.id, huPlayer)
        if (!checkTie()) {
            setTimeout(function() {
                turn(bestSpot(), aiPlayer)
            }, 500)
        }
    }
}

const turn = (square, player) => {
    origBoard[square] = player;
    document.getElementById(square).innerText = player;
    let gameWon = checkWin(origBoard, player)
    if (gameWon) gameOver(gameWon)
}

const checkWin = (board, player) => {
    let plays = board.reduce((a, e, i) => 
        (e === player) ? a.concat(i) : a, [])
    let gameWon = null;
    for (let [index, win] of winCombos.entries()) {
        if (win.every(elem => plays.indexOf(elem) > -1)) {
            gameWon = {index: index, player: player}
        }
    }

    return gameWon;
}

const gameOver = (gameWon) => {
    for (let index of winCombos[gameWon.index]) {
        document.getElementById(index).style.backgroundColor = 
            gameWon.player == huPlayer ? "blue" : "red";
    }

    for (let i = 0; i < cells.length; i++) {
        cells[i].removeEventListener('click', turnClick, false)
    }
    declareWinner(gameWon.player == huPlayer ? "You Win" : "You Lose")
}

const declareWinner = (who) => {
    document.querySelector('.endgame').style.display = 'block';
    document.querySelector('.endgame .text').innerText = who;
}

const emptySquares = () => {
    return origBoard.filter(square => typeof square == 'number')
}

const bestSpot = () => {
    return miniMax(origBoard, aiPlayer).index;
}

const checkTie = () => {
    if(emptySquares().length === 0) {
        for(let i = 0; i < cells.length; i++) {
            cells[i].style.backgroundColor = 'green';
            cells[i].removeEventListener('click', turnClick, false)
        }
        declareWinner('Tie Game!')
        return true;
    }
    return false;
}

const miniMax = (newBoard, player) => {
    let availableSpots = emptySquares(newBoard)

    if(checkWin(newBoard, huPlayer)) {
        return {score: -10};
    } else if (checkWin(newBoard, aiPlayer)) {
        return {score: 20};
    } else if (availableSpots.length === 0) {
        return {score: 0};
    }
    let moves = [];
    for(let i = 0; i < availableSpots.length; i++) {
        let move = {};
        move.index = newBoard[availableSpots[i]];
        newBoard[availableSpots[i]] = player;

        if(player === aiPlayer) {
            let result = miniMax(newBoard, huPlayer)
            move.score = result.score;
        } else {
            let result = miniMax(newBoard, aiPlayer)
            move.score = result.score;
        }

        newBoard[availableSpots[i]] = move.index;

        moves.push(move);
    }

    let bestMove;
    if(player === aiPlayer) {
        let bestScore = -10000;
        for(let i = 0; i < moves.length; i++) {
            if(moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i
            }
        }
    } else {
        let bestScore = 10000;
        for(let i = 0; i < moves.length; i++) {
            if(moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i
            }
        }
    }

    return moves[bestMove];
}

startGame();
