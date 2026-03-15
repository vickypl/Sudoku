const DIGITS = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const CLUES = {
  easy: [36, 45],
  medium: [27, 35],
  hard: [22, 26],
  expert: [17, 21]
};

const boardEl = document.getElementById('board');
const digitsEl = document.getElementById('digits');
const messageEl = document.getElementById('message');
const timerEl = document.getElementById('timer');
const difficultyEl = document.getElementById('difficulty');
const notesBtn = document.getElementById('notesToggle');
const themeSelectEl = document.getElementById('themeSelect');

let selected = null;
let noteMode = false;
let puzzle = null;
let state = null;
let timer = null;
let elapsed = 0;


function applyTheme(theme) {
  document.body.setAttribute('data-theme', theme);
  localStorage.setItem('sudoku-theme', theme);
}

const initialTheme = localStorage.getItem('sudoku-theme') || 'ocean';
if (themeSelectEl) {
  themeSelectEl.value = initialTheme;
  themeSelectEl.addEventListener('change', (e) => applyTheme(e.target.value));
}
applyTheme(initialTheme);


const rowOf = (i) => Math.floor(i / 9);
const colOf = (i) => i % 9;
const boxOf = (i) => Math.floor(rowOf(i) / 3) * 3 + Math.floor(colOf(i) / 3);

const peersOf = (index) => {
  const r = rowOf(index);
  const c = colOf(index);
  const b = boxOf(index);
  const peers = [];
  for (let i = 0; i < 81; i += 1) {
    if (i === index) continue;
    if (rowOf(i) === r || colOf(i) === c || boxOf(i) === b) peers.push(i);
  }
  return peers;
};

const isValid = (board, index, digit) => peersOf(index).every((p) => board[p] !== digit);

const shuffled = (arr) => {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
};

const fillBoard = (board) => {
  const empty = board.findIndex((v) => v === null);
  if (empty === -1) return true;
  for (const digit of shuffled(DIGITS)) {
    if (!isValid(board, empty, digit)) continue;
    board[empty] = digit;
    if (fillBoard(board)) return true;
    board[empty] = null;
  }
  return false;
};

const countSolutions = (board, max = 2) => {
  const empty = board.findIndex((v) => v === null);
  if (empty === -1) return 1;
  let total = 0;
  for (const digit of DIGITS) {
    if (!isValid(board, empty, digit)) continue;
    board[empty] = digit;
    total += countSolutions(board, max);
    board[empty] = null;
    if (total >= max) return total;
  }
  return total;
};

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

function generatePuzzle(difficulty) {
  const solution = Array(81).fill(null);
  fillBoard(solution);

  const givens = [...solution];
  const [min, max] = CLUES[difficulty] || CLUES.easy;
  const targetClues = randomInt(min, max);

  for (const i of shuffled([...Array(81).keys()])) {
    const cluesLeft = givens.filter(Boolean).length;
    if (cluesLeft <= targetClues) break;
    const prev = givens[i];
    givens[i] = null;
    if (countSolutions([...givens], 2) !== 1) givens[i] = prev;
  }

  return { solution, givens };
}

function createGame() {
  puzzle = generatePuzzle(difficultyEl.value);
  state = puzzle.givens.map((value) => ({
    value,
    given: value !== null,
    notes: new Set(),
    error: false
  }));
  selected = null;
  elapsed = 0;
  startTimer();
  render();
  message('New game started.');
}

function formatTime(ms) {
  const total = Math.floor(ms / 1000);
  const mm = String(Math.floor(total / 60)).padStart(2, '0');
  const ss = String(total % 60).padStart(2, '0');
  return `${mm}:${ss}`;
}

function startTimer() {
  if (timer) clearInterval(timer);
  timer = setInterval(() => {
    elapsed += 1000;
    timerEl.textContent = formatTime(elapsed);
  }, 1000);
}

function message(text) {
  messageEl.textContent = text;
}

function validateState() {
  state.forEach((c) => (c.error = false));
  state.forEach((cell, i) => {
    if (!cell.value) return;
    if (peersOf(i).some((p) => state[p].value === cell.value)) cell.error = true;
  });
}

function isComplete() {
  return state.every((c) => c.value) && state.every((c) => !c.error);
}

function handleDigit(digit) {
  if (selected === null) return;
  const cell = state[selected];
  if (cell.given) return;

  if (noteMode) {
    if (cell.notes.has(digit)) cell.notes.delete(digit);
    else cell.notes.add(digit);
    message(`Note ${digit} ${cell.notes.has(digit) ? 'added' : 'removed'}.`);
  } else {
    cell.value = digit;
    cell.notes.clear();
    validateState();
    if (cell.value !== puzzle.solution[selected]) message('Wrong placement.');
    else message('Good move.');
    if (isComplete()) {
      clearInterval(timer);
      message('🎉 Completed! Great job.');
    }
  }
  render();
}

function handleErase() {
  if (selected === null) return;
  const cell = state[selected];
  if (cell.given) return;
  cell.value = null;
  cell.notes.clear();
  validateState();
  render();
}

function handleHint() {
  if (selected === null) return;
  const cell = state[selected];
  if (cell.given) return;
  cell.value = puzzle.solution[selected];
  cell.notes.clear();
  validateState();
  render();
  message('Hint used.');
}

function cellClass(index) {
  const classes = ['cell'];
  const cell = state[index];
  if (cell.given) classes.push('given');
  if (cell.error) classes.push('error');
  if (selected === index) classes.push('selected');
  if (selected !== null && peersOf(selected).includes(index)) classes.push('peer');
  const selectedVal = selected !== null ? state[selected].value : null;
  if (selectedVal && cell.value === selectedVal) classes.push('same');
  return classes.join(' ');
}

function render() {
  boardEl.innerHTML = '';
  state.forEach((cell, i) => {
    const btn = document.createElement('button');
    btn.className = cellClass(i);
    btn.type = 'button';
    btn.textContent = cell.value ?? '';
    btn.setAttribute('aria-label', `Cell ${i + 1}`);
    btn.addEventListener('click', () => {
      selected = i;
      render();
    });
    boardEl.appendChild(btn);
  });

  digitsEl.innerHTML = '';
  DIGITS.forEach((digit) => {
    const btn = document.createElement('button');
    btn.className = 'digit-btn';
    btn.type = 'button';
    btn.textContent = digit;
    btn.addEventListener('click', () => handleDigit(digit));
    digitsEl.appendChild(btn);
  });
}

// Controls
document.getElementById('newGame').addEventListener('click', createGame);
document.getElementById('erase').addEventListener('click', handleErase);
document.getElementById('hint').addEventListener('click', handleHint);
document.getElementById('check').addEventListener('click', () => {
  validateState();
  render();
  message(state.some((c) => c.error) ? 'There are conflicts.' : 'No conflicts right now.');
});
notesBtn.addEventListener('click', () => {
  noteMode = !noteMode;
  notesBtn.textContent = `Notes: ${noteMode ? 'On' : 'Off'}`;
});

document.addEventListener('keydown', (e) => {
  if (!selected && selected !== 0) return;
  if (/^[1-9]$/.test(e.key)) handleDigit(Number(e.key));
  if (e.key === 'Backspace' || e.key === 'Delete') handleErase();
});

createGame();
