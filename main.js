let upPressed = false;
let downPressed = false;
let leftPressed = false;
let rightPressed = false;

const main = document.querySelector('main');
const startDiv = document.querySelector('.startDiv');
const startButton = startDiv.querySelector('.start');
const scoreElement = document.querySelector('.score p');
const livesElement = document.querySelectorAll('.lives li');

let playerX = 1;
let playerY = 1;
let score = 0;
let lives = 3;
let gameInterval;

// Player = 2, Wall = 1, Enemy = 3, Point = 0
let maze = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 0, 1, 0, 0, 0, 0, 3, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 1, 1],
    [1, 0, 0, 1, 0, 3, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 0, 1],
    [1, 3, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

// Populates the maze in the HTML
function populateMaze() {
    main.innerHTML = ''; // Clear previous maze
    for (let y = 0; y < maze.length; y++) {
        for (let x = 0; x < maze[y].length; x++) {
            let block = document.createElement('div');
            block.classList.add('block');

            switch (maze[y][x]) {
                case 1:
                    block.classList.add('wall');
                    break;
                case 2:
                    block.id = 'player';
                    let mouth = document.createElement('div');
                    mouth.classList.add('mouth');
                    block.appendChild(mouth);
                    break;
                case 3:
                    block.classList.add('enemy');
                    break;
                default:
                    block.classList.add('point');
                    block.style.height = '1vh';
                    block.style.width = '1vh';
            }

            main.appendChild(block);
        }
    }
}

// Player movement and grid-based collision detection
function movePlayer() {
    let newX = playerX;
    let newY = playerY;

    if (upPressed) newY--;
    else if (downPressed) newY++;
    else if (leftPressed) newX--;
    else if (rightPressed) newX++;

    // Collision detection and movement
    if (maze[newY][newX] !== 1) {
        if (maze[newY][newX] === 3) {
            loseLife();
        } else if (maze[newY][newX] === 0) {
            score += 10;
            scoreElement.textContent = score;
        }

        // Update maze and player position
        maze[playerY][playerX] = 0;
        maze[newY][newX] = 2;
        playerX = newX;
        playerY = newY;
        populateMaze();
        updatePlayerMouthDirection();
    }
}

// Update the player's mouth direction based on movement
function updatePlayerMouthDirection() {
    const player = document.querySelector('#player');
    const playerMouth = player.querySelector('.mouth');

    if (downPressed) {
        playerMouth.classList = 'down';
    } else if (upPressed) {
        playerMouth.classList = 'up';
    } else if (leftPressed) {
        playerMouth.classList = 'left';
    } else if (rightPressed) {
        playerMouth.classList = 'right';
    }
}

// Manage player lives
function loseLife() {
    lives--;
    livesElement[lives].style.visibility = 'hidden';
    if (lives <= 0) {
        endGame('Game Over!');
    } else {
        resetPlayerPosition();
    }
}

// Reset player position after losing a life
function resetPlayerPosition() {
    maze[playerY][playerX] = 0;
    playerX = 1;
    playerY = 1;
    maze[playerY][playerX] = 2;
    populateMaze();
}

// Start the game when the start button is clicked
startButton.addEventListener('click', () => {
    startDiv.style.display = 'none';
    startGame();
});

// Start the game loop
function startGame() {
    gameInterval = setInterval(movePlayer, 200); // Adjust speed as needed
}

// End the game
function endGame(message) {
    clearInterval(gameInterval);
    alert(message);
    location.reload(); // Restart the game (could be improved)
}

// Key event listeners for player movement
function keyUp(event) {
    if (event.key === 'ArrowUp') {
        upPressed = false;
    } else if (event.key === 'ArrowDown') {
        downPressed = false;
    } else if (event.key === 'ArrowLeft') {
        leftPressed = false;
    } else if (event.key === 'ArrowRight') {
        rightPressed = false;
    }
}

function keyDown(event) {
    if (event.key === 'ArrowUp') {
        upPressed = true;
    } else if (event.key === 'ArrowDown') {
        downPressed = true;
    } else if (event.key === 'ArrowLeft') {
        leftPressed = true;
    } else if (event.key === 'ArrowRight') {
        rightPressed = true;
    }
}

document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

// Initialize the maze on load
populateMaze();


let upPressed = false;
// let downPressed = false;
// let leftPressed = false;
// let rightPressed = false;

// const main = document.querySelector('main');

// //Player = 2, Wall = 1, Enemy = 3, Point = 0
// let maze = [
//     [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
//     [1, 2, 0, 1, 0, 0, 0, 0, 3, 1],
//     [1, 0, 0, 0, 0, 0, 0, 1, 1, 1],
//     [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
//     [1, 0, 1, 1, 0, 0, 0, 0, 0, 1],
//     [1, 0, 0, 0, 0, 0, 0, 1, 1, 1],
//     [1, 0, 0, 1, 0, 3, 0, 0, 0, 1],
//     [1, 0, 0, 0, 0, 0, 0, 1, 0, 1],
//     [1, 3, 1, 0, 0, 0, 0, 0, 0, 1],
//     [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
// ];

// //Populates the maze in the HTML
// for (let y of maze) {
//     for (let x of y) {
//         let block = document.createElement('div');
//         block.classList.add('block');

//         switch (x) {
//             case 1:
//                 block.classList.add('wall');
//                 break;
//             case 2:
//                 block.id = 'player';
//                 let mouth = document.createElement('div');
//                 mouth.classList.add('mouth');
//                 block.appendChild(mouth);
//                 break;
//             case 3:
//                 block.classList.add('enemy');
//                 break;
//             default:
//                 block.classList.add('point');
//                 block.style.height = '1vh';
//                 block.style.width = '1vh';
//         }

//         main.appendChild(block);
//     }
// }


// //Player movement
// function keyUp(event) {
//     if (event.key === 'ArrowUp') {
//         upPressed = false;
//     } else if (event.key === 'ArrowDown') {
//         downPressed = false;
//     } else if (event.key === 'ArrowLeft') {
//         leftPressed = false;
//     } else if (event.key === 'ArrowRight') {
//         rightPressed = false;
//     }
// }

// function keyDown(event) {
//     if (event.key === 'ArrowUp') {
//         upPressed = true;
//     } else if (event.key === 'ArrowDown') {
//         downPressed = true;
//     } else if (event.key === 'ArrowLeft') {
//         leftPressed = true;
//     } else if (event.key === 'ArrowRight') {
//         rightPressed = true;
//     }
// }

// const player = document.querySelector('#player');
// const playerMouth = player.querySelector('.mouth');
// let playerTop = 0;
// let playerLeft = 0;

// setInterval(function() {
//     if(downPressed) {
//         playerTop++;
//         player.style.top = playerTop + 'px';
//         playerMouth.classList = 'down';
//     }
//     else if(upPressed) {
//         playerTop--;
//         player.style.top = playerTop + 'px';
//         playerMouth.classList = 'up';
//     }
//     else if(leftPressed) {
//         playerLeft--;
//         player.style.left = playerLeft + 'px';
//         playerMouth.classList = 'left';
//     }
//     else if(rightPressed) {
//         playerLeft++;
//         player.style.left = playerLeft + 'px';
//         playerMouth.classList = 'right';
//     }
// }, 10);

// document.addEventListener('keydown', keyDown);
// document.addEventListener('keyup', keyUp);