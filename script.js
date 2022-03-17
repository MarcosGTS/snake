//create grid

class Grid {

    constructor (w, h) {
        this.w = w;
        this.h = h; 
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

    contain (pos) {
        const { w, h } = this;
        const { x, y } = pos;
        
        return (x < w && x >= 0) && (y < h && y >= 0);
    }

    putPixel(pos, value) {
        const { x, y } = pos;
        if (this.contain(pos)) this.grid[y][x] = value;
    }

    putSnake (snake) {

        for (let bodyPiece of snake) {
            this.putPixel(bodyPiece, 1);
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
        const { x, y } = this.getHead();
        const headlessBody = this.body.slice(1);
        const result = headlessBody.reduce((rem, el) => rem || (el.x == x && el.y == y), false)

        return result;
    }
}

class Fruit {
    constructor(x, y) {
        this.pos = {x, y}
    }

    isColiding(pos) {
        const fruit = this.pos;
        return fruit.x == pos.x && fruit.y == pos.y;
    }

    changePostion(w, h) {
        const x = this.getRandomNumber(w);
        const y = this.getRandomNumber(h);
        this.pos = {x, y};
        return {x, y};
    }

    getRandomNumber(max) {
        return Math.floor(Math.random() * (max + 1));
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
        const headPos = snake.getHead();

        if (!grid.contain(headPos)) clearInterval(game);
        if (snake.isHiting()) clearInterval(game);

        displayGrid(grid.getGrid());
    }, 250)

}

function setInputHandling (snake) {
    document.addEventListener("keydown", (e) => {
        const { key } = e;
    
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