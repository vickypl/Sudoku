import { create } from 'zustand';
import type { Theme } from '../types';

interface SettingsState {
  theme: Theme;
  liveValidation: boolean;
  highlightPeers: boolean;
  autoRemoveNotes: boolean;
  timerVisible: boolean;
  setTheme: (theme: Theme) => void;
  toggle: (key: keyof Omit<SettingsState, 'setTheme' | 'toggle'>) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  theme: 'system',
  liveValidation: true,
  highlightPeers: true,
  autoRemoveNotes: false,
  timerVisible: true,
  setTheme: (theme) => set({ theme }),
  toggle: (key) => set((state) => ({ [key]: !state[key] } as Partial<SettingsState>))
}));
