import { describe, expect, it } from 'vitest';
import { calculateScore } from '../src/engine/scoring';
import type { GameSession } from '../src/types';

const session = (difficulty: GameSession['puzzle']['difficulty']): GameSession => ({
  puzzle: {
    id: 'p',
    difficulty,
    clues: 30,
    givens: Array(81).fill(null),
    solution: Array(81).fill(1)
  } as any,
  board: { cells: [] as any },
  startedAt: 0,
  elapsedMs: 1000,
  hintsUsed: 0,
  errorsCount: 0,
  moves: [],
  status: 'complete'
});

describe('calculateScore', () => {
  it('includes perfect bonus for hard and expert', () => {
    const hard = calculateScore(session('hard'), 2);
    const easy = calculateScore(session('easy'), 2);
    expect(hard).toBeGreaterThan(easy);
  });

  it('applies penalties', () => {
    const s = session('medium');
    s.hintsUsed = 3;
    s.errorsCount = 2;
    const score = calculateScore(s, 0);
    expect(score).toBeLessThan(1000 + 6000);
  });
});
