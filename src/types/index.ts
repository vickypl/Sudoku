export type Digit = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
export type CellValue = Digit | null;

export interface Cell {
  value: CellValue;
  given: boolean;
  notes: Set<Digit>;
  isError: boolean;
}

export interface Board {
  cells: Cell[];
}

export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';

export interface Puzzle {
  id: string;
  difficulty: Difficulty;
  clues: number;
  givens: CellValue[];
  solution: Digit[];
}

export interface Move {
  cellIndex: number;
  prevValue: CellValue;
  nextValue: CellValue;
  prevNotes: Set<Digit>;
  nextNotes: Set<Digit>;
  timestamp: number;
}

export interface GameSession {
  puzzle: Puzzle;
  board: Board;
  startedAt: number;
  elapsedMs: number;
  hintsUsed: number;
  errorsCount: number;
  moves: Move[];
  status: 'active' | 'paused' | 'complete' | 'failed';
  userId?: string;
}

export interface ScoreRecord {
  id: string;
  userId: string | 'anon';
  displayName: string;
  difficulty: Difficulty;
  puzzleId: string;
  finalScore: number;
  timeMs: number;
  hintsUsed: number;
  errorsCount: number;
  streakBonus: number;
  completedAt: string;
}

export type Theme = 'system' | 'light' | 'dark' | 'high-contrast';
