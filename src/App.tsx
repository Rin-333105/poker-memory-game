import { useGameStore } from '@/store/useGameStore';
import MenuPage from '@/pages/MenuPage';
import GamePage from '@/pages/GamePage';
import ResultPage from '@/pages/ResultPage';

export default function App() {
  const screen = useGameStore((s) => s.screen);

  if (screen === 'game') return <GamePage />;
  if (screen === 'result') return <ResultPage />;
  return <MenuPage />;
}
