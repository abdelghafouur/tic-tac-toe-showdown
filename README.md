# Tic-Tac-Toe Showdown

## A Modern and Interactive Web-Based Tic-Tac-Toe Game with Online Multiplayer and AI

Tic-Tac-Toe Showdown is a dynamic web application that re-imagines the timeless game of Tic-Tac-Toe with a focus on modern aesthetics, engaging user experience, responsive design, and real-time multiplayer capabilities. Challenge friends online or battle an intelligent AI in a visually captivating environment.

-----

## DEMO

**Live Demo:** <a href="https://tic-tac-toe-showdown.glitch.me/" target="_blank">https://tic-tac-toe-showdown.glitch.me/</a>

-----

## Table of Contents

  * [Features](https://www.google.com/search?q=%23features)
  * [How to Play (User Guide)](https://www.google.com/search?q=%23how-to-play-user-guide)
      * [Main Menu](https://www.google.com/search?q=%23main-menu)
      * [Play with Friends (Online Multiplayer)](https://www.google.com/search?q=%23play-with-friends-online-multiplayer)
      * [Play with Robot (Single Player AI)](https://www.google.com/search?q=%23play-with-robot-single-player-ai)
      * [Theme and Sound Toggles](https://www.google.com/search?q=%23theme-and-sound-toggles)
  * [Technical Stack](https://www.google.com/search?q=%23technical-stack)
  * [Project Structure](https://www.google.com/search?q=%23project-structure)
  * [Getting Started (Development)](https://www.google.com/search?q=%23getting-started-development)
      * [Prerequisites](https://www.google.com/search?q=%23prerequisites)
      * [Backend Setup (Crucial for Multiplayer)](https://www.google.com/search?q=%23backend-setup-crucial-for-multiplayer)
      * [Frontend Setup](https://www.google.com/search?q=%23frontend-setup)
      * [Running the Application](https://www.google.com/search?q=%23running-the-application)
  * [Future Enhancements](https://www.google.com/search?q=%23future-enhancements)
  * [Contributing](https://www.google.com/search?q=%23contributing)
  * [License](https://www.google.com/search?q=%23license)
  * [Contact](https://www.google.com/search?q=%23contact)

-----

## Features

  * **Online Two-Player Mode:** Connect with friends using unique game codes via a dedicated backend server for real-time multiplayer.
  * **Intelligent AI Opponent:** A fully functional robot opponent provides a challenging single-player experience.
  * **Sleek UI/UX:** Modern design with smooth animations and transitions for an engaging visual experience.
  * **Responsive Layout:** Playable seamlessly on desktops, tablets, and mobile devices.
  * **Dark Mode:** Toggle between light and dark themes for visual comfort, with preference saved locally.
  * **Sound & Music Controls:** Customizable audio experience with in-game sound effects and background music.
  * **Intuitive Interface:** Easy to learn and navigate, ensuring a smooth onboarding for new players.

-----

## How to Play (User Guide)

### Main Menu (`index.html`)

When you open the application, you'll be greeted by the **Tic-Tac-Toe Showdown** main menu.

1.  **"Play with Friends" Button:** Click this to challenge another player online.
2.  **"Play with Robot" Button:** Click this to play against the AI opponent.
3.  **"🌙 Toggle Dark Mode" Button:** Located in the top-right corner, click this to switch between the light and dark themes. Your preference will be saved for future visits.

-----

### Play with Friends (Online Multiplayer) (`game.html`)

This mode allows two players to compete online via a shared game code and a backend server.

1.  **Enter Your Name:** In the "Enter Your Name" field, type your desired player name.
2.  **Your Code:** A unique 6-character code will be generated and displayed under "Your Code". **Share this code with your opponent.** You can **click on this code** to easily copy it to your clipboard.
3.  **Enter Opponent's Code:** Ask your opponent for their generated code and type it into the "Enter Opponent's Code" field.
4.  **Start Game:** Click the **"Start Game"** button.
      * **If you initiate the game:** You will see a "Waiting for opponent to join..." message with a countdown timer. Once your opponent enters your code and joins, the game will automatically start.
      * **If you join an existing game:** The game board will appear immediately.
5.  **Gameplay:**
      * The display will clearly indicate **whose turn it is**.
      * **Click on an empty cell** on the 3x3 grid to place your mark ('X' or 'O'). Your move will be sent to the server and reflected on your opponent's screen.
      * The game automatically switches turns between connected players.
      * A winner will be declared, or the game will end in a draw.
6.  **New Game:** After a game concludes, click the **"🔄 New Game"** button to start a fresh match. This will also end the current game session on the server.
7.  **Back to Home:** Use the **"🏠 Back to Home"** button in the top-left to return to the main menu.

-----

### Play with Robot (Single Player AI) (`robot-game.html`)

This mode allows you to play directly against an intelligent computer opponent.

1.  **Enter Your Name:** Type your name into the "Enter Your Name" field.
2.  **Start Game:** Click the **"Start Game"** button.
3.  **Gameplay:**
      * You will always play as **'X'**. The robot will play as **'O'**.
      * The game status will tell you when it's your turn or the robot's turn.
      * **Click on an empty cell** on the 3x3 grid to make your move.
      * The robot will automatically make its move shortly after you do, after a short "thinking" delay.
      * The game continues until a winner is found or it's a draw.
4.  **New Game:** After a game concludes, click the **"🔄 New Game"** button to play another round against the robot.
5.  **Back to Home:** Use the **"🏠 Back to Home"** button in the top-left to return to the main menu.

-----

### Theme and Sound Toggles

On all screens (main menu and game modes), you'll find additional toggle buttons in the top section:

  * **"🌙 Toggle Dark Mode" / "☀️ Toggle Light Mode":** Switches the application's theme.
  * **"🔊 Toggle Sound" / "🔇 Toggle Sound":** Enables or disables in-game click, win, and draw sound effects.
  * **"🎵 Toggle Music" / "🔇 Toggle Music":** Plays or pauses the background music.

Your theme and music preferences are saved locally in your browser's local storage.

-----

## Technical Stack

  * **Frontend:**
      * **HTML5:** Structure of the web pages.
      * **CSS3:** Styling, animations, and responsive design.
      * **JavaScript (ES6+):** Game logic, UI manipulation, and interactive features.
      * **`canvas-confetti`:** For celebratory confetti effects on win.
  * **Backend:**
      * **Node.js:** Runtime environment.
      * **Express.js:** Web framework for building the API.
      * **CORS:** Middleware for enabling Cross-Origin Resource Sharing.

-----

## Project Structure

```
tic-tac-toe-showdown/
├── tic-tac-toe-front/      # Frontend (client-side) code
│   ├── index.html          # Main landing page / menu
│   ├── game.html           # Two-player online mode
│   ├── robot-game.html     # Single-player AI mode
│   ├── css/
│   │   ├── style.css       # CSS for index.html
│   │   ├── game.css        # CSS for game.html
│   │   └── robot-game.css  # CSS for robot-game.html
│   ├── js/
│   │   ├── index.js        # JS for index.html
│   │   ├── game.js         # JS for game.html
│   │   └── robot-game.js   # JS for robot-game.html
│   └── assets/             # Audio files
│       ├── click-button.mp3
│       ├── drawing-sound.mp3
│       ├── music-play1.mp3
│       └── win-sound.mp3
└── tic-tac-toe-backend/    
    ├── server.js           
    └── package.json     
```

-----

## Getting Started (Development)

To get a local copy of the full application up and running, follow these steps.

### Prerequisites

  * **Node.js and npm:** Make sure you have Node.js and npm (Node Package Manager) installed on your system. You can download them from [nodejs.org](https://nodejs.org/).
  * A modern web browser (Chrome, Firefox, Safari, Edge, etc.).
  * A local web server for serving the frontend files (e.g., VS Code's "Live Server" extension).

### Backend Setup (Crucial for Multiplayer)

1.  **Navigate to the project root directory:**
    ```bash
    cd tic-tac-toe-showdown/
    ```
2.  **Install backend dependencies:**
    ```bash
    npm install
    ```
    This will install `express` and `cors` based on the `package.json` file located in the root directory.
3.  **Run the backend server:**
    ```bash
    npm start
    ```
    This will execute `node server.js`. You should see `Server listening on port 3000` (or another port if `process.env.PORT` is set) in your console. Keep this terminal window open and the server running while you use the application.

### Frontend Setup

1.  **Navigate to the frontend directory:**
    ```bash
    cd tic-tac-toe-showdown/tic-tac-toe-front
    ```
2.  **Ensure audio files are in the `assets/` directory:** Verify that `click-button.mp3`, `drawing-sound.mp3`, `music-play1.mp3`, and `win-sound.mp3` are all present in `tic-tac-toe-front/assets/`.
3.  **Verify CSS and JS linking:** Double-check that all your HTML files (`index.html`, `game.html`, `robot-game.html`) correctly link to their respective CSS files in `css/` and JavaScript files in `js/`.

### Running the Application

1.  **Start the Frontend:** Open `index.html` in your web browser.

      * **Recommended:** Use a local web server (like VS Code's "Live Server" extension) to serve the `tic-tac-toe-front` directory. Right-click `index.html` and select "Open with Live Server". This ensures correct handling of `fetch` requests and other browser features.
      * Alternatively, you can open `index.html` directly in your browser, but be aware that `game.html`'s multiplayer functionality might behave unexpectedly without a proper server due to browser security restrictions on `fetch` requests (CORS issues from `file://` protocol).

2.  **Test Multiplayer (`game.html`):**

      * With the backend server running, open two separate browser tabs or windows and navigate to `http://localhost:<YOUR_FRONTEND_PORT>/game.html` (e.g., `http://localhost:5500/game.html` if using Live Server).
      * In the first tab, enter a name and click "Start Game" (or just wait for "Your Code" to appear). Share this code.
      * In the second tab, enter a different name, paste the code from the first tab into "Opponent's Code", and click "Start Game". The game should connect\!

3.  **Test AI (`robot-game.html`):**

      * Navigate to `http://localhost:<YOUR_FRONTEND_PORT>/robot-game.html` in a single tab.
      * Enter your name and click "Start Game" to begin playing against the AI.

-----

## Future Enhancements

  * **Enhanced AI:** Implement a more sophisticated AI using a minimax algorithm for an even greater challenge.
  * **Player Profiles:** Allow users to create and save player profiles with statistics.
  * **Leaderboards:** Integrate a server-side leaderboard for competitive online play.
  * **Chat Functionality:** Add in-game chat for multiplayer matches.
  * **Spectator Mode:** Allow users to watch ongoing games.
  * **Room System:** Implement a lobby/room system instead of direct code sharing for easier matchmaking.
  * **Customizable Player Marks:** Allow players to choose different symbols or colors.
  * **Advanced Animations:** Add more dynamic and visually appealing animations for wins, draws, and general gameplay.
  * **Sound/Music Volume Control:** Allow users to adjust individual volume levels for sounds and music.

-----

## Contributing

Contributions are welcome\! If you have suggestions for improvements, new features, or bug fixes, please feel free to fork the repository, make your changes, and open a pull request.

-----

## License

This project is open-source and available under the [MIT License](https://www.google.com/search?q=LICENSE).

-----

## Contact

If you have any questions or feedback, please feel free to reach out.

📧 abdelghafourlahnida01@gmail.com