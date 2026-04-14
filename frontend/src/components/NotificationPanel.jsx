import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as notificationsApi from '../api/notifications.js';
import { useNotificationStore } from '../store/notificationStore.js';
import Spinner from './Spinner.jsx';
export default function NotificationPanel({ open, onClose }) {
  const items = useNotificationStore((s) => s.items);
  const unreadCount = useNotificationStore((s) => s.unreadCount);
  const loading = useNotificationStore((s) => s.loading);
  const error = useNotificationStore((s) => s.error);
  const setBundle = useNotificationStore((s) => s.setBundle);
  const setLoading = useNotificationStore((s) => s.setLoading);
  const setError = useNotificationStore((s) => s.setError);
  const markReadLocal = useNotificationStore((s) => s.markReadLocal);
  const markAllReadLocal = useNotificationStore((s) => s.markAllReadLocal);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const data = await notificationsApi.listNotifications({ limit: 40 });
        if (!cancelled) setBundle({ items: data.items, unreadCount: data.unreadCount });
      } catch (e) {
        if (!cancelled) setError(e.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [open, setBundle, setError, setLoading]);

  async function markOne(id) {
    try {
      await notificationsApi.markNotificationRead(id);
      markReadLocal(id);
    } catch {
      /* ignore */
    }
  }

  async function markAll() {
    try {
      await notificationsApi.markAllNotificationsRead();
      markAllReadLocal();
    } catch {
      /* ignore */
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-start justify-end bg-black/40 p-4"
          onMouseDown={onClose}
        >
          <motion.div
            initial={{ x: 24, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 24, opacity: 0 }}
            onMouseDown={(e) => e.stopPropagation()}
            className="mt-14 w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950"
          >
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-800">
              <div>
                <div className="text-sm font-semibold">Notifications</div>
                <div className="text-xs text-slate-500">{unreadCount} unread</div>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="rounded-lg px-2 py-1 text-xs font-semibold text-crisis-700 hover:bg-crisis-50 dark:text-crisis-300 dark:hover:bg-slate-900"
                  onClick={markAll}
                >
                  Mark all read
                </button>
                <button type="button" className="rounded-lg px-2 py-1 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-900" onClick={onClose}>
                  Close
                </button>
              </div>
            </div>
            <div className="max-h-[70vh] overflow-auto p-2">
              {loading && (
                <div className="flex items-center gap-2 p-4 text-sm text-slate-600 dark:text-slate-300">
                  <Spinner /> Loading…
                </div>
              )}
              {error && <div className="p-4 text-sm text-red-600">{error}</div>}
              {!loading && items.length === 0 && <div className="p-4 text-sm text-slate-500">No notifications yet.</div>}
              {items.map((n) => (
                <button
                  key={n._id}
                  type="button"
                  onClick={() => {
                    if (!n.read) markOne(n._id);
                  }}
                  className={`mb-2 w-full rounded-xl border px-3 py-3 text-left text-sm transition ${
                    n.read
                      ? 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'
                      : 'border-crisis-200 bg-crisis-50/60 dark:border-crisis-900 dark:bg-crisis-950/40'
                  }`}
                >
                  <div className="font-semibold text-slate-900 dark:text-slate-50">{n.title}</div>
                  {n.body && <div className="mt-1 text-slate-600 dark:text-slate-300">{n.body}</div>}
                  <div className="mt-2 text-xs text-slate-500">{new Date(n.createdAt).toLocaleString()}</div>
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
