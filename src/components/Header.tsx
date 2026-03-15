import { Link } from 'react-router-dom';

export const Header = () => (
  <header className="py-4 px-6 border-b border-slate-300 flex justify-between items-center">
    <Link to="/" className="font-bold text-xl">
      ◈ Sudoku Online
    </Link>
    <nav className="flex gap-4 text-sm">
      <Link to="/leaderboard">Leaderboard</Link>
      <Link to="/stats">Stats</Link>
      <Link to="/settings">Settings</Link>
    </nav>
  </header>
);
