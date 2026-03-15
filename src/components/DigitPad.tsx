import { useGameStore } from '../stores/gameStore';

export const DigitPad = () => {
  const placeDigit = useGameStore((state) => state.placeDigit);
  const erase = useGameStore((state) => state.erase);
  const noteMode = useGameStore((state) => state.noteMode);
  const toggleNoteMode = useGameStore((state) => state.toggleNoteMode);

  return (
    <div className="space-y-3 w-full max-w-xs">
      <div className="grid grid-cols-5 gap-2">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
          <button key={digit} className="rounded bg-slate-700 text-white py-2" onClick={() => placeDigit(digit as any)}>
            {digit}
          </button>
        ))}
        <button className="rounded bg-slate-200 py-2" onClick={erase}>
          Del
        </button>
      </div>
      <button className="w-full rounded bg-indigo-600 text-white py-2" onClick={toggleNoteMode}>
        Note Mode: {noteMode ? 'On' : 'Off'}
      </button>
    </div>
  );
};
