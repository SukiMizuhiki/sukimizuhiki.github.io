//board
let board;
const rowCount = 21;
const columnCount = 19;
const tileSize = 32;
const boardWidth = columnCount*tileSize;
const boardHeight = rowCount*tileSize;
let context;

let blueGhostImage;
let orangeGhostImage;
let pinkGhostImage;
let redGhostImage;
let pacmanUpImage;
let pacmanDownImage;
let pacmanLeftImage;
let pacmanRightImage;
let wallImage;

//X = wall, O = skip, P = pac man, ' ' = food
//Ghosts: b = blue, o = orange, p = pink, r = red
const tileMap = [
    "XXXXXXXXXXXXXXXXXXX",
    "X        X        X",
    "X XX XXX X XXX XX X",
    "X                 X",
    "X XX X XXXXX X XX X",
    "X    X       X    X",
    "XXXX XXXX XXXX XXXX",
    "OOOX X       X XOOO",
    "XXXX X XXrXX X XXXX",
    "O       bpo       O",
    "XXXX X XXXXX X XXXX",
    "OOOX X       X XOOO",
    "XXXX X XXXXX X XXXX",
    "X        X        X",
    "X XX XXX X XXX XX X",
    "X  X     P     X  X",
    "XX X X XXXXX X X XX",
    "X    X   X   X    X",
    "X XXXXXX X XXXXXX X",
    "X                 X",
    "XXXXXXXXXXXXXXXXXXX"
];

const walls = new Set();
const foods = new Set();
const ghosts = new Set();
let pacman;

const directions = ['U', 'D', 'L', 'R']; //up down left right
let score = 0;
let lives = 3;
let gameOver = false;

// Image loading variables
let blueGhostImage, orangeGhostImage, pinkGhostImage, redGhostImage;
let pacmanUpImage, pacmanDownImage, pacmanLeftImage, pacmanRightImage;
let wallImage;

window.onload = function() {
    board = document.getElementById("board");
    if (!board) {
        console.error("Canvas element with ID 'board' not found.");
        return;
    }
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d"); //used for drawing on the board

    // Start the game only after all images are loaded
    loadImages().then(() => {
        initializeGame();
    }).catch(error => {
        console.error("Error loading images:", error);
    });
}

function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
}

async function loadImages() {
    try {
        [
            wallImage,
            blueGhostImage,
            orangeGhostImage,
            pinkGhostImage,
            redGhostImage,
            pacmanUpImage,
            pacmanDownImage,
            pacmanLeftImage,
            pacmanRightImage
        ] = await Promise.all([
            loadImage("./wall.png"),
            loadImage("./blueGhost.png"),
            loadImage("./orangeGhost.png"),
            loadImage("./pinkGhost.png"),
            loadImage("./redGhost.png"),
            loadImage("./pacmanUp.png"),
            loadImage("./pacmanDown.png"),
            loadImage("./pacmanLeft.png"),
            loadImage("./pacmanRight.png")
        ]);
    } catch (error) {
        console.error("One or more images failed to load.", error);
        // Handle image loading failure, e.g., show an error message.
        throw error;
    }
}

function initializeGame() {
    loadMap();
    for (let ghost of ghosts.values()) {
        const newDirection = directions[Math.floor(Math.random() * 4)];
        ghost.updateDirection(newDirection);
    }
    document.addEventListener("keyup", movePacman);
    // Start the game loop
    requestAnimationFrame(update);
}

function loadMap() {
    walls.clear();
    foods.clear();
    ghosts.clear();
    score = 0; // Reset score when loading a map

    for (let r = 0; r < rowCount; r++) {
        for (let c = 0; c < columnCount; c++) {
            const row = tileMap[r];
            const tileMapChar = row[c];
            const x = c * tileSize;
            const y = r * tileSize;

            if (tileMapChar == 'X') {
                const wall = new Block(wallImage, x, y, tileSize, tileSize);
                walls.add(wall);
            } else if (tileMapChar == 'b') {
                const ghost = new Block(blueGhostImage, x, y, tileSize, tileSize);
                ghosts.add(ghost);
            } else if (tileMapChar == 'o') {
                const ghost = new Block(orangeGhostImage, x, y, tileSize, tileSize);
                ghosts.add(ghost);
            } else if (tileMapChar == 'p') {
                const ghost = new Block(pinkGhostImage, x, y, tileSize, tileSize);
                ghosts.add(ghost);
            } else if (tileMapChar == 'r') {
                const ghost = new Block(redGhostImage, x, y, tileSize, tileSize);
                ghosts.add(ghost);
            } else if (tileMapChar == 'P') {
                pacman = new Block(pacmanRightImage, x, y, tileSize, tileSize);
            } else if (tileMapChar == ' ') {
                const food = new Block(null, x + 14, y + 14, 4, 4);
                foods.add(food);
            }
        }
    }
}

function update() {
    if (gameOver) {
        // Handle game over screen or logic
        drawGameOver();
        return;
    }
    move();
    draw();
    requestAnimationFrame(update); // Use requestAnimationFrame for smoother animation
}

