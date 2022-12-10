const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
// Score tag
let ScoreEl = document.querySelector("#scoreEl");
canvas.width = innerWidth;
canvas.height = innerHeight;

// Maze
class Boundary {
  static width = 40;
  static height = 40;
  constructor({ position, image }) {
    this.position = position;
    //in pixels
    this.width = 40;
    this.height = 40;
    this.image = image;
  }
  draw() {
    // ctx.fillStyle = "blue";
    // ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    ctx.drawImage(this.image, this.position.x, this.position.y);
  }
}

// Player
class Player {
  constructor({ position, velocity }) {
    this.position = position;

    this.velocity = velocity;
    this.radius = 15;
    this.radians = 0.75;
    this.openrate = 0.12;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(
      this.position.x,
      this.position.y,
      this.radius,
      this.radians,
      Math.PI * 2 - this.radians
    );
    ctx.lineTo(this.position.x, this.position.y);
    ctx.fillStyle = "yellow";
    ctx.fill();
    ctx.closePath();
  }
  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    if (this.radians < 0 || this.radians > 0.75) this.openrate = -this.openrate;
    this.radians += this.openrate;
  }
}

// Ghost
class Ghost {
  static speed = 3;
  constructor({ position, velocity, color = "red" }) {
    this.position = position;
    this.color = color;
    this.velocity = velocity;
    this.prevCollisions = [];
    this.radius = 15;
    this.speed = 3;
    this.scared = false;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.scared ? "blue" : this.color;
    ctx.fill();
    ctx.closePath();
  }
  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}

