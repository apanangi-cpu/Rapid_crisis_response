import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const typeColors = {
  Fire: 'bg-red-500/15 text-red-700 dark:text-red-300',
  Medical: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300',
  Theft: 'bg-amber-500/15 text-amber-800 dark:text-amber-200',
  Violence: 'bg-violet-500/15 text-violet-800 dark:text-violet-200',
};

const statusColors = {
  Pending: 'bg-amber-500/10 text-amber-800 dark:text-amber-200',
  'In Progress': 'bg-sky-500/10 text-sky-800 dark:text-sky-200',
  Resolved: 'bg-slate-500/10 text-slate-700 dark:text-slate-300',
};

export default function IncidentCard({ incident, index = 0 }) {
  const id = incident._id;
  const room = incident.room;
  const floor = incident.floor;
  const loc = room && floor ? `${floor.label} · ${room.name} (${room.code})` : '—';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-panel dark:border-slate-800 dark:bg-slate-900/60"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${typeColors[incident.emergencyType] || ''}`}>
              {incident.emergencyType}
            </span>
            <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${statusColors[incident.status] || ''}`}>
              {incident.status}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">Priority {incident.priority}</span>
          </div>
          <h3 className="mt-2 text-base font-semibold text-slate-900 dark:text-slate-50">{incident.title}</h3>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{loc}</p>
        </div>
        <Link
          to={`/incidents/${id}`}
          className="shrink-0 rounded-xl bg-crisis-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-crisis-700"
        >
          Open
        </Link>
      </div>
      <p className="mt-3 line-clamp-2 text-sm text-slate-500 dark:text-slate-400">{incident.description || 'No description'}</p>
    </motion.div>
  );
}
