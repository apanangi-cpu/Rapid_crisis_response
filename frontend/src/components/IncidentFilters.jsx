const types = ['', 'Fire', 'Medical', 'Theft', 'Violence'];
const statuses = ['', 'Pending', 'In Progress', 'Resolved'];
const sorts = [
  { value: '-createdAt', label: 'Newest' },
  { value: 'createdAt', label: 'Oldest' },
  { value: '-priority', label: 'Highest priority' },
];

export default function IncidentFilters({ value, onChange }) {
  return (
    <div className="grid gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 dark:border-slate-800 dark:bg-slate-900/60 md:grid-cols-4">
      <label className="text-sm">
        <div className="mb-1 font-medium text-slate-700 dark:text-slate-200">Type</div>
        <select
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
          value={value.type}
          onChange={(e) => onChange({ ...value, type: e.target.value })}
        >
          {types.map((t) => (
            <option key={t || 'all'} value={t}>
              {t || 'All types'}
            </option>
          ))}
        </select>
      </label>
      <label className="text-sm">
        <div className="mb-1 font-medium text-slate-700 dark:text-slate-200">Status</div>
        <select
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
          value={value.status}
          onChange={(e) => onChange({ ...value, status: e.target.value })}
        >
          {statuses.map((t) => (
            <option key={t || 'all'} value={t}>
              {t || 'All statuses'}
            </option>
          ))}
        </select>
      </label>
      <label className="text-sm md:col-span-2">
        <div className="mb-1 font-medium text-slate-700 dark:text-slate-200">Sort</div>
        <select
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
          value={value.sort}
          onChange={(e) => onChange({ ...value, sort: e.target.value })}
        >
          {sorts.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
