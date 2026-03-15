import { useEffect } from 'react';
import { useGameStore } from '../stores/gameStore';

export const useGameTimer = (): void => {
  const status = useGameStore((state) => state.session?.status);
  const tick = useGameStore((state) => state.tick);

  useEffect(() => {
    if (status !== 'active') return;
    const id = setInterval(() => tick(1000), 1000);
    return () => clearInterval(id);
  }, [status, tick]);
};
