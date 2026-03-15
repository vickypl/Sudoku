const dayKey = (isoDate: string): string => isoDate.split('T')[0];

export interface StreakState {
  streak: number;
  lastCompletedDay: string | null;
}

export const getStreakStorageKey = (userId: string): string => `sudoku:streak:${userId}`;

export const applyCompletionToStreak = (state: StreakState, completedAtIso: string): StreakState => {
  const completedDay = dayKey(completedAtIso);
  if (state.lastCompletedDay === completedDay) {
    return state;
  }

  if (!state.lastCompletedDay) {
    return { streak: 1, lastCompletedDay: completedDay };
  }

  const prev = new Date(`${state.lastCompletedDay}T00:00:00Z`).getTime();
  const current = new Date(`${completedDay}T00:00:00Z`).getTime();
  const diffDays = Math.floor((current - prev) / (24 * 60 * 60 * 1000));

  return {
    streak: diffDays === 1 ? state.streak + 1 : 1,
    lastCompletedDay: completedDay
  };
};
