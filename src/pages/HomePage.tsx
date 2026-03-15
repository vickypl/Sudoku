import { Link } from 'react-router-dom';
import type { Difficulty } from '../types';

const difficulties: Difficulty[] = ['easy', 'medium', 'hard', 'expert'];

export const HomePage = () => (
  <main className="p-6 space-y-4">
    <h1 className="text-3xl font-bold">Pick your challenge</h1>
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {difficulties.map((difficulty) => (
        <Link key={difficulty} to={`/play/${difficulty}`} className="rounded border p-4 hover:bg-slate-100 capitalize">
          {difficulty}
        </Link>
      ))}
    </div>
  </main>
);
