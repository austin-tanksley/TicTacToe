
const gameboard = (function () {

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


    return {initBoard,render, markSquare};

})();

const gameControl = (function(){

    gameboard.initBoard();
    gameboard.render();
    
    function getSquareID(y,x){
        // here we are indexing the grid using a formula where n = the number of columns
        let n = 3
        return y * 3 + x +1;
    }

    function createPlayer (marker, number) {
        let squaresClaimed = [];
        const claimSquare = (id) => {
            squaresClaimed.push(id);
        }
        const getSquaresClaimed = () => squaresClaimed;
        // const addScore = () => score++;
        return {number, marker, claimSquare, getSquaresClaimed}
    }
    
    const playerOne = createPlayer("X", 1);
    const playerTwo = createPlayer("O", 2);
    const players = [playerOne, playerTwo];

    let turn = 0;
    let currPlayer = players[turn];


    const takeTurn = (y,x) => {
        gameboard.markSquare(y,x,currPlayer.number);
        currPlayer.claimSquare(getSquareID(y,x));
        if (turn == 0) {turn = 1} else {turn = 0};
        currPlayer = players[turn];
    }

    return {takeTurn};



})();

