const resetButton = document.createElement("button");
resetButton.textContent = " Reset Game ";
resetButton.style.position = "fixed"; // Position the button as needed
resetButton.style.bottom = "100px";
resetButton.style.left = "60px";
document.body.appendChild(resetButton); // Append the button to the body

// Add event listener for the reset button
resetButton.addEventListener("click", () => {
  location.reload(); // Reload the page to reset the game
});

let upPressed = false;
let downPressed = false;
let leftPressed = false;
let rightPressed = false;

const main = document.querySelector("main");
const startDiv = document.querySelector(".startDiv");
const startButton = startDiv.querySelector(".start");
const scoreElement = document.querySelector(".score p");
const livesElement = document.querySelectorAll(".lives li");

let playerX = 1;
let playerY = 1;
let score = 0;
let lives = 3;
let gameInterval;
let enemyInterval;

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
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

let enemies = [
  { x: 8, y: 1, prev: 0 },
  { x: 5, y: 6, prev: 0 },
  { x: 1, y: 8, prev: 0 },
];

function playSound(fileName) {
  var sound = new Audio(`music/${fileName}`);
  sound.play();
}

// Player movement and grid-based collision detection
// Event listeners for arrow button clicks
document.getElementById("lbttn").addEventListener("click", () => {
  leftPressed = true;
  movePlayer();
  leftPressed = false; // Reset after movement
});

document.getElementById("ubttn").addEventListener("click", () => {
  upPressed = true;
  movePlayer();
  upPressed = false; // Reset after movement
});

document.getElementById("rbttn").addEventListener("click", () => {
  rightPressed = true;
  movePlayer();
  rightPressed = false; // Reset after movement
});

document.getElementById("dbttn").addEventListener("click", () => {
  downPressed = true;
  movePlayer();
  downPressed = false; // Reset after movement
});



// Function to handle the win condition
function winGame() {
    clearInterval(gameInterval);
    clearInterval(enemyInterval);
    alert("You win!");
    playSound("win.wav"); // Assuming you have a win sound
  
    const playerName = prompt(`You Win!\nPlease enter your name:`);
    if (playerName) {
      saveScore(playerName, score);
    }
  
    location.reload(); // Restart the game
  }


// Player movement and grid-based collision detection
function movePlayer() {
  let newX = playerX;
  let newY = playerY;

  if (upPressed) newY--;
  else if (downPressed) newY++;
  else if (leftPressed) newX--;
  else if (rightPressed) newX++;

    if (maze[newY][newX] !== 1) {
        if (maze[newY][newX] === 3) {
        loseLife();
        } else if (maze[newY][newX] === 0) {
        score += 10;
        scoreElement.textContent = score;

        // Check if the player has reached the maximum score
        if (score >= 530) {
            winGame();
            return;
        }
        }

    // Update maze and player position
    maze[playerY][playerX] = -1; // Mark old position as visited
    maze[newY][newX] = 2; // Move player to new position
    playerX = newX;
    playerY = newY;
    populateMaze();
    updatePlayerMouthDirection();
  }

  
}

// Update the populateMaze function to handle visited cells
function populateMaze() {
  main.innerHTML = ""; // Clear previous maze
  for (let y = 0; y < maze.length; y++) {
    for (let x = 0; x < maze[y].length; x++) {
      let block = document.createElement("div");
      block.classList.add("block");

      switch (maze[y][x]) {
        case 1:
          block.classList.add("wall");
          break;
        case 2:
          block.id = "player";
          let mouth = document.createElement("div");
          mouth.classList.add("mouth");
          block.appendChild(mouth);
          break;
        case 3:
          block.classList.add("enemy");
          break;
        case 0:
          block.classList.add("point");
          block.style.height = "1vh";
          block.style.width = "1vh";
          break;
        case -1:
          block.style.height = "1vh";
          block.style.width = "1vh";
          break;
      }

      main.appendChild(block);
    }
  }
}

// Update the player's mouth direction based on movement
function updatePlayerMouthDirection() {
  const player = document.querySelector("#player");
  const playerMouth = player.querySelector(".mouth");

  if (downPressed) {
    playerMouth.classList = "down";
  } else if (upPressed) {
    playerMouth.classList = "up";
  } else if (leftPressed) {
    playerMouth.classList = "left";
  } else if (rightPressed) {
    playerMouth.classList = "right";
  }
}

