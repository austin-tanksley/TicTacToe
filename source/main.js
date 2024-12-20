
const gameboard = (function () {
    const comment = document.getElementById("comment");

    let board = [];
    const initBoard = () => {
        board = [];
        for (let i = 0; i < 3; i++){
            board[i] = []
            for (let j = 0; j<3; j++){
                board[i].push(createSquare());
            }
        }
    }

    const renderUI = () => {
        comment.textContent = "You go first! Pick a square ya filthy animal."

        const boardContainer = document.getElementById("BOARD")
        boardContainer.innerHTML = "";
        for (let y = 0; y < 3; y++) {
            for (let x = 0; x < 3; x++) {
                const cell = document.createElement("div");
                cell.classList.add("cell");
                cell.dataset.row = y;
                cell.dataset.col = x;
                const marker = document.createElement("img");
                marker.src = "source/img/empty.png";
                marker.alt = "marker"
                marker.classList.add("marker");

                cell.addEventListener("click", () => {
                    clickTurn(y,x);
                })
                boardContainer.appendChild(cell);
                cell.appendChild(marker)
            }
        }
    };

    const updateUI = () => {
        const cells = document.querySelectorAll(".cell");
        comment.textContent = "Nice!";
        cells.forEach((cell) => {
            const row = cell.dataset.row;
            const col = cell.dataset.col;
            const state = board[row][col].getState();
            const marker = cell.querySelector(".marker");

            if (state === 1) {
                marker.src = "source/img/marker_01.png"
            }
            else if (state === 2) {
                marker.src = "source/img/marker_02.png"
            }
            else {
                marker.src = "source/img/empty.png"
            }
        })
    }
    const clickTurn = (y,x) => {
        if (gameControl.getTurn() == 0) {
            gameControl.takeTurn(y,x);
            updateUI();
            gameControl.aiTurn();
        }

    }
    function createSquare(){
        let state = 0;

        const getState = () => state;
        const setState = (player) => state = player;

        return {getState, setState};
    }

    const render = () => {
        function printRow(i){
            console.log(`${board[i][0].getState()} | ${board[i][1].getState()} | ${board[i][2].getState()} `);
        }
        // console.log(`${board[0][0].getState()}`)
        for (let i = 0; i < 3; i++){
            printRow(i);
            console.log("---------")
        }
    }

    const markSquare = (row, col, mark) => {
        if (board[row][col].getState()) {
            console.log("Square already in play. Please choose another");
        }
        else {
            board[row][col].setState(mark);
        }
        render();
    }

    const getSquareID = (y,x) => {
        // here we are indexing the grid using a formula where n = the number of columns
        let n = 3
        return y * n + x + 1;
    }

    const getBoard = () => board;

    return {initBoard, render, markSquare, getSquareID, getBoard, renderUI, updateUI, comment};

})();

const gameControl = (function(){

    gameboard.initBoard();
    gameboard.render();
    gameboard.renderUI();
    
    function createPlayer (marker, number) {
        let squaresClaimed = [];
        const claimSquare = (id) => {
            squaresClaimed.push(id);
        }
        const getSquaresClaimed = () => squaresClaimed;
        // const addScore = () => score++;
        return {number, marker, claimSquare, getSquaresClaimed}
    }
    
    const playerOne = createPlayer("source/img/marker_01.png", 1);
    const playerTwo = createPlayer("source/img/marker_02.png", 2);
    const players = [playerOne, playerTwo];

    let turn = 0;
    let currPlayer = players[turn];

    function checkForWinner(players) {
        let winner = null;
        const WINNING_COMBOS = [ [1,2,3], [1,5,9], [1,4,7], [2,5,8], [3,6,9], [3,5,7], [4,5,6], [7,8,9] ];
        const checkSubset = (parentArray, subsetArray) => {
            return subsetArray.every((el) => {
                return parentArray.includes(el);
            });
        }
        WINNING_COMBOS.forEach(combo => {
            for (let i = 0; i<2; i++){
                if (checkSubset(players[i].getSquaresClaimed(), combo )) winner = players[i];
            }
        });

        return winner
    }

    const takeTurn = (y,x) => {
        gameboard.markSquare(y,x,currPlayer.number);
        const ID = gameboard.getSquareID(y,x);
        currPlayer.claimSquare(ID);

        if (turn == 0) {turn = 1} else {turn = 0};
        currPlayer = players[turn];

        //Check for winner, if no winner, game continues
        let winner = checkForWinner(players);
        if (winner) {
            console.log(`Player ${winner.number} wins!`)
            // gameboard.comment = `Player ${winner.number} wins!`;
        }
    }
    const getTurn = () => turn;

    const isBoardFull = () => {
        const board = gameboard.getBoard();
            for (let row of board) {
            for (let square of row) {
                if (square.getState() === 0) {
                    return false; // Found an empty square
                }
            }
        }
    return true; // No empty squares
    }

    const aiTurn = () => {
        let winner = checkForWinner(players);
        if (winner){
            gameboard.comment.textContent = `Player ${winner.number} wins!`;
            return;
        }
        if (isBoardFull()) {
            console.log("It's a tie! Cat's scratch.");
            gameboard.comment.textContent = "It's a tie! Cat's scratch.";
            return;
        }

        let validMove = false;
        let y = null;
        let x = null;
        while (!validMove){
            y = Math.floor(Math.random() * 3);
            x = Math.floor(Math.random() * 3);

            if (gameboard.getBoard()[y][x].getState() === 0){
                validMove = true;
            }
        }  
        takeTurn(y,x)
        gameboard.updateUI();
    }
    return {takeTurn, getTurn, aiTurn};

})();

