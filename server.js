require('dotenv').config()
const express = require("express");
const port = process.env.APP_URL || 3333;
const cors = require('cors')

const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: process.env.FRONT_APP_URL,
    methods: ["GET", "POST"],
  },
});

app.use(cors())

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

  socket.on("newPlayer", (player) => {
    if (players.length > 0) {
      players.push(objective);
      socket.emit("updatePlayers", players);
      socket.broadcast.emit("updatePlayers", players);
    }

    socket.on("playerPoint", () => {
      objective.position.x = Math.ceil((Math.random() * 490) / 10) * 10;
      objective.position.y = Math.ceil((Math.random() * 490) / 10) * 10;
      socket.emit("updatePlayers", players);
      socket.broadcast.emit("updatePlayers", players);
    });

    players.push(player);
    socket.emit("updatePlayers", players);
    socket.broadcast.emit("updatePlayers", players);

    socket.on("movePlayer", (playerMoving) => {
      const playerMovingIndex = players.findIndex(
        (player) => player.name == playerMoving.name
      );
      players.splice(playerMovingIndex, 1, playerMoving);
      socket.emit("updatePlayers", players);
      socket.broadcast.emit("updatePlayers", players);
    });
  });
});

server.listen(port, (err) => err ? console.log(err) : console.log(`Listening on ${port}`));
