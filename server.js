const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const port = 5500;

// Serve the static files (HTML, CSS, JS)
app.use(express.static('frontend'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/frontend/Homepage.html');
});

let leaderboard; // 声明leaderboard变量

// Handle socket connections
io.on('connection', (socket) => {
  console.log('A client connected');

  // Send the current leaderboard to the newly connected client
  if (leaderboard) {
    socket.emit('updateLeaderboard', leaderboard);
  }

  socket.on('quizResult', (data) => {
    console.log(`User ${data.userName} finished the quiz with score ${data.score} in ${data.totalTime} seconds.`);
    
    // Store the result in the leaderboard
    leaderboard.push(data);
    leaderboard.sort((a, b) => b.score - a.score || a.totalTime - b.totalTime);

    // Save the leaderboard to a file
    fs.writeFile('leaderboard.json', JSON.stringify(leaderboard, null, 2), (err) => {
      if (err) {
        console.error('Error writing to leaderboard file:', err);
      } else {
        console.log('Leaderboard saved');
      }
    });

    // Emit the updated leaderboard to all clients
    io.emit('updateLeaderboard', leaderboard);
  });

  // Listen for client disconnection
  socket.on('disconnect', () => {
    console.log('A client disconnected');
  });
});

// Read leaderboard data from file on server startup
fs.readFile('leaderboard.json', (err, data) => {
  if (err) {
    console.error('Error reading leaderboard file:', err);
    leaderboard = []; // 如果读取失败，则设置一个空的leaderboard
  } else {
    try {
      leaderboard = JSON.parse(data); // 读取成功，解析数据并赋值给leaderboard
    } catch (error) {
      console.error('Error parsing leaderboard data:', error);
      leaderboard = []; // 如果解析失败，则设置一个空的leaderboard
    }
  }
});

// Start the server
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