class Pallet {
  constructor({ position }) {
    this.position = position;
    this.radius = 3;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = "yellow";
    ctx.fill();
    ctx.closePath();
  }
  update() {
    this.draw();
  }
}
class PowerUp {
  constructor({ position }) {
    this.radius = 10;
    this.position = position;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.closePath();
  }
}
// MAZE, Player, Pallets, Map
const map = [
  ["c1", "-", "-", "-", "-", "-", "-", "-", "-", "-", "c2"],
  ["|", " ", ".", ".", ".", ".", ".", ".", ".", ".", "|"],
  ["|", ".", "b", ".", "cl", "pcb", "cr", ".", "b", ".", "|"],
  ["|", ".", ".", ".", ".", "cb", ".", ".", ".", ".", "|"],
  ["|", ".", "cl", "cr", ".", ".", ".", "cl", "cr", ".", "|"],
  ["|", ".", ".", ".", ".", "ct", ".", ".", ".", ".", "|"],
  ["|", ".", "ct", ".", "cl", "pct", "cr", ".", "ct", ".", "|"],
  ["|", ".", "cb", ".", ".", ".", ".", ".", "cb", ".", "|"],
  ["|", "p", ".", ".", "b", "p", "b", ".", ".", ".", "|"],
  ["|", ".", "ct", ".", ".", ".", ".", ".", "ct", ".", "|"],
  ["|", ".", "pv", ".", "cl", "ph", "cr", ".", "pv", ".", "|"],
  ["|", ".", "cb", ".", ".", ".", ".", ".", "cb", ".", "|"],
  ["|", ".", ".", ".", ".", "ct", ".", ".", ".", ".", "|"],
  ["|", ".", "c1", "c2", ".", "pv", ".", "c1", "c2", ".", "|"],
  ["|", ".", "c4", "c3", ".", "cb", ".", "c4", "c3", "p", "|"],
  ["|", ".", ".", ".", ".", ".", ".", ".", ".", ".", "|"],
  ["c4", "-", "-", "-", "-", "-", "-", "-", "-", "-", "c3"],
];
const Pallets = [];
const boundaries = [];
const PowerUps = [];
const ghosts = [
  new Ghost({
    position: {
      x: Boundary.width * 8.5 + Boundary.width / 2,
      y: Boundary.height + Boundary.height / 2,
    },
    velocity: {
      x: Ghost.speed,
      y: 0,
    },
    color: "#0FFFFF",
  }),
  // new Ghost({
  //   position: {
  //     x: Boundary.width * 8 + Boundary.width / 2,
  //     y: Boundary.height + Boundary.height / 2,
  //   },
  //   velocity: {
  //     x: Ghost.speed,
  //     y: 0,
  //   },
  //   color: "#AA336A",
  // }),
  // new Ghost({
  //   position: {
  //     x: Boundary.width + Boundary.width / 2,
  //     y: Boundary.height * 12 + Boundary.height / 2,
  //   },
  //   velocity: {
  //     x: Ghost.speed,
  //     y: 0,
  //   },
  //   color: "#e49537",
  // }),
];
function createImage(src) {
  const image = new Image();
  image.src = src;
  return image;
}
map.forEach((row, i) => {
  row.forEach((symbol, j) => {
    switch (symbol) {
      case "-":
        boundaries.push(
          new Boundary({
            position: { x: j * 40, y: i * 40 },
            image: createImage("./assets/pipeHorizontal.png"),
          })
        );
        break;

      case "|":
        boundaries.push(
          new Boundary({
            position: { x: j * 40, y: i * 40 },
            image: createImage("./assets/pipeVertical.png"),
          })
        );
        break;
      case "c1":
        boundaries.push(
          new Boundary({
            position: { x: j * 40, y: i * 40 },
            image: createImage("./assets/pipeCorner1.png"),
          })
        );
        break;
      case "c2":
        boundaries.push(
          new Boundary({
            position: { x: j * 40, y: i * 40 },
            image: createImage("./assets/pipeCorner2.png"),
          })
        );
        break;
      case "c3":
        boundaries.push(
          new Boundary({
            position: { x: j * 40, y: i * 40 },
            image: createImage("./assets/pipeCorner3.png"),
          })
        );
        break;
      case "c4":
        boundaries.push(
          new Boundary({
            position: { x: j * 40, y: i * 40 },
            image: createImage("./assets/pipeCorner4.png"),
          })
        );
        break;
      case "b":
        boundaries.push(
          new Boundary({
            position: { x: j * 40, y: i * 40 },
            image: createImage("./assets/block.png"),
          })
        );
        break;
      case "cl":
        boundaries.push(
          new Boundary({
            position: { x: j * 40, y: i * 40 },
            image: createImage("./assets/capLeft.png"),
          })
        );
        break;
      case "cr":
        boundaries.push(
          new Boundary({
            position: { x: j * 40, y: i * 40 },
            image: createImage("./assets/capRight.png"),
          })
        );
        break;
      case "ct":
        boundaries.push(
          new Boundary({
            position: { x: j * 40, y: i * 40 },
            image: createImage("./assets/capTop.png"),
          })
        );
        break;
      case "cb":
        boundaries.push(
          new Boundary({
            position: { x: j * 40, y: i * 40 },
            image: createImage("./assets/capBottom.png"),
          })
        );
        break;
      case "ph":
        boundaries.push(
          new Boundary({
            position: { x: j * 40, y: i * 40 },
            image: createImage("./assets/pipehorizontal.png"),
          })
        );
        break;
      case "pv":
        boundaries.push(
          new Boundary({
            position: { x: j * 40, y: i * 40 },
            image: createImage("./assets/pipeVertical.png"),
          })
        );
        break;
      case "pcb":
        boundaries.push(
          new Boundary({
            position: { x: j * 40, y: i * 40 },
            image: createImage("./assets/pipeConnectorBottom.png"),
          })
        );
        break;
      case "pct":
        boundaries.push(
          new Boundary({
            position: { x: j * 40, y: i * 40 },
            image: createImage("./assets/pipeConnectorTop.png"),
          })
        );
        break;
      case "px":
        boundaries.push(
          new Boundary({
            position: { x: j * 40, y: i * 40 },
            image: createImage("./assets/pipeCross.png"),
          })
        );
        break;
      case ".":
        Pallets.push(
          new Pallet({
            position: {
              x: j * Boundary.width + Boundary.width / 2,
              y: i * Boundary.height + Boundary.height / 2,
            },
          })
        );
        break;
      case "p":
        PowerUps.push(
          new PowerUp({
            position: {
              x: j * Boundary.width + Boundary.width / 2,
              y: i * Boundary.height + Boundary.height / 2,
            },
          })
        );
        break;
    }
  });
});

