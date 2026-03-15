import { motion } from 'framer-motion';
import { useGameStore } from '../stores/gameStore';
import { peersOf } from '../engine/sudoku';

export const GameBoard = () => {
  const session = useGameStore((state) => state.session);
  const selectedCell = useGameStore((state) => state.selectedCell);
  const selectCell = useGameStore((state) => state.selectCell);

  if (!session) return <p className="text-sm">Select a difficulty to begin.</p>;

  const selectedValue = selectedCell !== null ? session.board.cells[selectedCell].value : null;

  return (
    <div className="grid grid-cols-9 border-2 border-slate-900 max-w-[32rem] w-full" role="grid" aria-label="Sudoku board">
      {session.board.cells.map((cell, index) => {
        const isSelected = selectedCell === index;
        const isPeer = selectedCell !== null && peersOf(selectedCell).includes(index);
        const sameDigit = selectedValue && cell.value === selectedValue;

        return (
          <motion.button
            key={index}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={() => selectCell(index)}
            className={`aspect-square border border-slate-400 text-xl md:text-2xl font-semibold
              ${cell.given ? 'font-bold' : ''}
              ${cell.isError ? 'bg-red-300' : ''}
              ${isSelected ? 'bg-cell-selected/60' : isPeer ? 'bg-cell-peer/50' : sameDigit ? 'bg-cell-same/60' : ''}`}
            aria-label={`row ${Math.floor(index / 9) + 1} column ${(index % 9) + 1} value ${cell.value ?? 'empty'}`}
          >
            {cell.value ?? ''}
          </motion.button>
        );
      })}
    </div>
  );
};
