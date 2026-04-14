import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useThemeStore = create(
  persist(
    (set, get) => ({
      mode: 'dark',
      toggle: () => {
        const next = get().mode === 'dark' ? 'light' : 'dark';
        set({ mode: next });
        get().applyDomClass();
      },
      setMode: (mode) => {
        set({ mode });
        get().applyDomClass();
      },
      applyDomClass: () => {
        const mode = get().mode;
        const root = document.documentElement;
        if (mode === 'dark') root.classList.add('dark');
        else root.classList.remove('dark');
      },
    }),
    {
      name: 'crisissync_theme',
      partialize: (s) => ({ mode: s.mode }),
      onRehydrateStorage: () => (state) => {
        state?.applyDomClass?.();
      },
    }
  )
);
