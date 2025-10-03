document.addEventListener("DOMContentLoaded", () => {
  // Game data
  let rows = 7;
  let ballsAtOnce = 1;
  let centerBias = 50;
  let balance = 100;
  let betAmount = 1;

  // Elements
  const rowsRange = document.getElementById('rowsRange');
  const ballsAtOnceRange = document.getElementById('ballsAtOnceRange');
  const centerBiasRange = document.getElementById('centerBiasRange');
  const betAmountInput = document.getElementById('betAmountInput');
  const betButton = document.getElementById('betButton');
  const balanceEl = document.getElementById('balance');
  const board = document.getElementById('board');
  const slotsLeft = document.getElementById('slots-left');
  const slotsRight = document.getElementById('slots-right');

  // Multipliers
  const slotMultipliers = [10, 5, 2, 2, 1, 0.5, 0.25];
  const slotLabels = ['10x', '5x', '2x', '2x', '1x', '0.5x', '0.25x'];
  const slotColors = ['gold', 'orange', 'green', 'green', 'blue', 'purple', 'gray'];

  function updateBalance() {
    balanceEl.textContent = `Balance: $${balance.toFixed(2)}`;
  }

  function drawPegs() {
    board.innerHTML = '';
    const pegSpacingX = 50;
    const pegSpacingY = 45;
    const boardWidth = 400;

    for (let r = 0; r < rows; r++) {
      const numPegs = r + 1;
      const offsetX = (boardWidth - pegSpacingX * numPegs) / 2;
      for (let c = 0; c < numPegs; c++) {
        const peg = document.createElement('div');
        peg.classList.add('peg');
        peg.style.top = (r * pegSpacingY) + 'px';
        peg.style.left = (offsetX + c * pegSpacingX) + 'px';
        board.appendChild(peg);
      }
    }
  }

  function drawSlots() {
    slotsLeft.innerHTML = '';
    slotsRight.innerHTML = '';
    for (let i = 0; i < slotMultipliers.length; i++) {
      const slotLeft = document.createElement('div');
      slotLeft.classList.add('slot', slotColors[i]);
      slotLeft.textContent = slotLabels[i];

      const slotRight = document.createElement('div');
      slotRight.classList.add('slot', slotColors[i]);
      slotRight.textContent = slotLabels[i];

      slotsLeft.appendChild(slotLeft);
      slotsRight.appendChild(slotRight);
    }
  }

  function simulateDrop() {
    let position = Math.floor(rows / 2);
    for (let i = 0; i < rows; i++) {
      if (position <= 0) position++;
      else if (position >= rows - 1) position--;
      else {
        const moveLeftProb = centerBias / 100;
        position += Math.random() < moveLeftProb ? -1 : 1;
      }
    }
    return position;
  }

  function animateBallDrop(ball, pathPositions, callback) {
    let i = 0;
    function step() {
      if (i < pathPositions.length) {
        ball.style.top = pathPositions[i].top + 'px';
        ball.style.left = pathPositions[i].left + 'px';
        i++;
        setTimeout(step, 120);
      } else {
        callback();
      }
    }
    step();
  }

  function calculatePath(slotIndex) {
    const pegSpacingX = 50;
    const pegSpacingY = 45;
    const boardWidth = 400;

    let path = [];
    let pos = Math.floor(rows / 2);

    for (let r = 0; r < rows; r++) {
      const numPegs = r + 1;
      const offsetX = (boardWidth - pegSpacingX * numPegs) / 2;
      let x;

      if (r === rows - 1) {
        x = offsetX + slotIndex * pegSpacingX - pegSpacingX / 2;
      } else {
        x = offsetX + pos * pegSpacingX;
      }

      let y = r * pegSpacingY + 15;
      path.push({ top: y, left: x });

      if (r < rows - 1) {
        if (pos <= 0) pos++;
        else if (pos >= rows - 1) pos--;
        else {
          const moveLeftProb = centerBias / 100;
          pos += Math.random() < moveLeftProb ? -1 : 1;
        }
      }
    }
    return path;
  }

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
          alert(`Du vandt $${t
