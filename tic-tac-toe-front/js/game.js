let yourCode = Math.random().toString(36).substring(2, 8).toUpperCase();
document.getElementById('yourCode').textContent = yourCode;

let gameId = null;
let yourMark = null;
let yourName = null;
let opponentMark = null;
let opponentName = null;
let currentTurnPlayerCode = null;
let winner = null;
let soundEnabled = true;
let musicEnabled = true;
let pollingInterval = null;
let countdownInterval = null;
let countdownSeconds = 0;

const startBtn = document.getElementById('startBtn');
const newGameBtn = document.getElementById('newGameBtn');
const yourCodeDisplay = document.getElementById('yourCode');
const opponentCodeInput = document.getElementById('opponentCodeInput');
const yourNameInput = document.getElementById('yourNameInput');
const statusDiv = document.getElementById('status');
const gameIdDisplay = document.getElementById('gameIdDisplay');
const yourMarkDisplay = document.getElementById('yourMark');
const yourNameDisplay = document.getElementById('yourNameDisplay');
const opponentMarkDisplay = document.getElementById('opponentMark');
const opponentNameDisplay = document.getElementById('opponentNameDisplay');
const currentTurnDisplay = document.getElementById('currentTurn');
const winnerMessage = document.getElementById('winnerMessage');
const waitingMessage = document.getElementById('waitingMessage');
const boardDiv = document.getElementById('board');
const gameBoardAndInfoDiv = document.getElementById('gameBoardAndInfo');

const setupSection = document.getElementById('setupSection');
const gameSection = document.getElementById('gameSection');

// Audio elements (re-declare for game.html scope)
const clickSound = document.getElementById('clickSound');
const winSound = document.getElementById('winSound');
const drawSound = document.getElementById('drawSound');
const bgMusic = document.getElementById('bgMusic');

// --- Utility Functions ---

// Function to show toast messages
function showToast(message, isError = false) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.style.backgroundColor = isError ? '#f44336' : '#4CAF50';
    toast.style.opacity = 1;
    setTimeout(() => {
        toast.style.opacity = 0;
    }, 3000);
}

// Function to toggle dark mode (from robot-game.html for uniformity)
function toggleTheme() {
    document.body.classList.toggle('dark');
    if (document.body.classList.contains('dark')) {
        localStorage.setItem('theme', 'dark');
    } else {
        localStorage.setItem('theme', 'light');
    }
    // Update button text/icon for theme toggle
    document.getElementById('toggleThemeBtn').textContent = document.body.classList.contains('dark') ? '☀️ Toggle Light Mode' : '🌙 Toggle Dark Mode';
}

// Function to toggle sound (from robot-game.html for uniformity)
function toggleSound() {
    soundEnabled = !soundEnabled;
    showToast('Sound: ' + (soundEnabled ? 'On' : 'Off'));
    document.getElementById('toggleSoundBtn').textContent = soundEnabled ? '🔊 Toggle Sound' : '🔇 Toggle Sound';
}

// Function to toggle music (from robot-game.html for uniformity)
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
    document.getElementById('toggleMusicBtn').textContent = musicEnabled ? '🎵 Toggle Music' : '🔇 Toggle Music';
}

