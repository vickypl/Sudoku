import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { GameBoard } from '../src/components/GameBoard';
import { useGameStore } from '../src/stores/gameStore';

const makeSession = () => ({
  puzzle: {
    id: '1',
    difficulty: 'easy',
    clues: 40,
    givens: Array(81).fill(null),
    solution: Array(81).fill(1)
  },
  board: {
    cells: Array(81)
      .fill(null)
      .map(() => ({ value: null, given: false, notes: new Set(), isError: false }))
  },
  startedAt: 0,
  elapsedMs: 0,
  hintsUsed: 0,
  errorsCount: 0,
  moves: [],
  status: 'active'
});

describe('GameBoard', () => {
  it('renders 81 cells', () => {
    useGameStore.setState({ session: makeSession() as any });
    render(<GameBoard />);
    expect(screen.getAllByRole('button')).toHaveLength(81);
  });
});