function draw() {
    context.clearRect(0, 0, board.width, board.height);

    // Draw walls
    for (let wall of walls.values()) {
        context.drawImage(wall.image, wall.x, wall.y, wall.width, wall.height);
    }

    // Draw foods
    context.fillStyle = "white";
    for (let food of foods.values()) {
        context.fillRect(food.x, food.y, food.width, food.height);
    }

    // Draw ghosts
    for (let ghost of ghosts.values()) {
        context.drawImage(ghost.image, ghost.x, ghost.y, ghost.width, ghost.height);
    }

    // Draw Pac-Man
    if (pacman) {
        context.drawImage(pacman.image, pacman.x, pacman.y, pacman.width, pacman.height);
    }

    // Draw score and lives
    context.fillStyle = "white";
    context.font = "20px sans-serif";
    context.fillText("Score: " + String(score), 10, 20);
    context.fillText("Lives: " + String(lives), board.width - 80, 20);
}

function drawGameOver() {
    context.fillStyle = "rgba(0, 0, 0, 0.7)";
    context.fillRect(0, 0, board.width, board.height);
    context.fillStyle = "white";
    context.font = "40px sans-serif";
    context.textAlign = "center";
    context.fillText("Game Over", board.width / 2, board.height / 2 - 20);
    context.font = "20px sans-serif";
    context.fillText("Press any key to restart", board.width / 2, board.height / 2 + 20);
}

function move() {
    if (!pacman) return;

    pacman.x += pacman.velocityX;
    pacman.y += pacman.velocityY;

    for (let wall of walls.values()) {
        if (collision(pacman, wall)) {
            pacman.x -= pacman.velocityX;
            pacman.y -= pacman.velocityY;
            break;
        }
    }

    let foodEaten = null;
    for (let food of foods.values()) {
        if (collision(pacman, food)) {
            foodEaten = food;
            score += 10;
            break;
        }
    }
    if (foodEaten) {
        foods.delete(foodEaten);
    }

    if (foods.size == 0) {
        // Next level logic or win condition
        gameOver = true; // For simplicity, end game.
    }

    for (let ghost of ghosts.values()) {
        if (collision(ghost, pacman)) {
            lives -= 1;
            if (lives <= 0) {
                gameOver = true;
                return;
            }
            resetPositions();
            break; // Exit loop after one collision
        }

        moveGhost(ghost);
    }
}

function moveGhost(ghost) {
    // A simple random movement AI for ghosts
    if (Math.random() < 0.02) { // 2% chance to change direction
        const newDirection = directions[Math.floor(Math.random() * 4)];
        ghost.updateDirection(newDirection);
    }

    ghost.x += ghost.velocityX;
    ghost.y += ghost.velocityY;

    for (let wall of walls.values()) {
        if (collision(ghost, wall)) {
            ghost.x -= ghost.velocityX;
            ghost.y -= ghost.velocityY;
            const newDirection = directions[Math.floor(Math.random() * 4)];
            ghost.updateDirection(newDirection);
            break;
        }
    }
}

function movePacman(e) {
    if (gameOver) {
        // Restart the game on any key press
        gameOver = false;
        lives = 3;
        initializeGame();
        return;
    }

    let newDirection = null;
    if (e.code == "ArrowUp" || e.code == "KeyW") {
        newDirection = 'U';
    } else if (e.code == "ArrowDown" || e.code == "KeyS") {
        newDirection = 'D';
    } else if (e.code == "ArrowLeft" || e.code == "KeyA") {
        newDirection = 'L';
    } else if (e.code == "ArrowRight" || e.code == "KeyD") {
        newDirection = 'R';
    }

    if (newDirection && pacman) {
        pacman.updateDirection(newDirection);
        // Update Pac-Man image based on direction
        if (pacman.direction == 'U') pacman.image = pacmanUpImage;
        else if (pacman.direction == 'D') pacman.image = pacmanDownImage;
        else if (pacman.direction == 'L') pacman.image = pacmanLeftImage;
        else if (pacman.direction == 'R') pacman.image = pacmanRightImage;
    }
}

function collision(a, b) {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}

function resetPositions() {
    if (pacman) {
        pacman.reset();
        pacman.velocityX = 0;
        pacman.velocityY = 0;
    }
    for (let ghost of ghosts.values()) {
        ghost.reset();
        const newDirection = directions[Math.floor(Math.random() * 4)];
        ghost.updateDirection(newDirection);
    }
}

class Block {
    constructor(image, x, y, width, height) {
        this.image = image;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.startX = x;
        this.startY = y;

        this.direction = 'R';
        this.velocityX = 0;
        this.velocityY = 0;
        this.speed = tileSize / 8; // Pac-Man and Ghost speed
    }

    updateDirection(direction) {
        const lastDirection = this.direction;
        this.direction = direction;
        this.updateVelocity();
        // A simple check to prevent getting stuck
        let testX = this.x + this.velocityX;
        let testY = this.y + this.velocityY;
        let collisionDetected = false;
        for (let wall of walls.values()) {
            // Create a temporary block for collision check
            let tempBlock = {x: testX, y: testY, width: this.width, height: this.height};
            if (collision(tempBlock, wall)) {
                collisionDetected = true;
                break;
            }
        }
        if (collisionDetected) {
            this.direction = lastDirection;
            this.updateVelocity();
        }
    }

    updateVelocity() {
        this.velocityX = 0;
        this.velocityY = 0;
        if (this.direction == 'U') {
            this.velocityY = -this.speed;
        } else if (this.direction == 'D') {
            this.velocityY = this.speed;
        } else if (this.direction == 'L') {
            this.velocityX = -this.speed;
        } else if (this.direction == 'R') {
            this.velocityX = this.speed;
        }
    }

    reset() {
        this.x = this.startX;
        this.y = this.startY;
        this.direction = 'R';
        this.updateVelocity();
    }
};
