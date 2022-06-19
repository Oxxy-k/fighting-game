const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const timer = document.querySelector("#timer");

canvas.width = 1024;
canvas.height = 576;

ctx.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;
let ininitialTimer = 60;
let timerId;

timer.innerHTML = ininitialTimer;

const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
};

const shop = new Sprite({
  position: {
    x: 600,
    y: 130,
  },
  imageSrc: "./img/shop.png",
  scale: 2.75,
  cropCount: 6,
});

const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: "./img/background.png",
});

const player = new Fighter({
  position: {
    x: 0,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  offset: {
    x: 0,
    y: 0,
  },
  imageSrc: "./img/samuraiMack/Idle.png",
  scale: 2.5,
  cropCount: 8,
  offset: { x: 180, y: 157 },
  sprites: {
    idie: {
      imageSrc: "./img/samuraiMack/Idle.png",
      cropCount: 8,
    },
    run: {
      imageSrc: "./img/samuraiMack/Run.png",
      cropCount: 8,
    },
    jump: {
      imageSrc: "./img/samuraiMack/Jump.png",
      cropCount: 2,
    },
    fall: {
      imageSrc: "./img/samuraiMack/Fall.png",
      cropCount: 2,
    },
    attack1: {
      imageSrc: "./img/samuraiMack/Attack1.png",
      cropCount: 6,
    },
    takeHit: {
      imageSrc: "./img/samuraiMack/Take Hit - white silhouette.png",
      cropCount: 4,
    },
    death: {
      imageSrc: "./img/samuraiMack/Death.png",
      cropCount: 6,
    },
  },
  attackBox: {
    offset: {
      x: 90,
      y: 50,
    },
    width: 160,
    height: 50,
  },
});

const enemy = new Fighter({
  position: {
    x: 400,
    y: 100,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  offset: {
    x: -50,
    y: 0,
  },
  imageSrc: "./img/kenji/Idle.png",
  scale: 2.5,
  cropCount: 4,
  offset: { x: 180, y: 170 },
  sprites: {
    idie: {
      imageSrc: "./img/kenji/Idle.png",
      cropCount: 4,
    },
    run: {
      imageSrc: "./img/kenji/Run.png",
      cropCount: 8,
    },
    jump: {
      imageSrc: "./img/kenji/Jump.png",
      cropCount: 2,
    },
    fall: {
      imageSrc: "./img/kenji/Fall.png",
      cropCount: 2,
    },
    attack1: {
      imageSrc: "./img/kenji/Attack1.png",
      cropCount: 4,
    },
    takeHit: {
      imageSrc: "./img/kenji/Take hit.png",
      cropCount: 3,
    },
    death: {
      imageSrc: "./img/kenji/Death.png",
      cropCount: 7,
    },
  },
  attackBox: {
    offset: {
      x: -170,
      y: 50,
    },
    width: 175,
    height: 50,
  },
});

enemy.draw();
player.draw();

function animate() {
  window.requestAnimationFrame(animate);
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  background.update();
  shop.update();
  ctx.fillStyle = "rgba(255, 255, 255, 0.12)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  player.update();
  enemy.update();

  player.velocity.x = 0;
  enemy.velocity.x = 0;

  //enemy movement
  if (keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight") {
    enemy.velocity.x = 5;
    enemy.switchSprite("run");
  } else if (keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
    enemy.velocity.x = -5;
    enemy.switchSprite("run");
  } else {
    enemy.switchSprite("idie");
  }

  //enemy jumping
  if (enemy.velocity.y < 0) {
    enemy.switchSprite("jump");
  } else if (enemy.velocity.y > 0) {
    enemy.switchSprite("fall");
  }

  //player movement
  if (keys.d.pressed && player.lastKey === "d") {
    player.velocity.x = 5;
    player.switchSprite("run");
  } else if (keys.a.pressed && player.lastKey === "a") {
    player.velocity.x = -5;
    player.switchSprite("run");
  } else {
    player.switchSprite("idie");
  }

  //player jumping
  if (player.velocity.y < 0) {
    player.switchSprite("jump");
  } else if (player.velocity.y > 0) {
    player.switchSprite("fall");
  }

  //detect for collision
  if (
    isPlayersCollision({ playerOne: player, playerTwo: enemy }) &&
    player.isAttacking &&
    player.countFrames === 4
  ) {
    player.isAttacking = false;
    enemy.takeHit();

    gsap.to("#enemyHealth", {
      width: `${enemy.health}%`,
    });
  }

  if (
    isPlayersCollision({ playerOne: enemy, playerTwo: player }) &&
    enemy.isAttacking &&
    enemy.countFrames === 2
  ) {
    enemy.isAttacking = false;
    player.takeHit();

    gsap.to("#playerHealth", {
      width: `${player.health}%`,
    });
  }

  if (enemy.health <= 0 || player.health <= 0) {
    determinateGame({ enemy, player, timerId });
  }

  //player missing
  if (player.isAttacking && player.countFrames === 4) {
    player.isAttacking = false;
  }

  //enemy missing
  if (enemy.isAttacking && enemy.countFrames === 2) {
    enemy.isAttacking = false;
  }
}

animate();

window.addEventListener("keydown", (event) => {
  if (!player.isDead) {
    switch (event.key) {
      case "d":
        keys.d.pressed = true;
        player.lastKey = "d";
        break;
      case "a":
        keys.a.pressed = true;
        player.lastKey = "a";
        break;
      case "w":
        if (player.position.y + player.height >= canvas.height - 96) {
          player.velocity.y = -20;
        }
        break;
      case " ":
        player.attack();
        break;
    }
  }

  if (!enemy.isDead) {
    switch (event.key) {
      case "ArrowRight":
        keys.ArrowRight.pressed = true;
        enemy.lastKey = "ArrowRight";
        break;
      case "ArrowLeft":
        keys.ArrowLeft.pressed = true;
        enemy.lastKey = "ArrowLeft";
        break;
      case "ArrowUp":
        if (enemy.position.y + enemy.height >= canvas.height - 96) {
          enemy.velocity.y = -20;
        }
        break;
      case "ArrowDown":
        enemy.attack();
        break;
    }
  }
});

window.addEventListener("keyup", (event) => {
  switch (event.key) {
    case "d":
      keys.d.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;
    case "ArrowRight":
      keys.ArrowRight.pressed = false;
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = false;
      break;
  }
});

decreaseTimer();
