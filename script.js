//create grid
const grid = [
    [0,0,1,1,0,0,0,0,0,0,0],
    [0,0,0,1,1,0,0,0,0,0,0],
    [0,0,0,0,1,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0],
]

const webGrid = document.querySelector(".grid")

function displayGrid(grid) {

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

displayGrid(grid);

class Snake {
    constructor(x, y) {
        //Initial direction
        this.direction = {x: 1, y:0};

        //List of positions (x, y)
        this.body = [{x, y}]
    }

    move() {
        let head = this.body[0];
        const {x, y} = this.direction;

        head.x += x;
        head.y += y;

        //moving rest of the body
        this.body = this.body
            .map((el, i, arr) => arr[i-1] || el);

        return this.body;
    }

    // changeDirection()

    // grow()
}

const snake = new Snake(0,0);
setInterval(() => {
    console.table(snake.move());
}, 3000)