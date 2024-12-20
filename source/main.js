
const gameboard = (function () {

    let template = $('#boardTemplate').html();

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

    return {initBoard,render, markSquare, getSquareID};

})();

const gameControl = (function(){

    gameboard.initBoard();
    gameboard.render();
    
    function createPlayer (marker, number) {
        let squaresClaimed = [];
        const claimSquare = (id) => {
            squaresClaimed.push(id);
        }
        const getSquaresClaimed = () => squaresClaimed;
        // const addScore = () => score++;
        return {number, marker, claimSquare, getSquaresClaimed}
    }
    
    const playerOne = createPlayer("⚡", 1);
    const playerTwo = createPlayer("🎅", 2);
    const players = [playerOne, playerTwo];

    let turn = 0;
    let currPlayer = players[turn];

    function checkForWinner(players) {
        let winner = null;
        const WINNING_COMBOS = [ [1,2,3], [1,5,9], [1,4,7], [2,5,8], [3,6,9], [3,5,7], [7,8,9] ];
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
        }
    }

    return {takeTurn};

})();

