const tela = document.getElementById("tela");
const context = tela.getContext("2d");
let socket = io("http://localhost:3000");
const user = document.getElementById("user");

tela.width = 500;
tela.height = 500;

socket.on("updatePlayers", (updatePlayers) => {
  const objective = updatePlayers.find((player) => player.name == "objective");
  if (objective) {
    players.forEach((player) => {
      if (
        player.position.x == objective.position.x &&
        player.position.y == objective.position.y
      ) {
        console.log("oi");
      }
    });
  }

  context.clearRect(0, 0, tela.width, tela.height);
  updatePlayers.forEach((player) => {
    const playerUpdate = new Player({
      x: player.position.x,
      y: player.position.y,
    });

    playerUpdate.draw();
  });
});

class Player {
  constructor(position) {
    this.position = position;
  }

  draw() {
    context.fillRect(this.position.x, this.position.y, 10, 10);
  }

  toTop() {
    if (this.position.y > 0) {
      this.position.y = this.position.y - 10;
      socket.emit("movePlayer", {
        name: user.value,
        position: this.position,
      });
    }
  }
  toBottom() {
    if (this.position.y < 490) {
      this.position.y = this.position.y + 10;
      socket.emit("movePlayer", {
        name: user.value,
        position: this.position,
      });
    }
  }
  toRight() {
    if (this.position.x < 490) {
      this.position.x = this.position.x + 10;
      socket.emit("movePlayer", {
        name: user.value,
        position: this.position,
      });
    }
  }
  toLeft() {
    if (this.position.x > 0) {
      this.position.x = this.position.x - 10;
      socket.emit("movePlayer", {
        name: user.value,
        position: this.position,
      });
    }
  }
}

const player = new Player({
  y: Math.ceil((Math.random() * 490) / 10) * 10,
  x: Math.ceil((Math.random() * 490) / 10) * 10,
});

document.getElementById("new-player").addEventListener("click", (e) => {
  if (user.value !== "") {
    e.preventDefault();

    socket.emit("newPlayer", {
      name: user.value,
      position: player.position,
    });

    window.addEventListener("keypress", (e) => {
      switch (e.key) {
        case "w":
          player.toTop();
          break;
        case "s":
          player.toBottom();
          break;
        case "d":
          player.toRight();
          break;
        case "a":
          player.toLeft();
          break;

        default:
          break;
      }
    });
  }
});
