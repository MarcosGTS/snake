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
        body.push(body[1]);
    }

    isHiting() {
        const { x, y } = this.getHead();
        const headlessBody = this.body.slice(1)
        const result = headlessBody.reduce((rem, el) => rem || (el.x == x && el.y == y), false)

        return result;
    }

    isColiding(pos) {
        const { x, y } = pos;
        const { body } = this;
        const result = body.some((el) => el.x == x && el.y == y);
        console.log(result)
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
    const grid = new Grid (10,10);
    const snake = new Snake(1,1);
    const fruit = new Fruit(6, 6)

    const game = setInterval(() => {
        //eval frame
        grid.clear();
        grid.putPixels(snake.move(), "green");
        grid.putPixel(fruit.pos, "red");
       
        const headPos = snake.getHead();
        
        //Fruit logic
        if (fruit.isColiding(headPos)) {
            snake.grow();
            
            do {
                const fruitPos = fruit.changePostion(10, 10);
            } while(snake.isColiding(fruitPos))
        }

        //change direction
        translateInput(snake, currentKey);

        //game over condition
        if (!grid.contain(headPos)) clearInterval(game);
        if (snake.isHiting()) clearInterval(game);

        displayGrid(grid.getGrid());
    }, 250)

}

const webGrid = document.querySelector(".grid")
let currentKey = "";
document.addEventListener("keydown", (e) => {
    currentKey = e.key;
})

//add a button to start the game 

//add a button to restart the game (game over screen)

startGame();