const express = require('express');
const app = express();
app.use(express.json());
const cors = require('cors');
app.use(cors());

const games = {};

const waitingPlayers = {};

function generateGameId() {
  const part1 = Math.random().toString(36).substring(2, 8).toUpperCase();
  const part2 = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${part1}-${part2}`;
}

app.post('/join', (req, res) => {
  const { code, name, opponentCode } = req.body;

  if (!code || !name || !opponentCode) {
    return res.status(400).json({ error: 'Player code, name, and opponent code required' });
  }

  if (waitingPlayers[opponentCode] && waitingPlayers[opponentCode].opponentCode === code) {
    const gameId = generateGameId();

    const players = [
      { code: opponentCode, name: waitingPlayers[opponentCode].name, mark: 'X' },
      { code: code, name: name, mark: 'O' }
    ];

    const startingPlayer = players[Math.floor(Math.random() * players.length)].code;

    games[gameId] = {
      players,
      board: Array(9).fill(''),
      currentTurn: startingPlayer,
      winner: null,
      winningLine: null // Added to store the winning line indices
    };

    delete waitingPlayers[code];
    delete waitingPlayers[opponentCode];

    return res.json({ status: 'started', gameId, players, currentTurn: startingPlayer, winningLine: null });
  }

  waitingPlayers[code] = { name: name, opponentCode: opponentCode };
  return res.json({ status: 'waiting', gameId: null, players: [{ code: code, name: name, mark: 'X' }], winningLine: null });
});


app.post('/make-move', (req, res) => {
  const { gameId, playerCode, cellIndex } = req.body;
  const game = games[gameId];

  if (!game || game.winner) return res.status(400).json({ error: 'Invalid game or game over' });
  if (game.currentTurn !== playerCode) return res.status(400).json({ error: 'Not your turn' });
  if (game.board[cellIndex] !== '') return res.status(400).json({ error: 'Cell already taken' });

  const player = game.players.find(p => p.code === playerCode);
  const mark = player ? player.mark : '';

  game.board[cellIndex] = mark;

  const winnerInfo = checkWinner(game.board); // Get both winner mark and line
  if (winnerInfo) {
    game.winner = playerCode; // Store the player code of the winner
    game.winningLine = winnerInfo.line; // Store the actual winning line indices
  } else if (game.board.every(cell => cell !== '')) {
    game.winner = 'draw';
    game.winningLine = null; // No line for a draw
  } else {
    game.currentTurn = game.players.find(p => p.code !== playerCode).code;
  }

  res.json({
    board: game.board,
    currentTurn: game.currentTurn,
    winner: game.winner || null,
    winningLine: game.winningLine || null, // Include winningLine in the response
    players: game.players
  });
});

app.get('/game-state/:gameId', (req, res) => {
  const game = games[req.params.gameId];
  if (!game) return res.status(404).json({ error: 'Game not found' });

  res.json({
    board: game.board,
    currentTurn: game.currentTurn,
    players: game.players,
    winner: game.winner || null,
    winningLine: game.winningLine || null // Include winningLine in the response
  });
});

app.delete('/game/:gameId', (req, res) => {
  const { gameId } = req.params;
  const { playerCode } = req.body;

  if (!games[gameId]) {
    return res.status(404).json({ error: 'Game not found' });
  }

  const game = games[gameId];
  if (!game.players.some(p => p.code === playerCode)) {
    return res.status(403).json({ error: 'Unauthorized to end this game' });
  }

  delete games[gameId];
  res.json({ message: `Game ${gameId} ended.` });
});


// Modified checkWinner to return the winning line indices
function checkWinner(board) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]          // Diagonals
  ];
  for (let [a, b, c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { mark: board[a], line: [a, b, c] }; // Return the winning mark and the line indices
    }
  }
  return null; // No winner
}

app.post('/check-game', (req, res) => {
  const { code, opponentCode } = req.body;

  for (const gameId in games) {
    const game = games[gameId];
    const playerCodesInGame = game.players.map(p => p.code);

    if (
      playerCodesInGame.includes(code) &&
      playerCodesInGame.includes(opponentCode)
    ) {
      return res.json({
        exists: true,
        status: 'started',
        gameId,
        players: game.players,
        board: game.board,
        currentTurn: game.currentTurn,
        winner: game.winner || null,
        winningLine: game.winningLine || null // Include winningLine in the response
      });
    }
  }

  return res.status(404).json({ exists: false, error: 'Game not found' });
});

app.listen(3000, () => console.log('Server on http://localhost:3000'));