const player = new Player({
  position: {
    x: Boundary.width + Boundary.width / 2,
    y: Boundary.height + Boundary.height / 2,
  },
  velocity: { x: 0, y: 0 },
});

const Keys = {
  w: {
    pressed: false,
  },
  a: {
    pressed: false,
  },
  s: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
};
let lastKey = "";
const circleCollidesWithRectangle = ({ cirlce, rectangle }) => {
  const padding = Boundary.width / 2 - cirlce.radius - 2;
  return (
    cirlce.position.y - cirlce.radius + cirlce.velocity.y <=
      rectangle.position.y + rectangle.height + padding &&
    cirlce.position.x + cirlce.radius + cirlce.velocity.x >=
      rectangle.position.x - padding &&
    cirlce.position.y + cirlce.radius + cirlce.velocity.y >=
      rectangle.position.y - padding &&
    cirlce.position.x - cirlce.radius + cirlce.velocity.x <=
      rectangle.position.x + rectangle.width + padding
  );
};
let SCORE = 0;
let animateId;
// ANIMATE FRAME
const animate = () => {
  animateId = requestAnimationFrame(animate);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // WINNING condition
  if (Pallets.length === 0) {
    cancelAnimationFrame(animateId);
    console.log("you win!");
  }
  // Rendering powerUp, looping them backwards to avoid flickers.
  for (let i = PowerUps.length - 1; i >= 0; i--) {
    const powerup = PowerUps[i];
    powerup.draw();
    if (
      Math.hypot(
        powerup.position.x - player.position.x,
        powerup.position.y - player.position.y
      ) <=
      powerup.radius + player.radius
    ) {
      PowerUps.splice(i, 1);
      // Make ghosts scared
      ghosts.forEach((ghost) => {
        ghost.scared = true;
      });
      setTimeout(() => {
        ghosts.forEach((ghost) => {
          ghost.scared = false;
        });
      }, 3000);
    }
  }

  if (Keys.w.pressed && lastKey == "w") {
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        circleCollidesWithRectangle({
          cirlce: {
            ...player,
            velocity: {
              x: 0,
              y: -3,
            },
          },
          rectangle: boundary,
        })
      ) {
        player.velocity.y = 0;
        break;
      } else {
        player.velocity.y = -3;
      }
    }
  } else if (Keys.a.pressed && lastKey == "a") {
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        circleCollidesWithRectangle({
          cirlce: {
            ...player,
            velocity: {
              x: -3,
              y: 0,
            },
          },
          rectangle: boundary,
        })
      ) {
        player.velocity.x = 0;
        break;
      } else {
        player.velocity.x = -3;
      }
    }
  } else if (Keys.s.pressed && lastKey == "s") {
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        circleCollidesWithRectangle({
          cirlce: {
            ...player,
            velocity: {
              x: 0,
              y: 3,
            },
          },
          rectangle: boundary,
        })
      ) {
        player.velocity.y = 0;
        break;
      } else {
        player.velocity.y = 3;
      }
    }
  } else if (Keys.d.pressed && lastKey == "d") {
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        circleCollidesWithRectangle({
          cirlce: {
            ...player,
            velocity: {
              x: 3,
              y: 0,
            },
          },
          rectangle: boundary,
        })
      ) {
        player.velocity.x = 0;
        break;
      } else {
        player.velocity.x = 3;
      }
    }
  }
  // Rendering Pallets.
  for (let i = Pallets.length - 1; 0 <= i; i--) {
    let pallet = Pallets[i];
    pallet.draw();
    if (
      Math.hypot(
        pallet.position.x - player.position.x,
        pallet.position.y - player.position.y
      ) <
      player.radius + pallet.radius
    ) {
      Pallets.splice(i, 1);
      SCORE += 10;
      ScoreEl.innerHTML = SCORE;
    }
  }

  // Rendering boundaries
  boundaries.forEach((boundery) => {
    boundery.draw();
    if (circleCollidesWithRectangle({ cirlce: player, rectangle: boundery })) {
      player.velocity.x = 0;
      player.velocity.y = 0;
    }
  });
  player.update();
  // rendering ghosts
  ghosts.forEach((ghost) => {
    ghost.update();
    if (
      !ghost.scared &&
      Math.hypot(
        ghost.position.x - player.position.x,
        ghost.position.y - player.position.y
      ) <=
        ghost.radius + player.radius
    ) {
      cancelAnimationFrame(animateId);
    }
    const collisions = [];
    boundaries.forEach((boundary) => {
      // Checking collisions
      if (
        !collisions.includes("up") &&
        circleCollidesWithRectangle({
          cirlce: {
            ...ghost,
            velocity: {
              x: 0,
              y: -Ghost.speed,
            },
          },
          rectangle: boundary,
        })
      ) {
        collisions.push("up");
      }

      if (
        !collisions.includes("down") &&
        circleCollidesWithRectangle({
          cirlce: {
            ...ghost,
            velocity: {
              x: 0,
              y: Ghost.speed,
            },
          },
          rectangle: boundary,
        })
      ) {
        collisions.push("down");
      }

      if (
        !collisions.includes("left") &&
        circleCollidesWithRectangle({
          cirlce: {
            ...ghost,
            velocity: {
              x: -Ghost.speed,
              y: 0,
            },
          },
          rectangle: boundary,
        })
      ) {
        collisions.push("left");
      }

      if (
        !collisions.includes("right") &&
        circleCollidesWithRectangle({
          cirlce: {
            ...ghost,
            velocity: {
              x: Ghost.speed,
              y: 0,
            },
          },
          rectangle: boundary,
        })
      ) {
        collisions.push("right");
      }
    });
    // If collisions now are less (ie. collisions.length < ghost.prevCollions.length will be true) then we know some extra path or direction have opened up.
    if (collisions.length > ghost.prevCollisions.length) {
      ghost.prevCollisions = collisions;
    }
    let pathWays = [];
    if (JSON.stringify(collisions) !== JSON.stringify(ghost.prevCollisions)) {
      // If we don't execute this if-else ladder here then our ghost will always take turn into a new direction everytime,rather than sometimes continueing the one that it is already travelling on.
      if (ghost.velocity.x > 0) {
        ghost.prevCollisions.push("right");
      } else if (ghost.velocity.x < 0) {
        ghost.prevCollisions.push("left");
      } else if (ghost.velocity.y > 0) {
        ghost.prevCollisions.push("down");
      } else if (ghost.velocity.y < 0) {
        ghost.prevCollisions.push("up");
      }
      pathWays = ghost.prevCollisions.filter((collision) => {
        return !collisions.includes(collision);
      });
      const direction = pathWays[Math.floor(Math.random() * pathWays.length)];
      switch (direction) {
        case "left":
          ghost.velocity.y = 0;
          ghost.velocity.x = -ghost.speed;
          break;
        case "right":
          ghost.velocity.y = 0;
          ghost.velocity.x = ghost.speed;
          break;
        case "up":
          ghost.velocity.y = -ghost.speed;
          ghost.velocity.x = 0;
          break;
        case "down":
          ghost.velocity.y = ghost.speed;
          ghost.velocity.x = 0;
          break;
      }
      ghost.prevCollisions = [];
    }
  });
};
player.draw();

// Player movement event listeners.
addEventListener("keydown", ({ key }) => {
  switch (key) {
    case "w":
    case "ArrowUp":
      Keys.w.pressed = true;
      lastKey = "w";
      break;
    case "s":
    case "ArrowDown":
      Keys.s.pressed = true;
      lastKey = "s";
      break;
    case "a":
    case "ArrowLeft":
      Keys.a.pressed = true;
      lastKey = "a";
      break;
    case "d":
    case "ArrowRight":
      Keys.d.pressed = true;
      lastKey = "d";
      break;
  }
});

addEventListener("keyup", ({ key }) => {
  switch (key) {
    case "ArrowUp":
    case "w":
      Keys.w.pressed = false;
      break;
    case "ArrowDown":
    case "s":
      Keys.s.pressed = false;
      break;
    case "ArrowLeft":
    case "a":
      Keys.a.pressed = false;
      break;
    case "ArrowRight":
    case "d":
      Keys.d.pressed = false;
      break;
  }
});

animate();
