import { useEffect, useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
  Legend,
} from 'recharts';
import * as analyticsApi from '../api/analytics.js';
import Spinner from '../components/Spinner.jsx';

export default function AnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await analyticsApi.getAnalyticsSummary({ bucket: 'day' });
        if (!cancelled) setData(res.data);
      } catch (e) {
        if (!cancelled) setError(e.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
        <Spinner /> Computing analytics…
      </div>
    );
  }

  if (error) {
    return <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/30 dark:text-red-200">{error}</div>;
  }

  const typeData = (data?.byType || []).map((t) => ({ name: t.type, count: t.count }));
  const freq = (data?.frequency || []).map((f) => ({ period: f.period, count: f.count }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">Analytics</h1>
        <p className="mt-2 max-w-3xl text-sm text-slate-600 dark:text-slate-300">
          Metrics are computed from MongoDB incident timestamps, including first-response latency where available.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-panel dark:border-slate-800 dark:bg-slate-900/60">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Most common type</div>
          <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-50">{data?.mostCommonEmergencyType || '—'}</div>
        </div>
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-panel dark:border-slate-800 dark:bg-slate-900/60">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Avg response time</div>
          <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-50">
            {data?.avgResponseTimeSec == null ? '—' : `${data.avgResponseTimeSec}s`}
          </div>
          <div className="mt-1 text-xs text-slate-500">Samples: {data?.responseSamples ?? 0}</div>
        </div>
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-panel dark:border-slate-800 dark:bg-slate-900/60">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Volume</div>
          <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-50">{data?.totalIncidents ?? 0}</div>
          <div className="mt-1 text-xs text-slate-500">
            Active {data?.activeIncidents ?? 0} · Resolved {data?.resolvedIncidents ?? 0}
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-panel dark:border-slate-800 dark:bg-slate-900/60">
          <div className="mb-2 text-sm font-bold text-slate-900 dark:text-slate-50">Incidents by type</div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={typeData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" name="Incidents" fill="#0284c7" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-panel dark:border-slate-800 dark:bg-slate-900/60">
          <div className="mb-2 text-sm font-bold text-slate-900 dark:text-slate-50">Incident frequency (by day)</div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={freq}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="period" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="count" name="Count" stroke="#0ea5e9" strokeWidth={3} dot />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
