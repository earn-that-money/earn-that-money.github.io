const board = document.getElementById('board');
const slotsLeft = document.getElementById('slots-left');
const slotsRight = document.getElementById('slots-right');

// Slot data with multipliers
const slotData = [
  { color: 'gold', multiplier: 5 },
  { color: 'orange', multiplier: 3 },
  { color: 'green', multiplier: 2 },
  { color: 'blue', multiplier: 1 },
  { color: 'purple', multiplier: 4 },
  { color: 'gray', multiplier: 0.5 }
];

// Generate slots
[slotsLeft, slotsRight].forEach(slots => {
  slotData.forEach(slot => {
    const div = document.createElement('div');
    div.className = `slot ${slot.color}`;
    div.innerText = slot.multiplier + 'x';
    slots.appendChild(div);
  });
});

// Generate pegs
const pegRows = 7;
const pegCols = 8;
const pegSpacingX = board.offsetWidth / pegCols;
const pegSpacingY = board.offsetHeight / pegRows;

for (let row = 0; row < pegRows; row++) {
  for (let col = 0; col < pegCols; col++) {
    const peg = document.createElement('div');
    peg.className = 'peg';
    peg.style.left = `${col * pegSpacingX + (row % 2) * pegSpacingX / 2}px`;
    peg.style.top = `${row * pegSpacingY}px`;
    board.appendChild(peg);
  }
}

// Drop a ball
document.getElementById('drop-ball').addEventListener('click', () => {
  const ball = document.createElement('div');
  ball.className = 'ball';
  board.appendChild(ball);

  let x = Math.random() * (board.offsetWidth - 14);
  let y = 0;
  let vx = 0;
  let vy = 2;

  const interval = setInterval(() => {
    y += vy;
    x += vx;

    // Simple peg interaction: random horizontal bump
    const pegs = document.querySelectorAll('.peg');
    pegs.forEach(peg => {
      const pegRect = peg.getBoundingClientRect();
      const ballRect = ball.getBoundingClientRect();
      if (
        ballRect.left < pegRect.right &&
        ballRect.right > pegRect.left &&
        ballRect.top < pegRect.bottom &&
        ballRect.bottom > pegRect.top
      ) {
        vx = (Math.random() - 0.5) * 4;
      }
    });

    // Keep ball inside board
    if (x < 0) x = 0;
    if (x > board.offsetWidth - 14) x = board.offsetWidth - 14;

    ball.style.top = y + 'px';
    ball.style.left = x + 'px';

    // Stop at bottom and determine slot
    if (y >= board.offsetHeight - 14) {
      clearInterval(interval);
      const slotIndex = Math.floor(x / (board.offsetWidth / slotData.length));
      const landingSlot = slotData[slotIndex];
      alert(`Ball landed in ${landingSlot.color} slot! Multiplier: ${landingSlot.multiplier}x`);
      board.removeChild(ball);
    }
  }, 20);
});