// Manage player lives
// Trigger Both Hit and Dead Animations
function loseLife() {
  lives--;
  livesElement[lives].style.visibility = "hidden";

  const player = document.querySelector("#player");
  if (lives <= 0) {
    endGame("Game Over!");
    player.classList.add("dead");
    setTimeout(() => {
      endGame("Game Over!");
    }, 1500);
  } else {
    resetPlayerPosition();
    player.classList.add("hit");
    setTimeout(() => {
      player.classList.remove("hit");
    }, 1500);
  }
  playSound("lozer.wav");
}

// Reset player position after losing a life
function resetPlayerPosition() {
  maze[playerY][playerX] = 0;
  playerX = 1;
  playerY = 1;
  maze[playerY][playerX] = 2;
  populateMaze();
}

// Move enemies randomly throught the maze
function moveEnemies() {
  enemies.forEach((enemy) => {
    let directions = [
      { x: 0, y: -1 }, // Up
      { x: 0, y: 1 }, // Down
      { x: -1, y: 0 }, // Left
      { x: 1, y: 0 }, // Right
    ];

    let randomDirection =
      directions[Math.floor(Math.random() * directions.length)];
    let newX = enemy.x + randomDirection.x;
    let newY = enemy.y + randomDirection.y;

    if (maze[newY][newX] !== 1 && maze[newY][newX] !== 3) {
      // Mark the enemy's old position as visited if it had a point
      maze[enemy.y][enemy.x] = enemy.prev;
      enemy.prev = maze[newY][newX]===2?-1:maze[newY][newX]
      enemy.x = newX;
      enemy.y = newY;
      maze[enemy.y][enemy.x] = 3; // Place enemy in the new position
    }
    // Check for collision with player
    if (newX === playerX && newY === playerY) {
      loseLife();
    }
  });

  populateMaze();
}

// Start the game when the start button is clicked
// After starting the game start button is not displayed
startButton.addEventListener("click", () => {
  startDiv.style.display = "none";
  startGame();
  playSound("soundpacman.wav");
});

// End the game after all lives is gone
function endGame(message) {
  clearInterval(gameInterval);
  clearInterval(enemyInterval);
  alert(message);
  playSound("click.mp3");
  const playerName = prompt(`${message}\nPlease enter your name:`);
  if (playerName) {
    saveScore(playerName, score);
  }
  location.reload(); // Restart the game
}

// Save the Score & Leaderboard to localStorage
function saveScore(name, score) {
  const leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
  leaderboard.push({ name: name, score: score });
  leaderboard.sort((a, b) => b.score - a.score); // Sort by highest score
  localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
}

// Display the leaderboard
function displayLeaderboard() {
  const leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
  const leaderboardElement = document.querySelector(".leaderboard ol");
  leaderboardElement.innerHTML = ""; // Clear current leaderboard

  leaderboard.slice(0, 6).forEach((entry) => {
    const listItem = document.createElement("li");
    listItem.textContent = `${entry.name}........${entry.score}`;
    leaderboardElement.appendChild(listItem);
  });
}

// Start the game engine/loop
function startGame() {
  gameInterval = setInterval(movePlayer, 200); // Adjust speed as needed
  enemyInterval = setInterval(moveEnemies, 500); // Enemies move every 500ms
}

// Key event listeners for player movement
function keyUp(event) {
  if (event.key === "ArrowUp") {
    upPressed = false;
  } else if (event.key === "ArrowDown") {
    downPressed = false;
  } else if (event.key === "ArrowLeft") {
    leftPressed = false;
  } else if (event.key === "ArrowRight") {
    rightPressed = false;
  }
}

function keyDown(event) {
  if (event.key === "ArrowUp") {
    upPressed = true;
  } else if (event.key === "ArrowDown") {
    downPressed = true;
  } else if (event.key === "ArrowLeft") {
    leftPressed = true;
  } else if (event.key === "ArrowRight") {
    rightPressed = true;
  }
}

document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);

// Initialize the maze on load
populateMaze();
displayLeaderboard();
