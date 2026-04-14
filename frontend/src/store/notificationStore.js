import { create } from 'zustand';

export const useNotificationStore = create((set, get) => ({
  items: [],
  unreadCount: 0,
  loading: false,
  error: null,
  setBundle: ({ items, unreadCount }) => set({ items, unreadCount, error: null }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  prepend: (n) =>
    set((state) => ({
      items: [n, ...state.items],
      unreadCount: n.read ? state.unreadCount : state.unreadCount + 1,
    })),
  markReadLocal: (id) =>
    set((state) => {
      const items = state.items.map((x) => (String(x._id) === String(id) ? { ...x, read: true } : x));
      const unreadCount = items.filter((x) => !x.read).length;
      return { items, unreadCount };
    }),
  markAllReadLocal: () =>
    set((state) => ({
      items: state.items.map((x) => ({ ...x, read: true })),
      unreadCount: 0,
    })),
}));
