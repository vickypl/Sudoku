import type { Difficulty, GameSession } from '../types';

export const DIFFICULTY_BASE: Record<Difficulty, number> = {
  easy: 500,
  medium: 1000,
  hard: 2000,
  expert: 4000
};

export const getStreakBonus = (streak: number): number => 100 * Math.min(Math.max(streak, 0), 7);

export const calculateScore = (session: GameSession, streak: number): number => {
  const base = DIFFICULTY_BASE[session.puzzle.difficulty];
  const timeBonus = Math.max(0, 3000 - Math.floor(session.elapsedMs / 1000)) * 2;
  const hintPenalty = session.hintsUsed * 150;
  const errorPenalty = session.errorsCount * 50;
  const streakBonus = getStreakBonus(streak);
  const perfectBonus =
    (session.puzzle.difficulty === 'hard' || session.puzzle.difficulty === 'expert') &&
    session.hintsUsed === 0 &&
    session.errorsCount === 0
      ? 500
      : 0;

  return Math.max(0, base + timeBonus - hintPenalty - errorPenalty + streakBonus + perfectBonus);
};
