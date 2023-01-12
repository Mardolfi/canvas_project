const express = require("express");
const path = require("path");
const cors = require('cors')

const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

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

app.use(express.static(path.resolve(__dirname, "public")));

server.listen(3000, (err) =>
  err ? console.log(err) : console.log("Listening on 3000")
);
