// --- Game State Variables ---
let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X'; // Player is 'X', Robot is 'O'
let isGameActive = true;
let playerName = 'Player'; // Default name
let winner = null; // Stores 'X', 'O', or 'draw'

const winningConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]            // Diagonals
];

// --- DOM Elements ---
const setupSection = document.getElementById('setupSection');
const gameSection = document.getElementById('gameSection');
const playerNameInput = document.getElementById('playerNameInput');
const startGameBtn = document.getElementById('startGameBtn');
const newGameBtn = document.getElementById('newGameBtn');
const gameStatusDisplay = document.getElementById('game-status'); // Renamed from statusDisplay
const boardDiv = document.getElementById('board');
const winnerMessage = document.getElementById('winnerMessage');
const toastDiv = document.getElementById('toast');

// Audio elements
const clickSound = document.getElementById('clickSound');
const winSound = document.getElementById('winSound');
const drawSound = document.getElementById('drawSound');
const bgMusic = document.getElementById('bgMusic');

// Sound and Music Flags
let soundEnabled = true;
let musicEnabled = true;

// --- Utility Functions ---

// Function to show toast messages
function showToast(message, isError = false) {
    toastDiv.textContent = message;
    toastDiv.style.backgroundColor = isError ? '#f44336' : '#4CAF50';
    toastDiv.style.opacity = 1;
    setTimeout(() => {
        toastDiv.style.opacity = 0;
    }, 3000);
}

// Function to toggle dark mode (Copied from game.html)
function toggleTheme() {
    document.body.classList.toggle('dark');
    if (document.body.classList.contains('dark')) {
        localStorage.setItem('theme', 'dark');
    } else {
        localStorage.setItem('theme', 'light');
    }
}

// Function to toggle sound (Copied from game.html)
function toggleSound() {
    soundEnabled = !soundEnabled;
    showToast('Sound: ' + (soundEnabled ? 'On' : 'Off'));
    // Optionally update button text/icon
    document.getElementById('toggleSoundBtn').textContent = soundEnabled ? '🔊 Toggle Sound' : '🔇 Toggle Sound';
}

// Function to toggle music (Copied from game.html)
function toggleMusic() {
    musicEnabled = !musicEnabled;
    if (musicEnabled) {
        bgMusic.play().catch(e => console.log("Music auto-play prevented:", e));
        localStorage.setItem('musicEnabled', 'true');
    } else {
        bgMusic.pause();
        localStorage.setItem('musicEnabled', 'false');
    }
    showToast('Music: ' + (musicEnabled ? 'On' : 'Off'));
    // Optionally update button text/icon
    document.getElementById('toggleMusicBtn').textContent = musicEnabled ? '🎵 Toggle Music' : '🔇 Toggle Music';
}

// --- Game Logic Functions ---

// Initializes the game board UI elements
function initializeBoardUI() {
    boardDiv.innerHTML = ''; // Clear existing cells
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.dataset.cellIndex = i; // Store index for easy access
        cell.addEventListener('click', handleCellClick, { once: true }); // Only allow one click per game
        boardDiv.appendChild(cell);
    }
}

// Resets game state and UI to initial setup
function resetGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X'; // Always player starts
    isGameActive = true;
    winner = null;

    // Reset UI visibility
    setupSection.style.display = 'flex';
    gameSection.style.display = 'none';
    startGameBtn.style.display = 'block';
    newGameBtn.style.display = 'none';

    // Re-enable and clear name input
    playerNameInput.disabled = false;
    // playerNameInput.value = ''; // Uncomment if you want to clear name on new game

    gameStatusDisplay.textContent = ''; // Clear status initially
    winnerMessage.textContent = ''; // Clear winner message
    initializeBoardUI(); // Recreate cells with fresh event listeners

    // Reset win/draw sound play counts for game.html consistency if needed
    // winSoundPlays = 0;
    // drawSoundPlays = 0;
}

// Handles the "Start Game" button click
function handleStartGame() {
    const name = playerNameInput.value.trim();
    if (!name) {
        showToast('Please enter your name to start!', true);
        return;
    }
    playerName = name; // Save player name

    // Disable input and hide start button
    playerNameInput.disabled = true;
    startGameBtn.style.display = 'none';

    // Show game section and new game button
    setupSection.style.display = 'none';
    gameSection.style.display = 'flex';
    newGameBtn.style.display = 'block';

    // Initialize the game state and UI
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    isGameActive = true;
    winner = null;
    gameStatusDisplay.textContent = `${playerName}'s Turn (X)!`;
    gameStatusDisplay.style.color = 'var(--primary-color)';
    winnerMessage.textContent = '';
    initializeBoardUI();
}

// Handles a cell click by the player
function handleCellClick(event) {
    const clickedCell = event.target;
    const clickedCellIndex = parseInt(clickedCell.dataset.cellIndex);

    if (board[clickedCellIndex] !== '' || !isGameActive || currentPlayer !== 'X') {
        return; // Invalid move, game not active, or not player's turn
    }

    if (soundEnabled) clickSound.play();

    updateBoard(clickedCell, clickedCellIndex, currentPlayer);
    checkGameResult();

    if (isGameActive && currentPlayer === 'O') {
        // If game is still active and it's robot's turn, trigger robot move
        setTimeout(handleRobotMove, 800); // Small delay for robot to "think"
    }
}

// Updates the board's visual and internal state
function updateBoard(cellElement, index, playerMark) {
    board[index] = playerMark;
    cellElement.textContent = playerMark;
    cellElement.classList.add('marked', playerMark === 'X' ? 'X' : 'O'); // Add X/O class for color

    currentPlayer = (playerMark === 'X') ? 'O' : 'X'; // Switch turn
    gameStatusDisplay.textContent = (currentPlayer === 'X' ? `${playerName}'s Turn (X)!` : `Robot's Turn (O)...`);
    gameStatusDisplay.style.color = (currentPlayer === 'X' ? 'var(--primary-color)' : 'var(--secondary-color)');
}

