import { describe, expect, it } from 'vitest';
import { generatePuzzle, makeBoardFromPuzzle, validateBoard } from '../src/engine/sudoku';

describe('sudoku engine', () => {
  it('generates puzzle with clue count in range', async () => {
    const puzzle = await generatePuzzle('easy');
    expect(puzzle.clues).toBeGreaterThanOrEqual(36);
    expect(puzzle.clues).toBeLessThanOrEqual(45);
  });

  it('detects conflicts', () => {
    const board = makeBoardFromPuzzle(Array(81).fill(null));
    board[0].value = 1;
    board[1].value = 1;
    const validated = validateBoard(board);
    expect(validated[0].isError).toBe(true);
    expect(validated[1].isError).toBe(true);
  });
});
