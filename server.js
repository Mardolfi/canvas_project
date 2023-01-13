require('dotenv').config()
const express = require("express");
const port = process.env.PORT || 3333;
const cors = require('cors')

// 'https://canvas-multiplayer-game-test.herokuapp.com'

const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ["GET", "POST"],
  },
});

app.use(cors())

app.get('/', (req, res) => {
  res.send('server is up and running')
})

let players = [];

let objective = {
  name: "objective",
  position: {
    x: Math.ceil((Math.random() * 490) / 10) * 10,
    y: Math.ceil((Math.random() * 490) / 10) * 10,
  },
};

io.on("connection", (socket) => {
  console.log(`Socket: ${socket.id}`);

  socket.on("playerLeft", (name) => {
    const updatePlayers = players.filter((player) => player.name != name)
    const players = updatePlayers;
    socket.emit("updatePlayers", players);
    socket.broadcast.emit("updatePlayers", players);
  })
  
  socket.on("playerPoint", () => {
    objective.position.x = Math.ceil((Math.random() * 490) / 10) * 10;
    objective.position.y = Math.ceil((Math.random() * 490) / 10) * 10;
    socket.emit("updatePlayers", players);
    socket.broadcast.emit("updatePlayers", players);
  });

  socket.on("movePlayer", (playerMoving) => {
    const playerMovingIndex = players.findIndex(
      (player) => player.name == playerMoving.name
    );
    players.splice(playerMovingIndex, 1, playerMoving);
    socket.emit("updatePlayers", players);
    socket.broadcast.emit("updatePlayers", players);
  });

  if (players.length > 0) {
    players.push(objective);
    socket.emit("updatePlayers", players);
    socket.broadcast.emit("updatePlayers", players);
  }

  socket.on("newPlayer", (player) => {
    players.push(player);
    socket.emit("updatePlayers", players);
    socket.broadcast.emit("updatePlayers", players);
  });
});


server.listen(port, (err) => err ? console.log(err) : console.log(`Listening on ${port}`));
