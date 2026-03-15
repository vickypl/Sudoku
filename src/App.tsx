import { Route, Routes } from 'react-router-dom';
import { Header } from './components/Header';
import { GamePage } from './pages/GamePage';
import { HomePage } from './pages/HomePage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { SettingsPage } from './pages/SettingsPage';
import { StatsPage } from './pages/StatsPage';

export const App = () => (
  <div className="min-h-screen">
    <Header />
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/play/:difficulty" element={<GamePage />} />
      <Route path="/leaderboard" element={<LeaderboardPage />} />
      <Route path="/stats" element={<StatsPage />} />
      <Route path="/settings" element={<SettingsPage />} />
    </Routes>
  </div>
);
