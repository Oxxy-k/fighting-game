const isPlayersCollision = ({ playerOne, playerTwo }) => {
  return (
    playerOne.attackBox.position.x + playerOne.attackBox.width >=
      playerTwo.position.x &&
    playerOne.attackBox.position.x <= playerTwo.position.x + playerTwo.width &&
    playerOne.attackBox.position.y + playerOne.attackBox.heigth >=
      playerTwo.position.y &&
    playerOne.attackBox.position.y <= playerTwo.height + playerTwo.position.y
  );
};

const determinateGame = ({ player, enemy, timerId }) => {
  clearTimeout(timerId);
  const resultMessage = document.querySelector("#resultMessage");
  resultMessage.style.display = "flex";

  if (enemy.health === player.health) {
    resultMessage.innerHTML = "Time is over!";
  } else if (enemy.health > player.health) {
    resultMessage.innerHTML = "Player Two Win!";
  } else if (enemy.health < player.health) {
    resultMessage.innerHTML = "Player One Win!";
  }
};

const decreaseTimer = () => {
  if (ininitialTimer > 0) {
    timerId = setTimeout(decreaseTimer, 1000);
    ininitialTimer--;
  }
  timer.innerHTML = ininitialTimer;

  if (!ininitialTimer) {
    determinateGame({ player, enemy, timerId });
  }
};
