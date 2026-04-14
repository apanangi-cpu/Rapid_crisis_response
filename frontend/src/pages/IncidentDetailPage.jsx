import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import * as incidentsApi from '../api/incidents.js';
import * as aiApi from '../api/ai.js';
import * as usersApi from '../api/users.js';
import { useAuthStore } from '../store/authStore.js';
import Spinner from '../components/Spinner.jsx';

const nextStatus = (current) => {
  if (current === 'Pending') return ['In Progress'];
  if (current === 'In Progress') return ['Resolved'];
  return [];
};

export default function IncidentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const role = useAuthStore((s) => s.user?.role);

  const [incident, setIncident] = useState(null);
  const [ai, setAi] = useState(null);
  const [responders, setResponders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [status, setStatus] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [note, setNote] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const canControl = role === 'Admin' || role === 'Security';

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const incRes = await incidentsApi.getIncident(id);
      setIncident(incRes.incident);
      const [aiData, usersRes] = await Promise.all([
        aiApi.getAiSuggestions(incRes.incident.emergencyType),
        usersApi.listResponders(),
      ]);
      setAi(aiData.data);
      setResponders(usersRes.users || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (!incident) return;
    setStatus('');
    setAssignedTo(incident.assignedTo?._id || '');
  }, [incident]);

  const statusOptions = useMemo(() => nextStatus(incident?.status || 'Pending'), [incident]);

  const assigneeDirty = (assignedTo || '') !== (incident?.assignedTo?._id || '');
  const dirty = Boolean(note.trim() || (canControl && (status || assigneeDirty)));

  async function save() {
    setActionLoading(true);
    setActionError(null);
    try {
      const body = { incidentId: id };
      if (note.trim()) body.note = note.trim();
      if (canControl) {
        if (status) body.status = status;
        const currentAssignee = incident.assignedTo?._id || '';
        const desired = assignedTo || '';
        if (desired !== currentAssignee) {
          body.assignedTo = desired === '' ? null : desired;
        }
      }
      const res = await incidentsApi.updateIncident(body);
      setIncident(res.incident);
      setNote('');
      setStatus('');
      const aiData = await aiApi.getAiSuggestions(res.incident.emergencyType);
      setAi(aiData.data);
    } catch (e) {
      setActionError(e.message);
    } finally {
      setActionLoading(false);
    }
  }

  async function remove() {
    if (!window.confirm('Delete this incident permanently?')) return;
    setDeleteLoading(true);
    try {
      await incidentsApi.deleteIncident(id);
      navigate('/', { replace: true });
    } catch (e) {
      setActionError(e.message);
    } finally {
      setDeleteLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
        <Spinner /> Loading incident…
      </div>
    );
  }

  if (error || !incident) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/30 dark:text-red-200">
        {error || 'Incident not found'}{' '}
        <Link className="font-semibold underline" to="/">
          Back
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
        <div>
          <Link to="/" className="text-sm font-semibold text-crisis-700 hover:underline dark:text-crisis-300">
            ← Dashboard
          </Link>
          <h1 className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-50">{incident.title}</h1>
          <div className="mt-2 flex flex-wrap gap-2 text-sm text-slate-600 dark:text-slate-300">
            <span className="rounded-full bg-slate-100 px-2 py-0.5 font-semibold dark:bg-slate-900">{incident.emergencyType}</span>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 font-semibold dark:bg-slate-900">{incident.status}</span>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 font-semibold dark:bg-slate-900">Priority {incident.priority}</span>
          </div>
        </div>
        {role === 'Admin' && (
          <button
            type="button"
            onClick={remove}
            disabled={deleteLoading}
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-bold text-red-800 hover:bg-red-100 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200"
          >
            {deleteLoading ? 'Deleting…' : 'Delete incident'}
          </button>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-panel dark:border-slate-800 dark:bg-slate-900/60">
            <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">Location</h2>
            <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-50">
              {incident.floor?.label} · {incident.room?.name} ({incident.room?.code})
            </p>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{incident.description || 'No description provided.'}</p>
            <div className="mt-4 grid gap-2 text-sm text-slate-600 dark:text-slate-300 md:grid-cols-2">
              <div>
                <span className="font-semibold text-slate-900 dark:text-slate-100">Triggered by:</span> {incident.triggeredBy?.name}
              </div>
              <div>
                <span className="font-semibold text-slate-900 dark:text-slate-100">Assigned:</span> {incident.assignedTo?.name || 'Unassigned'}
              </div>
              <div>
                <span className="font-semibold text-slate-900 dark:text-slate-100">Opened:</span> {new Date(incident.createdAt).toLocaleString()}
              </div>
              <div>
                <span className="font-semibold text-slate-900 dark:text-slate-100">First response:</span>{' '}
                {incident.firstResponseAt ? new Date(incident.firstResponseAt).toLocaleString() : '—'}
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-panel dark:border-slate-800 dark:bg-slate-900/60">
            <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">Notes & activity</h2>
            <div className="mt-3 space-y-3">
              {(incident.notes || []).length === 0 && <div className="text-sm text-slate-500">No notes yet.</div>}
              {(incident.notes || []).map((n) => (
                <div key={n._id} className="rounded-xl border border-slate-200 p-3 text-sm dark:border-slate-800">
                  <div className="font-semibold text-slate-900 dark:text-slate-50">{n.user?.name || 'User'}</div>
                  <div className="text-xs text-slate-500">{new Date(n.createdAt).toLocaleString()}</div>
                  <div className="mt-2 text-slate-700 dark:text-slate-200">{n.text}</div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-4">
          <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-panel dark:border-slate-800 dark:bg-slate-900/60">
            <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">Responder actions</h2>
            {!canControl && <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Staff can add notes; status and assignment are security/admin controlled.</p>}
            {canControl && (
              <div className="mt-3 space-y-3">
                <label className="block text-sm">
                  <div className="mb-1 font-medium">Assign to</div>
                  <select
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-950"
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                  >
                    <option value="">Unassigned</option>
                    {responders.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name} ({u.role})
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block text-sm">
                  <div className="mb-1 font-medium">Advance status</div>
                  <select
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-950"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="">No change</option>
                    {statusOptions.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            )}
            <label className="mt-4 block text-sm">
              <div className="mb-1 font-medium">Add note</div>
              <textarea
                className="min-h-[90px] w-full rounded-xl border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-950"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Operational updates, witness statements, handoff details…"
              />
            </label>
            {actionError && <div className="mt-2 rounded-xl border border-red-200 bg-red-50 p-2 text-xs text-red-800 dark:border-red-900 dark:bg-red-950/30 dark:text-red-200">{actionError}</div>}
            <button
              type="button"
              disabled={actionLoading || !dirty}
              onClick={save}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-crisis-600 py-2.5 text-sm font-bold text-white hover:bg-crisis-700 disabled:opacity-60"
            >
              {actionLoading && <Spinner />}
              Save changes
            </button>
          </section>

          <section className="rounded-2xl border border-crisis-200/70 bg-gradient-to-b from-crisis-50 to-white p-5 dark:border-crisis-900 dark:from-crisis-950/40 dark:to-slate-950">
            <h2 className="text-sm font-bold uppercase tracking-wide text-crisis-800 dark:text-crisis-200">AI decision support</h2>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">Rule-based playbooks sourced from the database.</p>
            {ai && (
              <div className="mt-3 space-y-3 text-sm">
                <div className="font-semibold text-slate-900 dark:text-slate-50">{ai.label}</div>
                <ol className="list-decimal space-y-2 pl-4 text-slate-700 dark:text-slate-200">
                  {(ai.responseSteps || []).map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ol>
                <div className="text-xs font-semibold uppercase text-slate-500">Escalation</div>
                <ul className="list-disc space-y-1 pl-4 text-slate-700 dark:text-slate-200">
                  {(ai.escalationHints || []).map((h, idx) => (
                    <li key={idx}>{h}</li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
