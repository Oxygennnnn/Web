# Web-Assignment

## Overview
This project created a WEB based personal website with Homepage, About Me, Explore More and Quiz interfaces with the main feature being a dynamic and interactive quiz application. The application is designed to allow users to participate in timed quizzes and view leaderboards that show the top participants. The application uses HTML, CSS, JavaScript and Node.js for the interface design and Socket.IO for data transfer and interaction with the user.

## Overall Design

### Homepage(root)
* Path: `https://rhinoleft-trumpetbenefit-5500.codio-box.uk/Homepage.html`
* Related Files: **Homepage.html**, **Homepage.css**

The home page is the main entry point to the site, and its main function is to welcome the user, containing a looping background video and a navigation bar. From the navigation bar, users can access the About Me, Explore More, and Quiz pages. Since the homepage has no interactive features, only the text animations use JavaScript code.

### About-me-page
* Path: `https://rhinoleft-trumpetbenefit-5500.codio-box.uk/About_Me.html`
* Related Files: **About_Me.html**, **Contentpage.css**

The "About Me" page provides brief information about me, including my background, hobbies, personal photos, etc. It corresponds to the required introduction page, which also contains a navigation bar that allows the user to return to the home page or visit other pages. The content of the page is mainly a static display of information and does not involve complex interactive features.

### Explore-more-page
* Path: `https://rhinoleft-trumpetbenefit-5500.codio-box.uk/Explore_More.html`
* Related Files: **Explore_More.html**, **Contentpage.css**

The "Explore More" page is designed to provide more detailed information about me. Similar to the other pages, it contains a navigation bar to allow users to navigate between pages. The content of the page includes further reading material navigated by buttons, photos in the form of a slideshow, and so on.

### Quiz
* Path: `https://rhinoleft-trumpetbenefit-5500.codio-box.uk/Quiz.html`
* Related Files: **Quiz.html**, **Contentpage.css**

The quiz page is the core feature of the website where users can participate in a quiz and view the leaderboard. The page contains the following main sections:

- **Welcome Message**: Users enter their name and click the "Start" button to begin the quiz.
- **Quiz Content**: Displays the current question and options, and provides feedback after the user selects an answer.
- **Timers**: Shows the total elapsed time and the remaining time for the current question.
- **Leaderboard**: Displays the scores and completion times of all participants.
渲染
Interactive functionality is primarily implemented through JavaScript, including handling user input, displaying questions and feedback, updating timers, and managing the leaderboard display and updates. Socket.IO is used for real-time communication between the client and server, ensuring that quiz results are promptly updated on the leaderboard.

## Challenges
1. **Real-time communication**: Implementing real-time updating of leaderboards using Socket.IO is a challenge. Ensuring that quiz results are reflected on all connected clients in a timely manner and establishing a stable connection between the client and the server, handling events such as user connections, disconnections, and result updates required careful handling of socket events and data synchronisation. In this regard, I confirmed the order of socket communication and code location several times and finally solved the problem.

2. **Timer Management**: Managing the total timer for the entire quiz and individual timers for each question was a challenge. Ensuring that the timers accurately reflect the time used and time remaining without conflict requires precise interval management and clearing mechanisms. For this, I created two separate timers, while only the total timer recorded the total time passed into the database.

3. **Code overrides**: Ensuring that the site is responsive and visually appealing across different devices and screen sizes requires a lot of CSS, however, a lot of CSS can cause some code to be written and then overridden by other code, e.g. Quiz's Options button didn't show the effect my code should have when clicked, so I restructured the code first and then made the interface as simple as possible.

4. **Leaderboard persistence**: Storing and retrieving leaderboard data is a necessary task for keeping user scores across sessions. Implementing file read and write operations with Node.js and handling possible errors required careful attention. Therefore, I created a server that reads the existing rankings each time before initialising the list, and then creates an empty list before doing a uniform write, which ensures that the leaderboards are persistent compared to the beginning when I created a new list each time.

## Client-Server Communication Using Socket.IO

### Implementation of client-server communication

In our quiz application, client-server communication is implemented using Socket.IO. This real-time bidirectional communication mechanism makes it possible to update quiz results and display leaderboards in real-time. The following is the main flow of client-server communication:

### Client

1. **Establishing a connection**: On the client side, a connection is first established with the server through the `io()` function.
   ```javascript
    const socket = io();
   ```

2. **Send quiz results**: When the user completes the quiz and submits the results, the client sends the quiz results to the server via the socket.emit event.
   ```javascript
    socket.emit('quizResult', { userName, score, totalTime });
   ```

3. **Receive Leaderboard Update**: The client listens to the updateLeaderboard event to receive the latest leaderboard data from the server and update the page display.
   ```javascript
    socket.on('updateLeaderboard', (leaderboard) => {
      updateLeaderboard(leaderboard);
    });
   ```

### Server

1. **Handling connections**: On the server side, client connection requests are handled by listening for `connection` events.
   ```javascript
    io.on('connection', (socket) => {
      console.log('A client connected');
    });
   ```
2. **Receiving and processing quiz results**: the server listens to the `quizResult` event, and when it receives the quiz results sent by the client, it stores the results in the leaderboard and sorts the leaderboard.
   ```javascript
    socket.on('quizResult', (data) => {
        leaderboard.push(data);
        leaderboard.sort((a, b) => b.score - a.score || a.totalTime - b.totalTime);
        // Save the leaderboard to a file
        fs.writeFile('leaderboard.json', JSON.stringify(leaderboard, null, 2), (err) => {
            if (err) console.error('Error writing to leaderboard file:', err);
        });
        // Emit the updated leaderboard to all clients
        io.emit('updateLeaderboard', leaderboard);
    });
   ```
3. **Send Leaderboard Data**: When a new client connects, the server sends the current leaderboard data to that client to ensure that the leaderboard displayed by all clients is up-to-date.
   ```javascript
    if (leaderboard) {
      socket.emit('updateLeaderboard', leaderboard);
    }
   ```

### Main communication flow
1. **Client starts and connects to the server**: the client's `JavaScript` runs when the page is loaded and establishes a connection to the server via `io()`.
2. **User completes the quiz and submits the result**: after the user completes the quiz, the client sends the result to the server via `socket.emit('quizResult', data)`.
3. **Server processes the results and updates the leaderboard**: the server receives the quiz results, adds them to the leaderboard, and sorts and stores the leaderboard.
4. **Server broadcasts updated leaderboard**: the server sends the latest leaderboard data to all connected clients via `io.emit('updateLeaderboard', leaderboard)`.
5. **Client receives and updates the display**: all connected clients receive the `updateLeaderboard` event and call the appropriate function to update the leaderboard display on the page.

## References
* Background video source: https://pixabay.com/zh/videos/search/fuji/
* Socket.IO Tutorial Documentation: https://socket.io/docs/v4/
* W3School Tutorial Documentation: https://www.w3school.com.cn/

