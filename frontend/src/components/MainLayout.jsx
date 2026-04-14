import { useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore.js';
import { useThemeStore } from '../store/themeStore.js';
import { useNotificationStore } from '../store/notificationStore.js';
import NotificationPanel from './NotificationPanel.jsx';
import { unlockAudio } from '../lib/alertSound.js';

export default function MainLayout() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const toggleTheme = useThemeStore((s) => s.toggle);
  const mode = useThemeStore((s) => s.mode);
  const unread = useNotificationStore((s) => s.unreadCount);
  const [notifOpen, setNotifOpen] = useState(false);

  const linkClass = ({ isActive }) =>
    `rounded-xl px-3 py-2 text-sm font-semibold ${
      isActive ? 'bg-crisis-600 text-white' : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900'
    }`;

  return (
    <div className="min-h-full">
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/70">
      <div className="w-full flex items-center justify-between gap-3 px-4 md:px-6 xl:px-10 py-3">          <Link to="/" className="flex items-center gap-2" onPointerDown={() => unlockAudio()}>
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-crisis-500 to-crisis-700 shadow-sm" />
            <div>
              <div className="text-sm font-bold text-slate-900 dark:text-slate-50">CrisisSync AI</div>
              <div className="text-xs text-slate-500">Hospitality emergency ops</div>
            </div>
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            <NavLink to="/" end className={linkClass}>
              Dashboard
            </NavLink>
            <NavLink to="/analytics" className={linkClass}>
              Analytics
            </NavLink>
          </nav>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="relative rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900"
              onClick={() => setNotifOpen(true)}
            >
              Alerts
              {unread > 0 && (
                <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white">
                  {unread > 9 ? '9+' : unread}
                </span>
              )}
            </button>
            <button
              type="button"
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900"
              onClick={toggleTheme}
            >
              {mode === 'dark' ? 'Light' : 'Dark'}
            </button>
            <div className="hidden text-right sm:block">
              <div className="text-sm font-semibold text-slate-900 dark:text-slate-50">{user?.name}</div>
              <div className="text-xs text-slate-500">{user?.role}</div>
            </div>
            <button
              type="button"
              className="rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
              onClick={() => logout()}
            >
              Log out
            </button>
          </div>
        </div>
        <div className="w-full flex gap-2 border-t border-slate-200/60 px-4 md:px-6 xl:px-10 py-2 md:hidden dark:border-slate-800">          <NavLink to="/" end className={linkClass}>
            Dashboard
          </NavLink>
          <NavLink to="/analytics" className={linkClass}>
            Analytics
          </NavLink>
        </div>
      </header>
      <main className="w-full px-4 md:px-6 xl:px-10 py-6 md:py-8">
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
          <Outlet />
        </motion.div>
      </main>
      <NotificationPanel open={notifOpen} onClose={() => setNotifOpen(false)} />
    </div>
  );
}
