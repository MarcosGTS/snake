//create grid

class Grid {

    constructor (w, h) {
       this.w = w;
       this.h = h; 

       //creating intial matrix
       this.grid = [];
    }

    getGrid () {
        return this.grid;
    }

    clear () {
        const h = this.h;
        const w = this.w;

        this.grid = [];
        
        for (let i = 0; i < h; i++) {
            let line = Array(w).fill(0);
            this.grid.push(line);
        }

    }

    contain (x, y) {
        return (x < this.w && x >= 0) && (y < this.h && y >= 0);
    }

    putSnake (snake) {

        for (let bodyPiece of snake) {
            const {x, y} = bodyPiece;

            if (this.contain(x, y)) this.grid[y][x] = 1; 
        }

        return this.grid;
    }

}

class Snake {

    constructor(x, y) {
        
        this.directions = {
            "n": {x: 0, y: -1},
            "s": {x: 0, y: 1},
            "e": {x: 1, y: 0},
            "o": {x: -1, y: 0},
        }

        //Initial direction
        this.currentDir = "e";

        //List of positions (x, y)
        this.body = [{x, y}, {x, y}, {x, y}, {x, y}, {x, y}]
    }

    getHead() {
        return this.body[0];
    }

    move() {
        const { body } = this
        const { currentDir, directions } = this
        const { x, y } = directions[currentDir];
        const head = body[0];

        //moving rest of the body
        body.unshift({
            x: head.x + x, 
            y: head.y + y,
        })

        body.pop();
            
        return this.body;
    }

    changeDirection(d) {
        const { currentDir } = this

        //moviment restrictions
        if ( currentDir == "s" && d == "n" ) return;
        if ( currentDir == "n" && d == "s" ) return;
        if ( currentDir == "e" && d == "o" ) return;
        if ( currentDir == "o" && d == "e" ) return;

        this.currentDir = d || currentDir;
    }

    grow() {
        const { body } = this;
        body.push(body[0]);
    }

    isHiting() {
        const { x, y } = this.getHead()
        const headlessBody = this.body.slice(1)
        const result = headlessBody.reduce((rem, el) => rem || (el.x == x && el.y == y), false)

        return result;
    }
}

function displayGrid(grid) {
    webGrid.innerHTML = "";

    for (let row of grid) {
        //create row
        const rowEl = document.createElement("div");
        rowEl.classList.add("row")

        for (let coll of row) { 
            //create cell
            const cell = document.createElement("div");

            cell.classList.add("cell");

            //redering snake
            if (coll) cell.classList.add("snake");

            rowEl.appendChild(cell);
        }

        webGrid.appendChild(rowEl);
    }
    
}


const webGrid = document.querySelector(".grid")

//add a button to start the game 

//add a button to restart the game (game over screen)

function startGame() {
    const grid = new Grid (10,10);
    const snake = new Snake(1,1);

    setInputHandling(snake);

    const game = setInterval(() => {
        //eval frame
        grid.clear();
        grid.putSnake(snake.move());
    
        //game over condition
        const { x, y } = snake.getHead();

        if (!grid.contain(x, y)) clearInterval(game);
        if (snake.isHiting()) clearInterval(game);

        displayGrid(grid.getGrid());
    }, 500)

}

function setInputHandling (snake) {
    document.addEventListener("keydown", (e) => {
        const {key} = e;
    
        const inputs =  {
            ArrowUp () {
                snake.changeDirection("n")
            },
            ArrowDown() {
                snake.changeDirection("s")
            },
            ArrowLeft() {
                snake.changeDirection("o")
            },
            ArrowRight() {
                snake.changeDirection("e")
            },
        }
        
        if (inputs[key]) inputs[key]()
    })
}

startGame();