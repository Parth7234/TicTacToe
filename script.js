class Gameboard{
    board=[
        [".",".", "."],
        [".",".","."],
        [".",".","."]
    ]
    getBoard=()=>this.board;

    setMark=(row,col,mark)=>{
        if(this.board[row][col]==="."){
            this.board[row][col]=mark;
            return true;
        }
        else return false;
    };

    checkWinner = () => {
        const b = this.board; 
        
        
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

    resetBoard=()=>{
        this.board=[
        [".",".", "."],
        [".",".","."],
        [".",".","."]
    ]
    }
}

function createPlayer(name,mark){
    return{name,mark};
}

class GameController{
    player1;
    player2;

    activePlayer;
    isGameOver=false;

    constructor(gameboard, displayController) {
        this.gameboard = gameboard;
        this.displayController = displayController;
    }

    switchTurn=()=>{
        this.activePlayer=(this.activePlayer===this.player1)?this.player2:this.player1;
    }

    getActivePlayer=()=>this.activePlayer;

    playTurn=(row,col)=>{
        if(this.isGameOver)return;

        const moveSuccessful=this.gameboard.setMark(row,col,this.getActivePlayer().mark)
        if(moveSuccessful){
            this.displayController.renderBoard();
            const winner=this.gameboard.checkWinner();
            if(winner){
                this.isGameOver=true;
                if(winner==="tie"){
                    this.displayController.showResult("tie");
                }
                else{
                    this.displayController.showResult(this.getActivePlayer().name)
                }
            }
            else{
                this.switchTurn();
            }
        }
    }

    startGame = (p1Name, p2Name) => {
        
        this.player1 = createPlayer(p1Name || "Player 1", "X");
        this.player2 = createPlayer(p2Name || "Player 2", "O");
        this.activePlayer = this.player1;
        this.isGameOver = false;
        
        
        this.displayController.renderBoard();
        this.displayController.addClickListeners();
    };

    resetGame = () => {
        this.gameboard.resetBoard();
        this.activePlayer = this.player1;
        this.isGameOver = false;
    };
}

class DisplayController{
    gridContainer=document.querySelector("#grid-container");
    messageElement=document.querySelector("#game-message");
    resetButton=document.querySelector("#reset-button");

    constructor(gameboard, gameController) {
        this.gameboard = gameboard;
        
        this.gameController = gameController;
    }

    renderBoard = () => {

        const board = this.gameboard.getBoard();

        
        this.gridContainer.innerHTML = "";
        
        
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

        this.gridContainer.appendChild(cellDiv);
    });
});
    };

    addClickListeners = () => {
        this.gridContainer.addEventListener('click', (event) => {
            
            if (event.target.classList.contains('cell')) {
                const row = event.target.dataset.row;
                const col = event.target.dataset.col;
                
                
                this.gameController.playTurn(row, col);
            }
        });

        this.resetButton.addEventListener('click',(event)=>{
            this.gameController.resetGame()
            this.renderBoard();
            this.messageElement.textContent="";
        })
    };

    showResult = (winnerName) => { 
        if (winnerName === "tie") {
            this.messageElement.textContent = "It's a tie!";
        } else {
            
            this.messageElement.textContent = `${winnerName} wins!`;
        }
    };
}


const gameboard = new Gameboard();

const displayController = new DisplayController(gameboard, null); 

const gameController = new GameController(gameboard, displayController);

displayController.gameController = gameController;


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