// --- Countdown Timer Functionality ---
function startCountdown() {
    if (countdownInterval) clearInterval(countdownInterval);

    countdownSeconds = 180; // 3 minutes
    waitingMessage.textContent = `Waiting for opponent to join... ${String(Math.floor(countdownSeconds / 60)).padStart(2, '0')}:${String(countdownSeconds % 60).padStart(2, '0')}`;
    waitingMessage.style.color = 'red';
    waitingMessage.style.display = 'block'; // Make waiting message visible

    countdownInterval = setInterval(() => {
        countdownSeconds--;
        const minutes = Math.floor(countdownSeconds / 60);
        const seconds = countdownSeconds % 60;
        waitingMessage.textContent = `Waiting for opponent to join... ${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

        if (countdownSeconds <= 0) {
            clearInterval(countdownInterval);
            countdownInterval = null;
            showToast("Opponent did not join within 3 minutes. Please try again.", true);
            resetGame(false);
        }
    }, 1000);
}

function stopCountdown() {
    if (countdownInterval) {
        clearInterval(countdownInterval);
        countdownInterval = null;
    }
    waitingMessage.style.display = 'none';
}
// --- End Countdown Timer Functionality ---


startBtn.onclick = async () => {
    const opponentCode = opponentCodeInput.value.trim().toUpperCase();
    yourName = yourNameInput.value.trim();

    if (!yourName) {
        return showToast('Please enter your name.', true);
    }
    if (!opponentCode) {
        return showToast('Please enter opponent code.', true);
    }
    if (opponentCode === yourCode) {
        return showToast("You can't enter your own code!", true);
    }

    statusDiv.textContent = 'Starting game...';
    startBtn.style.display = 'none';
    yourNameInput.disabled = true;
    opponentCodeInput.disabled = true;

    try {
        // This assumes a backend is running at http://localhost:3000
        const res = await fetch('http://localhost:3000/join', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code: yourCode, name: yourName, opponentCode }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to start game');

        gameId = data.gameId;

        const player1 = data.players.find(p => p.code === yourCode);
        const player2 = data.players.find(p => p.code !== yourCode);

        if (player1) {
            yourMark = player1.mark;
            yourName = player1.name;
            yourNameDisplay.textContent = yourName;
            yourNameDisplay.className = yourMark === 'X' ? 'player-name-x' : 'player-name-o';
        }
        if (player2) {
            opponentMark = player2.mark;
            opponentName = player2.name;
            opponentMarkDisplay.textContent = opponentMark;
            opponentNameDisplay.textContent = opponentName;
            opponentNameDisplay.className = opponentMark === 'X' ? 'player-name-x' : 'player-name-o';
        } else {
            opponentMarkDisplay.textContent = '';
            opponentNameDisplay.textContent = 'Waiting...';
            opponentNameDisplay.className = '';
        }

        yourMarkDisplay.textContent = yourMark;
        yourMarkDisplay.className = yourMark === 'X' ? 'X' : 'O';
        gameIdDisplay.textContent = gameId;

        initBoard();
        newGameBtn.style.display = 'block';

        if (data.status === 'started') {
            statusDiv.textContent = '';
            stopCountdown();
            setupSection.style.display = 'none';
            gameSection.style.display = 'flex';
            gameBoardAndInfoDiv.style.display = 'block';
            currentTurnPlayerCode = data.currentTurn;
            // Start polling immediately if game is already started
            pollGameState();
            if (pollingInterval) clearInterval(pollingInterval);
            pollingInterval = setInterval(pollGameState, 2000);
        } else {
            statusDiv.textContent = '';
            startCountdown();
            setupSection.style.display = 'flex'; // Keep setup visible for code/name
            gameSection.style.display = 'flex'; // Show game section for waiting message
            gameBoardAndInfoDiv.style.display = 'none'; // Hide board until opponent joins
            if (pollingInterval) clearInterval(pollingInterval);
            pollingInterval = setInterval(() => waitForOpponentJoin(yourCode, opponentCode), 2000);
        }

    } catch (err) {
        showToast(err.message, true);
        statusDiv.textContent = '';
        startBtn.style.display = 'block';
        newGameBtn.style.display = 'none';
        setupSection.style.display = 'flex';
        gameSection.style.display = 'none';
        stopCountdown();
        if (pollingInterval) clearInterval(pollingInterval);
        yourNameInput.disabled = false;
        opponentCodeInput.disabled = false;
    }
};

async function waitForOpponentJoin(yourCode, opponentCode) {
    if (countdownSeconds <= 0 && countdownInterval === null) return;

    const res = await fetch('http://localhost:3000/check-game', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: yourCode, opponentCode })
    });

    if (res.ok) {
        const data = await res.json();
        if (data.status === 'started') {
            clearInterval(pollingInterval);
            stopCountdown();
            setupSection.style.display = 'none';
            gameSection.style.display = 'flex';
            gameBoardAndInfoDiv.style.display = 'block';

            gameId = data.gameId;

            const player1 = data.players.find(p => p.code === yourCode);
            const player2 = data.players.find(p => p.code !== yourCode);

            if (player1) {
                yourMark = player1.mark;
                yourName = player1.name;
                yourNameDisplay.textContent = yourName;
                yourNameDisplay.className = yourMark === 'X' ? 'player-name-x' : 'player-name-o';
            }
            if (player2) {
                opponentMark = player2.mark;
                opponentName = player2.name;
                opponentMarkDisplay.textContent = opponentMark;
                opponentNameDisplay.textContent = opponentName;
                opponentNameDisplay.className = opponentMark === 'X' ? 'player-name-x' : 'player-name-o';
            }

            yourMarkDisplay.textContent = yourMark;
            yourMarkDisplay.className = yourMark === 'X' ? 'X' : 'O';
            gameIdDisplay.textContent = gameId;

            initBoard();
            currentTurnPlayerCode = data.currentTurn;
            pollGameState();
            pollingInterval = setInterval(pollGameState, 2000);
        }
    } else {
        console.log("Check-game poll failed or game not yet found. Retrying...");
    }
}

async function makeMove(cellIndex) {
    if (winner || currentTurnPlayerCode !== yourCode) return;
    if (soundEnabled) clickSound.play(); // Use the named audio element

    const res = await fetch('http://localhost:3000/make-move', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameId, playerCode: yourCode, cellIndex })
    });
    const data = await res.json();
    if (res.ok) {
        currentTurnPlayerCode = data.currentTurn;
        winner = data.winner;
        updateGameUI(data.board, currentTurnPlayerCode, winner, data.players, data.winningLine);
    } else {
        showToast(data.error, true); // Use toast for errors
    }
}

async function pollGameState() {
    if (!gameId) return;
    const res = await fetch(`http://localhost:3000/game-state/${gameId}`);
    if (res.ok) {
        const data = await res.json();
        currentTurnPlayerCode = data.currentTurn;
        winner = data.winner;
        updateGameUI(data.board, currentTurnPlayerCode, winner, data.players, data.winningLine);
    } else if (res.status === 404) {
        showToast("Opponent ended the game. Starting a new session.", false);
        resetGame(false);
    } else {
        console.error("Game state poll failed:", res.status);
    }
}

function initBoard() {
    boardDiv.innerHTML = '';
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.onclick = () => makeMove(i);
        boardDiv.appendChild(cell);
    }
}

function updateGameUI(boardState, currentTurnCode, win, players, winningLine) {
    const cells = boardDiv.children;

    for (let i = 0; i < 9; i++) {
        cells[i].textContent = boardState[i] || '';
        // Ensure X/O classes are set for styling and then marked to disable further clicks
        cells[i].className = boardState[i] || ''; // This will set X or O class if present
        if (boardState[i] !== '') {
            cells[i].classList.add('marked'); // Mark the cell as taken
        }
        cells[i].classList.remove('winner-cell'); // Clear previous winner highlight
    }

    const currentPlayerObj = players.find(p => p.code === currentTurnCode);
    if (currentPlayerObj) {
        currentTurnDisplay.textContent = currentPlayerObj.code === yourCode ? 'Your Turn' : `${currentPlayerObj.name}'s Turn`;
        currentTurnDisplay.style.color = currentPlayerObj.code === yourCode ? 'var(--primary-color)' : 'var(--secondary-color)';
    } else {
        currentTurnDisplay.textContent = '';
    }

    if (win) {
        winner = win; // Store winner state
        let msg = '';
        if (win === 'draw') {
            msg = '🤝 It\'s a draw!';
        } else {
            const winnerPlayer = players.find(p => p.code === win);
            if (winnerPlayer) {
                msg = winnerPlayer.code === yourCode ? '🎉 You win!' : `Oh no, you lost! ${winnerPlayer.name} wins! 😢`;
                if (winningLine && Array.isArray(winningLine)) {
                    winningLine.forEach(index => {
                        if (cells[index]) {
                            cells[index].classList.add('winner-cell');
                        }
                    });
                }
            }
        }
        winnerMessage.textContent = msg;

        if (soundEnabled) {
            if (win === 'draw') drawSound.play();
            else winSound.play();
        }

        if (win === yourCode) {
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 }
            });
        }
        // Stop polling when game ends
        if (pollingInterval) {
            clearInterval(pollingInterval);
            pollingInterval = null;
        }
    } else {
        winnerMessage.textContent = ''; // Clear winner message if game is ongoing
    }
}

