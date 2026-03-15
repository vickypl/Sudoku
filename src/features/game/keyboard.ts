import { useEffect } from 'react';
import { useGameStore } from '../../stores/gameStore';

export const useGameKeyboard = () => {
  const placeDigit = useGameStore((s) => s.placeDigit);
  const erase = useGameStore((s) => s.erase);
  const toggleNoteMode = useGameStore((s) => s.toggleNoteMode);
  const undo = useGameStore((s) => s.undo);
  const redo = useGameStore((s) => s.redo);
  const togglePause = useGameStore((s) => s.togglePause);
  const useHint = useGameStore((s) => s.useHint);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key.toLowerCase() === 'z') return undo();
      if (event.ctrlKey && event.key.toLowerCase() === 'y') return redo();
      if (/^[1-9]$/.test(event.key)) return placeDigit(Number(event.key) as any);
      if (event.key === 'Backspace' || event.key === 'Delete') return erase();
      if (event.key.toLowerCase() === 'n') return toggleNoteMode();
      if (event.key.toLowerCase() === 'p') return togglePause();
      if (event.key.toLowerCase() === 'h') return useHint();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [erase, placeDigit, redo, toggleNoteMode, togglePause, undo, useHint]);
};
