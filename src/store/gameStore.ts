import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Difficulty, GamePhase, GameSettings, HudSnapshot } from '@/types/game';

interface GameStore {
  hud: HudSnapshot;
  settings: GameSettings;
  highScores: Array<{ name: string; score: number; stage: number; date: string }>;
  setHud: (hud: HudSnapshot) => void;
  updateSettings: (partial: Partial<GameSettings>) => void;
  addHighScore: (entry: { name: string; score: number; stage: number }) => void;
}

const defaultHud: HudSnapshot = {
  score: 0,
  lives: 3,
  enemiesRemaining: 20,
  stageNumber: 1,
  phase: 'countdown' as GamePhase,
  playerKills: [0, 0],
  starLevels: [0, 0],
  effects: [],
};

export const useGameStore = create<GameStore>()(
  persist(
    (set) => ({
      hud: defaultHud,
      settings: {
        difficulty: 'normal' as Difficulty,
        sfxVolume: 0.7,
        musicVolume: 0.5,
        muted: false,
      },
      highScores: [],
      setHud: (hud) => set({ hud }),
      updateSettings: (partial) =>
        set((s) => ({ settings: { ...s.settings, ...partial } })),
      addHighScore: (entry) =>
        set((s) => ({
          highScores: [
            ...s.highScores,
            { ...entry, date: new Date().toISOString() },
          ]
            .sort((a, b) => b.score - a.score)
            .slice(0, 10),
        })),
    }),
    {
      name: 'battlecity-storage',
      partialize: (s) => ({
        settings: s.settings,
        highScores: s.highScores,
      }),
    },
  ),
);
