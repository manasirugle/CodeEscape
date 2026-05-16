import { create } from 'zustand'

export const useSimulationStore = create((set) => ({
  mode: 'idle',
  pulse: 0,
  setMode: (mode) => set({ mode }),
  triggerPulse: () => set((state) => ({ pulse: state.pulse + 1 })),
}))
