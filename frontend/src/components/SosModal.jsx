import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as locationsApi from '../api/locations.js';
import * as incidentsApi from '../api/incidents.js';
import Spinner from './Spinner.jsx';

const types = ['Fire', 'Medical', 'Theft', 'Violence'];

export default function SosModal({ open, onClose, onCreated }) {
  const [floors, setFloors] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [floorId, setFloorId] = useState('');
  const [roomId, setRoomId] = useState('');
  const [emergencyType, setEmergencyType] = useState('Medical');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    (async () => {
      try {
        const f = await locationsApi.listFloors();
        if (!cancelled) {
          setFloors(f.floors || []);
          if (f.floors?.[0]?._id) setFloorId(f.floors[0]._id);
        }
      } catch (e) {
        if (!cancelled) setError(e.message);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [open]);

  useEffect(() => {
    if (!open || !floorId) return;
    let cancelled = false;
    (async () => {
      try {
        const r = await locationsApi.listRooms(floorId);
        if (!cancelled) {
          setRooms(r.rooms || []);
          setRoomId(r.rooms?.[0]?._id || '');
        }
      } catch (e) {
        if (!cancelled) setError(e.message);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [floorId, open]);

  const canSubmit = useMemo(() => Boolean(floorId && roomId && emergencyType && !loading), [floorId, roomId, emergencyType, loading]);

  async function submit() {
    setLoading(true);
    setError(null);
    try {
      const res = await incidentsApi.createIncident({
        emergencyType,
        floorId,
        roomId,
        title: title || `${emergencyType} SOS`,
        description,
        sosSource: 'sos_panel',
      });
      onCreated?.(res.incident);
      onClose();
      setTitle('');
      setDescription('');
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={onClose}
        >
          <motion.div
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            onMouseDown={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-950"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-red-600">Emergency</div>
                <button className="sos-btn">Smart SOS</button>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Creates a live incident and alerts security in real time.</p>
              </div>
              <button type="button" className="rounded-xl px-3 py-2 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-900" onClick={onClose}>
                Esc
              </button>
            </div>

            <div className="mt-5 grid gap-3">
              <label className="text-sm">
                <div className="mb-1 font-medium">Emergency type</div>
                <select
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900"
                  value={emergencyType}
                  onChange={(e) => setEmergencyType(e.target.value)}
                >
                  {types.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-sm">
                <div className="mb-1 font-medium">Floor / zone</div>
                <select
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900"
                  value={floorId}
                  onChange={(e) => setFloorId(e.target.value)}
                >
                  {floors.map((f) => (
                    <option key={f._id} value={f._id}>
                      {f.label} (L{f.level})
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-sm">
                <div className="mb-1 font-medium">Room</div>
                <select
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                >
                  {rooms.map((r) => (
                    <option key={r._id} value={r._id}>
                      {r.name} ({r.code})
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-sm">
                <div className="mb-1 font-medium">Title (optional)</div>
                <input
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Short headline"
                />
              </label>
              <label className="text-sm">
                <div className="mb-1 font-medium">Details</div>
                <textarea
                  className="min-h-[90px] w-full rounded-xl border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What responders should know"
                />
              </label>
            </div>

            {error && <div className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200">{error}</div>}

            <div className="mt-5 flex items-center justify-end gap-2">
              <button type="button" className="rounded-xl px-4 py-2 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-900" onClick={onClose}>
                Cancel
              </button>
              <button
                type="button"
                disabled={!canSubmit}
                onClick={submit}
                className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading && <Spinner />}
                Trigger SOS
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
