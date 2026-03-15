import type { Cell, CellValue, Difficulty, Digit, Puzzle } from '../types';

const DIGITS: Digit[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const CLUE_RANGES: Record<Difficulty, [number, number]> = {
  easy: [36, 45],
  medium: [27, 35],
  hard: [22, 26],
  expert: [17, 21]
};

const hashString = async (value: string): Promise<string> => {
  const encoded = new TextEncoder().encode(value);
  const hash = await crypto.subtle.digest('SHA-256', encoded);
  return Array.from(new Uint8Array(hash))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
};

const shuffle = <T,>(arr: T[]): T[] => {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const rowOf = (index: number) => Math.floor(index / 9);
const colOf = (index: number) => index % 9;
const boxOf = (index: number) => Math.floor(rowOf(index) / 3) * 3 + Math.floor(colOf(index) / 3);

export const peersOf = (index: number): number[] => {
  const r = rowOf(index);
  const c = colOf(index);
  const b = boxOf(index);
  return [...Array(81).keys()].filter((i) => i !== index && (rowOf(i) === r || colOf(i) === c || boxOf(i) === b));
};

const isValidPlacement = (board: CellValue[], index: number, digit: Digit): boolean =>
  peersOf(index).every((peerIndex) => board[peerIndex] !== digit);

const fillBoard = (board: CellValue[]): boolean => {
  const empty = board.findIndex((value) => value === null);
  if (empty === -1) return true;

  for (const digit of shuffle(DIGITS)) {
    if (!isValidPlacement(board, empty, digit)) continue;
    board[empty] = digit;
    if (fillBoard(board)) {
      return true;
    }
    board[empty] = null;
  }

  return false;
};

const countSolutions = (board: CellValue[], maxSolutions: number): number => {
  const empty = board.findIndex((value) => value === null);
  if (empty === -1) return 1;

  let solutions = 0;
  for (const digit of DIGITS) {
    if (!isValidPlacement(board, empty, digit)) continue;
    board[empty] = digit;
    solutions += countSolutions(board, maxSolutions);
    board[empty] = null;

    if (solutions >= maxSolutions) {
      return solutions;
    }
  }

  return solutions;
};

const generateSolvedBoard = (): Digit[] => {
  const board: CellValue[] = Array(81).fill(null);
  const generated = fillBoard(board);
  if (!generated) {
    throw new Error('Failed to generate solved Sudoku board');
  }
  return board as Digit[];
};

const randomInt = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min;

export const generatePuzzle = async (difficulty: Difficulty): Promise<Puzzle> => {
  const solution = generateSolvedBoard();
  const givens: CellValue[] = [...solution];
  const [minClues, maxClues] = CLUE_RANGES[difficulty];
  const targetClues = randomInt(minClues, maxClues);

  for (const index of shuffle([...Array(81).keys()])) {
    if (givens.filter(Boolean).length <= targetClues) break;
    const cached = givens[index];
    givens[index] = null;
    if (countSolutions([...givens], 2) !== 1) {
      givens[index] = cached;
    }
  }

  const id = await hashString(solution.join(''));

  return {
    id,
    difficulty,
    clues: givens.filter(Boolean).length,
    givens,
    solution
  };
};

export const makeBoardFromPuzzle = (givens: CellValue[]): Cell[] =>
  givens.map((value) => ({
    value,
    given: value !== null,
    notes: new Set(),
    isError: false
  }));

export const validateBoard = (cells: Cell[]): Cell[] =>
  cells.map((cell, index) => {
    if (!cell.value) {
      return { ...cell, isError: false };
    }

    const conflict = peersOf(index).some((peerIndex) => cells[peerIndex].value === cell.value);
    return { ...cell, isError: conflict };
  });

export const isComplete = (cells: Cell[]): boolean =>
  cells.every((cell) => cell.value !== null) && cells.every((cell) => !cell.isError);