// Checks if the game has ended (win or draw)
function checkGameResult() {
    let roundWon = false;
    let winningLine = [];

    for (let i = 0; i < winningConditions.length; i++) {
        const condition = winningConditions[i];
        const [a, b, c] = condition;

        if (board[a] === '' || board[b] === '' || board[c] === '') {
            continue;
        }
        if (board[a] === board[b] && board[b] === board[c]) {
            roundWon = true;
            winner = board[a]; // 'X' or 'O'
            winningLine = condition;
            break;
        }
    }

    if (roundWon) {
        isGameActive = false;
        if (winner === 'X') {
            gameStatusDisplay.textContent = `🎉 ${playerName} WON! 🎉`;
            gameStatusDisplay.style.color = 'var(--primary-color)';
            winnerMessage.textContent = `${playerName} WINS!`;
            if (soundEnabled) winSound.play();
            confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });

        } else { // Robot won
            gameStatusDisplay.textContent = `🤖 ROBOT WON! 🤖`;
            gameStatusDisplay.style.color = 'var(--secondary-color)';
            winnerMessage.textContent = 'ROBOT WINS!';
            if (soundEnabled) winSound.play(); // Consider a different sound for robot win if desired
        }

        // Highlight winning cells
        const cells = boardDiv.children;
        winningLine.forEach(index => {
            cells[index].classList.add('winner-cell');
        });
        return;
    }

    // Check for draw
    if (!board.includes('')) {
        isGameActive = false;
        winner = 'draw';
        gameStatusDisplay.textContent = '🤝 It\'s a DRAW! 🤝';
        gameStatusDisplay.style.color = 'var(--accent-color)';
        winnerMessage.textContent = 'IT\'S A DRAW!';
        if (soundEnabled) drawSound.play();
        return;
    }
}

// --- AI Logic (Simple Heuristic for Tic-Tac-Toe) ---

// Helper to check for a win in a given board state for a specific player
function checkWin(currentBoard, player) {
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (currentBoard[a] === player && currentBoard[b] === player && currentBoard[c] === player) {
            return true;
        }
    }
    return false;
}

// Determines the best move for the AI using simple heuristics
function getBestMove(currentBoard, player) {
    const opponent = (player === 'X') ? 'O' : 'X';

    // 1. Check for immediate winning move for the AI
    for (let i = 0; i < currentBoard.length; i++) {
        if (currentBoard[i] === '') {
            currentBoard[i] = player;
            if (checkWin(currentBoard, player)) {
                currentBoard[i] = ''; // Undo move
                return i;
            }
            currentBoard[i] = ''; // Undo move
        }
    }

    // 2. Check for blocking move for the opponent
    for (let i = 0; i < currentBoard.length; i++) {
        if (currentBoard[i] === '') {
            currentBoard[i] = opponent;
            if (checkWin(currentBoard, opponent)) {
                currentBoard[i] = ''; // Undo move
                return i;
            }
            currentBoard[i] = ''; // Undo move
        }
    }

    // 3. Take center if available
    if (currentBoard[4] === '') {
        return 4;
    }

    // 4. Take available corners
    const corners = [0, 2, 6, 8];
    for (let i = 0; i < corners.length; i++) {
        if (currentBoard[corners[i]] === '') {
            return corners[i];
        }
    }

    // 5. Take available sides
    const sides = [1, 3, 5, 7];
    for (let i = 0; i < sides.length; i++) {
        if (currentBoard[sides[i]] === '') {
            return sides[i];
        }
    }

    // Fallback: This should only happen if the board is full or logic error
    const emptyCells = [];
    for (let i = 0; i < currentBoard.length; i++) {
        if (currentBoard[i] === '') {
            emptyCells.push(i);
        }
    }
    if (emptyCells.length > 0) {
        return emptyCells[Math.floor(Math.random() * emptyCells.length)];
    }

    return -1; // Should not happen in a valid game state
}

// Executes the Robot's move
function handleRobotMove() {
    if (!isGameActive) return;

    const bestMoveIndex = getBestMove(board, 'O'); // 'O' is the robot's player

    if (bestMoveIndex !== -1 && board[bestMoveIndex] === '') {
        const robotCell = boardDiv.children[bestMoveIndex];
        if (soundEnabled) clickSound.play();
        updateBoard(robotCell, bestMoveIndex, 'O');
        checkGameResult();
    }
}

// --- Event Listeners ---
startGameBtn.addEventListener('click', handleStartGame);
newGameBtn.addEventListener('click', resetGame);

// --- Initial Page Load Setup ---
document.addEventListener('DOMContentLoaded', () => {
    // Apply theme on load
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark');
    }

    // Apply music preference on load
    const savedMusicPref = localStorage.getItem('musicEnabled');
    if (savedMusicPref === 'false') { // If specifically saved as false
        musicEnabled = false;
    } else { // Default to true if not set or is 'true'
        musicEnabled = true;
    }

    // Set initial button text/icon for toggles
    document.getElementById('toggleSoundBtn').textContent = soundEnabled ? '🔊 Toggle Sound' : '🔇 Toggle Sound';
    document.getElementById('toggleMusicBtn').textContent = musicEnabled ? '🎵 Toggle Music' : '🔇 Toggle Music';

    if (musicEnabled) {
        bgMusic.play().catch(e => console.log("Music auto-play prevented:", e));
    } else {
        bgMusic.pause();
    }

    // Initialize game state (show setup section first)
    resetGame();
});
