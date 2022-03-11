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
        return x < this.w && x > 0 && y < this.h && this.h > 0;
    }

    putSnake (snake) {
        //remove older skane
        this.clear();

        for (let bodyPiece of snake) {
            const {x, y} = bodyPiece;

            if (this.contain(x, y)) this.grid[y][x] = 1; 
        }

        return this.grid;
    }

}

const webGrid = document.querySelector(".grid")

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

class Snake {
    constructor(x, y) {
        //Initial direction
        this.direction = {x: 1, y:0};

        //List of positions (x, y)
        this.body = [{x, y}, {x, y}, {x, y}]
    }

    move() {
        let head = this.body[0];
        const {x, y} = this.direction;

        //moving rest of the body
        this.body.unshift({
            x: head.x + x, 
            y: head.y + y,
        })

        this.body.pop();
            
        return this.body;
    }

    // changeDirection()

    // grow()
}

const grid = new Grid (11,11);
const snake = new Snake(1,1);
grid.clear();
displayGrid(grid.getGrid())

setInterval(() => {
    grid.clear();
    const snakeBody = snake.move()
    grid.putSnake(snakeBody);
    
    displayGrid(grid.getGrid());
}, 3000)