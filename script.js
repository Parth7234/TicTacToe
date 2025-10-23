const Gameboard=(function(){
    let board=[
        [".",".", "."],
        [".",".","."],
        [".",".","."]
    ]
    const getBoard=()=>board;

    const setMark=(row,col,mark)=>{
        if(board[row][col]==="."){
            board[row][col]=mark;
            return true;
        }
        else return false;
    };

    const checkWinner = () => {
        const b = board; 
        
        
        for (let i = 0; i < 3; i++) {
            if (b[i][0] !== "." && b[i][0] === b[i][1] && b[i][1] === b[i][2]) {
                return b[i][0]; 
            }
        }

        
        for (let i = 0; i < 3; i++) {
            if (b[0][i] !== "." && b[0][i] === b[1][i] && b[1][i] === b[2][i]) {
                return b[0][i];
            }
        }

        
        if (b[0][0] !== "." && b[0][0] === b[1][1] && b[1][1] === b[2][2]) {
            return b[0][0];
        }
        if (b[0][2] !== "." && b[0][2] === b[1][1] && b[1][1] === b[2][0]) {
            return b[0][2];
        }

        
        if (!b.flat().includes(".")) {
            return "tie";
        }

        
        return null; 
    };

    const resetBoard=()=>{
        board=[
        [".",".", "."],
        [".",".","."],
        [".",".","."]
    ]
    }
    
    return {getBoard,setMark,checkWinner,resetBoard};
})()

function createPlayer(name,mark){
    return{name,mark};
}

const gameController=(function(){
    let player1,player2

    let activePlayer=player1;
    let isGameOver=false;

    const switchTurn=()=>{
        activePlayer=(activePlayer===player1)?player2:player1;
    }

    const getActivePlayer=()=>activePlayer;

    const playTurn=(row,col)=>{
        if(isGameOver)return;

        const moveSuccessful=Gameboard.setMark(row,col,getActivePlayer().mark)
        if(moveSuccessful){
            DisplayController.renderBoard();
            const winner=Gameboard.checkWinner();
            if(winner){
                isGameOver=true;
                if(winner==="tie"){
                    DisplayController.showResult("tie");
                }
                else{
                    DisplayController.showResult(getActivePlayer().name)
                }
            }
            else{
                switchTurn();
            }
        }
    }

    const startGame = (p1Name, p2Name) => {
        
        player1 = createPlayer(p1Name || "Player 1", "X");
        player2 = createPlayer(p2Name || "Player 2", "O");
        activePlayer = player1;
        isGameOver = false;
        
        
        DisplayController.renderBoard();
        DisplayController.addClickListeners();
    };

    const resetGame = () => {
        Gameboard.resetBoard();
        activePlayer = player1;
        isGameOver = false;
    };

    return {switchTurn,getActivePlayer,playTurn,resetGame,startGame};
})();

const DisplayController=(function(){
    const gridContainer=document.querySelector("#grid-container");
    const messageElement=document.querySelector("#game-message");
    const resetButton=document.querySelector("#reset-button");

    const renderBoard = () => {

        const board = Gameboard.getBoard();

        
        gridContainer.innerHTML = "";
        
        
        board.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
        
        const cellDiv = document.createElement('div');
        cellDiv.classList.add('cell');
        
        cellDiv.dataset.row = rowIndex;
        cellDiv.dataset.col = colIndex;
        
        
        if (cell === 'X') {
            cellDiv.classList.add('x');
        } else if (cell === 'O') {
            cellDiv.classList.add('o');
        }
        

        
        cellDiv.textContent = (cell === '.') ? '' : cell;

        gridContainer.appendChild(cellDiv);
    });
});
    };

    const addClickListeners = () => {
        gridContainer.addEventListener('click', (event) => {
            
            if (event.target.classList.contains('cell')) {
                const row = event.target.dataset.row;
                const col = event.target.dataset.col;
                
                
                gameController.playTurn(row, col);
            }
        });

        resetButton.addEventListener('click',(event)=>{
            gameController.resetGame()
            renderBoard();
            messageElement.textContent="";
        })
    };

    const showResult = (winnerName) => { 
        if (winnerName === "tie") {
            messageElement.textContent = "It's a tie!";
        } else {
            
            messageElement.textContent = `${winnerName} wins!`;
        }
    };

    return {renderBoard,addClickListeners,showResult};
})();




const startDialog = document.querySelector("#start-game-dialog");
const startForm = document.querySelector("#start-form");


startDialog.showModal();


startForm.addEventListener('submit', (event) => {
    event.preventDefault(); 
    
    
    const p1Name = document.querySelector("#player1-name").value;
    const p2Name = document.querySelector("#player2-name").value;

    
    gameController.startGame(p1Name, p2Name);
    
    
    startDialog.close();
});