const grid_size = document.querySelector(".grid").clientWidth;

const GRID_DIMENSION = 6;
const CELL_SIZE = `${grid_size / GRID_DIMENSION}px`;
const SNAKE_COLOR = "green";
const APPLE_COLOR = "red";

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

    putPixels (list, value) {
        /* 
            list -> a list of positions ({x, y})
            value -> value of a primitive type
        */

        for (let pos of list) {
            this.putPixel(pos, value);
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
        const last = body.length - 1;
        body.push(body[last]);
    }

    isHiting() {
        const head = this.getHead();
        const headlessBody = this.body.slice(1)
        const result = headlessBody.some(({ x, y }) => x == head.x && y == head.y);

        return result;
    }

    isColiding(pos) {
        const { x, y } = pos;
        const { body } = this;
        const result = body.some((el) => el.x == x && el.y == y);
        
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

    changePostion(w, h, execptions=[]) {
        const { pos } = this;
        let isColinding = false;

        do {
            pos.x = this.getRandomNumber(w)
            pos.y = this.getRandomNumber(h);

            isColinding = execptions.some(({ x, y }) => {
                return pos.x == x && pos.y == y;
            })

        } while (isColinding)
        
        return pos;
    }

    getRandomNumber(max) {
        return Math.floor(Math.random() * max);
    }   
}

function displayGrid(grid) {
    webGrid.innerHTML = "";

    for (let row of grid) {
        //create row
        const rowEl = document.createElement("div");
        rowEl.classList.add("row")

        for (let value of row) { 
            //create cell
            const cell = document.createElement("div");

            cell.classList.add("cell");
            cell.style.backgroundColor = value;
            cell.style.width  = CELL_SIZE;
            cell.style.height = CELL_SIZE;
            
            rowEl.appendChild(cell);
        }

        webGrid.appendChild(rowEl);
    }
    
}

function translateInput(snake, key) {
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
}

function startGame() {
    const grid = new Grid (GRID_DIMENSION, GRID_DIMENSION);
    const snake = new Snake(1,1);
    const fruit = new Fruit(0, 0);

    currentKey = ""; 

    const game = setInterval(() => {
        //eval frame
        
        grid.clear();
        snake.move()

        grid.putPixel(fruit.pos, APPLE_COLOR);
        grid.putPixels(snake.body, SNAKE_COLOR);
        const headPos = snake.getHead();
        
        //Fruit logic
        if (fruit.isColiding(headPos)) {
            snake.grow();
            fruit.changePostion(GRID_DIMENSION, GRID_DIMENSION, snake.body);
        }

        //change direction
        translateInput(snake, currentKey);

        //game over condition
        if (!grid.contain(headPos) || snake.isHiting()) {
            clearInterval(game);
            displayMenu();
        }

        displayGrid(grid.getGrid());
    }, 250)

}

const webGrid = document.querySelector(".grid")
let currentKey = "";
document.addEventListener("keydown", (e) => {
    currentKey = e.key;
})

//add a button to start the game 
const menu = document.querySelector(".menu");
const startBtn = document.querySelector(".start");

//add a button to restart the game (game over screen)

startBtn.addEventListener("click", () => {
    startGame()
    menu.classList.toggle("hidden");
})

function displayMenu() {
    menu.classList.toggle("hidden")
}