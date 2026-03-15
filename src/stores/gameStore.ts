import { produce } from 'immer';
import { create } from 'zustand';
import { calculateScore } from '../engine/scoring';
import { generatePuzzle, isComplete, makeBoardFromPuzzle, validateBoard } from '../engine/sudoku';
import type { CellValue, Difficulty, Digit, GameSession, Move } from '../types';

interface GameState {
  session: GameSession | null;
  selectedCell: number | null;
  noteMode: boolean;
  redoStack: Move[];
  loadPuzzle: (difficulty: Difficulty) => Promise<void>;
  selectCell: (index: number) => void;
  placeDigit: (digit: Digit) => void;
  erase: () => void;
  toggleNoteMode: () => void;
  undo: () => void;
  redo: () => void;
  tick: (ms: number) => void;
  togglePause: () => void;
  useHint: () => void;
  completeScore: (streak: number) => number;
}

const markCell = (value: CellValue, session: GameSession, cellIndex: number): Move => ({
  cellIndex,
  prevValue: session.board.cells[cellIndex].value,
  nextValue: value,
  prevNotes: new Set(session.board.cells[cellIndex].notes),
  nextNotes: new Set(),
  timestamp: Date.now()
});

export const useGameStore = create<GameState>((set, get) => ({
  session: null,
  selectedCell: null,
  noteMode: false,
  redoStack: [],
  loadPuzzle: async (difficulty) => {
    const puzzle = await generatePuzzle(difficulty);
    const board = { cells: makeBoardFromPuzzle(puzzle.givens) };
    set({
      session: {
        puzzle,
        board,
        startedAt: Date.now(),
        elapsedMs: 0,
        hintsUsed: 0,
        errorsCount: 0,
        moves: [],
        status: 'active'
      },
      redoStack: [],
      selectedCell: null,
      noteMode: false
    });
  },
  selectCell: (index) => set({ selectedCell: index }),
  placeDigit: (digit) => {
    const { session, selectedCell, noteMode } = get();
    if (!session || selectedCell === null || session.status !== 'active') return;
    const cell = session.board.cells[selectedCell];
    if (cell.given) return;

    const move = markCell(digit, session, selectedCell);
    const next = produce(session, (draft) => {
      if (noteMode) {
        const notes = draft.board.cells[selectedCell].notes;
        if (notes.has(digit)) notes.delete(digit);
        else notes.add(digit);
        return;
      }

      draft.board.cells[selectedCell].value = digit;
      draft.board.cells[selectedCell].notes.clear();
      draft.moves.push(move);
      draft.board.cells = validateBoard(draft.board.cells);
      if (draft.board.cells[selectedCell].isError) draft.errorsCount += 1;
      if (isComplete(draft.board.cells)) draft.status = 'complete';
    });

    set({ session: next, redoStack: [] });
  },
  erase: () => {
    const { session, selectedCell } = get();
    if (!session || selectedCell === null || session.board.cells[selectedCell].given) return;
    const move = markCell(null, session, selectedCell);
    const next = produce(session, (draft) => {
      draft.board.cells[selectedCell].value = null;
      draft.board.cells[selectedCell].notes.clear();
      draft.moves.push(move);
      draft.board.cells = validateBoard(draft.board.cells);
    });
    set({ session: next, redoStack: [] });
  },
  toggleNoteMode: () => set((state) => ({ noteMode: !state.noteMode })),
  undo: () => {
    const { session } = get();
    if (!session || session.moves.length === 0) return;
    const move = session.moves[session.moves.length - 1];
    const updated = produce(session, (draft) => {
      draft.moves.pop();
      draft.board.cells[move.cellIndex].value = move.prevValue;
      draft.board.cells[move.cellIndex].notes = new Set(move.prevNotes);
      draft.board.cells = validateBoard(draft.board.cells);
    });
    set((state) => ({ session: updated, redoStack: [...state.redoStack, move] }));
  },
  redo: () => {
    const { session, redoStack } = get();
    if (!session || redoStack.length === 0) return;
    const move = redoStack[redoStack.length - 1];
    const updated = produce(session, (draft) => {
      draft.moves.push(move);
      draft.board.cells[move.cellIndex].value = move.nextValue;
      draft.board.cells[move.cellIndex].notes = new Set(move.nextNotes);
      draft.board.cells = validateBoard(draft.board.cells);
    });
    set({ session: updated, redoStack: redoStack.slice(0, -1) });
  },
  tick: (ms) => {
    const { session } = get();
    if (!session || session.status !== 'active') return;
    const updated = produce(session, (draft) => {
      draft.elapsedMs += ms;
      if (draft.puzzle.difficulty === 'expert') {
        if (draft.errorsCount >= 3 || draft.elapsedMs >= 90 * 60 * 1000) draft.status = 'failed';
      }
    });
    set({ session: updated });
  },
  togglePause: () => {
    const { session } = get();
    if (!session) return;
    set({ session: { ...session, status: session.status === 'paused' ? 'active' : 'paused' } });
  },
  useHint: () => {
    const { session, selectedCell } = get();
    if (!session || selectedCell === null) return;
    const updated = produce(session, (draft) => {
      draft.hintsUsed += 1;
      const correct = draft.puzzle.solution[selectedCell];
      draft.board.cells[selectedCell].value = correct;
      draft.board.cells = validateBoard(draft.board.cells);
      if (isComplete(draft.board.cells)) draft.status = 'complete';
    });
    set({ session: updated });
  },
  completeScore: (streak) => {
    const { session } = get();
    if (!session) return 0;
    return calculateScore(session, streak);
  }
}));
