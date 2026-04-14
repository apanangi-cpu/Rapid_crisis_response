import { create } from 'zustand';

export const useIncidentStore = create((set) => ({
  incidents: [],
  total: 0,
  loading: false,
  error: null,
  setFromFetch: ({ incidents, total }) => set({ incidents, total, error: null }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  upsert: (incident) =>
    set((state) => {
      const id = incident._id || incident.id;
      const idx = state.incidents.findIndex((x) => String(x._id) === String(id));
      const next = [...state.incidents];
      if (idx === -1) next.unshift(incident);
      else next[idx] = { ...next[idx], ...incident };
      return { incidents: next };
    }),
  remove: (id) =>
    set((state) => ({
      incidents: state.incidents.filter((x) => String(x._id) !== String(id)),
    })),
}));
