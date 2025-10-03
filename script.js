function placeBet() {
  betAmount = parseFloat(betAmountInput.value);
  if (betAmount <= 0 || betAmount > balance) {
    alert('Indsæt et gyldigt beløb op til din saldo!');
    return;
  }

  balance -= betAmount;
  updateBalance();

  let totalWin = 0;
  let finishedBalls = 0;

  for (let i = 0; i < ballsAtOnce; i++) {
    const slotIndex = simulateDrop();
    const multiplier = slotMultipliers[slotIndex] || 0;
    totalWin += betAmount * multiplier;

    const ball = document.createElement('div');
    ball.classList.add('ball');
    board.appendChild(ball);

    const path = calculatePath(slotIndex);
    animateBallDrop(ball, path, () => {
      ball.remove();
      finishedBalls++;
      if (finishedBalls === ballsAtOnce) {
        balance += totalWin;
        updateBalance();
        alert(`Du vandt $${totalWin.toFixed(2)} på denne runde!`);
      }
    });
  }
}
