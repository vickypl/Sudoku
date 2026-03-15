import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { DigitPad } from '../components/DigitPad';
import { useGameKeyboard } from '../features/game/keyboard';
import { GameBoard } from '../components/GameBoard';
import { useGameTimer } from '../hooks/useGameTimer';
import { useGameStore } from '../stores/gameStore';
import type { Difficulty } from '../types';

const formatTime = (ms: number): string => {
  const total = Math.floor(ms / 1000);
  const h = String(Math.floor(total / 3600)).padStart(2, '0');
  const m = String(Math.floor((total % 3600) / 60)).padStart(2, '0');
  const s = String(total % 60).padStart(2, '0');
  return `${h}:${m}:${s}`;
};

export const GamePage = () => {
  const { difficulty = 'easy' } = useParams();
  const loadPuzzle = useGameStore((state) => state.loadPuzzle);
  const session = useGameStore((state) => state.session);
  const togglePause = useGameStore((state) => state.togglePause);
  const undo = useGameStore((state) => state.undo);
  const redo = useGameStore((state) => state.redo);
  const useHint = useGameStore((state) => state.useHint);

  useEffect(() => {
    loadPuzzle(difficulty as Difficulty);
  }, [difficulty, loadPuzzle]);

  useGameTimer();
  useGameKeyboard();

  return (
    <main className="p-4 md:p-6 flex flex-col md:flex-row gap-6">
      <section className="space-y-4">
        <h2 className="text-2xl font-bold capitalize">{difficulty}</h2>
        <p className="text-sm">Timer: {formatTime(session?.elapsedMs ?? 0)}</p>
        <GameBoard />
      </section>
      <aside className="space-y-3">
        <DigitPad />
        <button className="w-full rounded bg-slate-700 text-white py-2" onClick={togglePause}>
          {session?.status === 'paused' ? 'Resume' : 'Pause'}
        </button>
        <button className="w-full rounded bg-slate-700 text-white py-2" onClick={undo}>
          Undo
        </button>
        <button className="w-full rounded bg-slate-700 text-white py-2" onClick={redo}>
          Redo
        </button>
        <button className="w-full rounded bg-indigo-700 text-white py-2" onClick={useHint}>
          Hint
        </button>
        <p>Status: {session?.status ?? 'loading'}</p>
      </aside>
    </main>
  );
};