newGameBtn.onclick = () => resetGame(true);

async function resetGame(clientInitiated = false) {
    if (pollingInterval) {
        clearInterval(pollingInterval);
        pollingInterval = null;
    }
    stopCountdown();

    if (clientInitiated && gameId) {
        try {
            // Notify backend to end game if client initiated and gameId exists
            await fetch(`http://localhost:3000/game/${gameId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ playerCode: yourCode })
            });
            showToast("Game session ended on server. Starting new local session.", false);
        } catch (error) {
            console.error("Failed to end game on server:", error);
            showToast("Failed to communicate with server, but resetting locally.", true);
        }
    }

    gameId = null;
    yourMark = null;
    opponentMark = null;
    opponentName = null;
    currentTurnPlayerCode = null;
    winner = null;

    yourCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    yourCodeDisplay.textContent = yourCode;

    opponentCodeInput.value = '';
    // Don't clear yourNameInput.value so user can quickly restart with same name
    // yourNameInput.value = '';
    statusDiv.textContent = '';
    gameIdDisplay.textContent = '';
    yourMarkDisplay.textContent = '';
    yourNameDisplay.textContent = '';
    opponentMarkDisplay.textContent = '';
    opponentNameDisplay.textContent = '';
    currentTurnDisplay.textContent = '';
    winnerMessage.textContent = '';
    boardDiv.innerHTML = ''; // Clear board content

    setupSection.style.display = 'flex';
    gameSection.style.display = 'none';
    newGameBtn.style.display = 'none';
    startBtn.style.display = 'block';

    yourNameInput.disabled = false;
    opponentCodeInput.disabled = false;

    // Reset initial button states
    document.getElementById('toggleThemeBtn').textContent = document.body.classList.contains('dark') ? '☀️ Toggle Light Mode' : '🌙 Toggle Dark Mode';
    document.getElementById('toggleSoundBtn').textContent = soundEnabled ? '🔊 Toggle Sound' : '🔇 Toggle Sound';
    document.getElementById('toggleMusicBtn').textContent = musicEnabled ? '🎵 Toggle Music' : '🔇 Toggle Music';
}

// Apply theme and music on page load
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark');
    }
    const savedMusicPref = localStorage.getItem('musicEnabled');
    if (savedMusicPref === 'false') {
        musicEnabled = false;
    } else {
        musicEnabled = true;
    }

    if (musicEnabled) {
        bgMusic.play().catch(e => console.log("Music auto-play prevented:", e));
    } else {
        bgMusic.pause();
    }

    // Call resetGame to set up the initial display properly
    resetGame(false); // Do not initiate a server-side game end on initial load
});


// Event listener for copying code to clipboard
yourCodeDisplay.onclick = function () {
    const code = this.textContent;
    navigator.clipboard.writeText(code)
        .then(() => showToast('Code copied to clipboard! 📋'))
        .catch(() => showToast('Failed to copy code ❌', true));
};
