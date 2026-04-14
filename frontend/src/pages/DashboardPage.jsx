import { useCallback, useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import * as incidentsApi from '../api/incidents.js'
import * as analyticsApi from '../api/analytics.js'
import * as notificationsApi from '../api/notifications.js'
import { useIncidentStore } from '../store/incidentStore.js'
import { useNotificationStore } from '../store/notificationStore.js'
import IncidentCard from '../components/IncidentCard.jsx'
import IncidentFilters from '../components/IncidentFilters.jsx'
import SosModal from '../components/SosModal.jsx'
import Spinner from '../components/Spinner.jsx'

function Kpi({ label, value, hint }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 200 }}
      className="stat-card rounded-2xl border border-slate-200/80 bg-white p-4 shadow-panel dark:border-slate-800 dark:bg-slate-900/60"
    >
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </div>

      <div className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-50">
        {value}
      </div>

      {hint && (
        <div className="mt-1 text-xs text-slate-500">
          {hint}
        </div>
      )}
    </motion.div>
  )
}

export default function DashboardPage() {
  const incidents = useIncidentStore((s) => s.incidents)
  const setFromFetch = useIncidentStore((s) => s.setFromFetch)
  const setLoading = useIncidentStore((s) => s.setLoading)
  const setError = useIncidentStore((s) => s.setError)

  const [filters, setFilters] = useState({
    type: '',
    status: '',
    sort: '-createdAt'
  })

  const [analytics, setAnalytics] = useState(null)
  const [anaLoading, setAnaLoading] = useState(true)
  const [anaError, setAnaError] = useState(null)
  const [sosOpen, setSosOpen] = useState(false)

  const params = useMemo(
    () => ({
      ...(filters.type ? { type: filters.type } : {}),
      ...(filters.status ? { status: filters.status } : {}),
      sort: filters.sort,
      limit: 80
    }),
    [filters]
  )

  const loadIncidents = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const data = await incidentsApi.listIncidents(params)
      setFromFetch({
        incidents: data.incidents,
        total: data.total
      })
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [params, setError, setFromFetch, setLoading])

  const loadAnalytics = useCallback(async () => {
    setAnaLoading(true)
    setAnaError(null)

    try {
      const res = await analyticsApi.getAnalyticsSummary({})
      setAnalytics(res.data)
    } catch (e) {
      setAnaError(e.message)
    } finally {
      setAnaLoading(false)
    }
  }, [])

  useEffect(() => {
    loadIncidents()
  }, [loadIncidents])

  useEffect(() => {
    loadAnalytics()
  }, [loadAnalytics])

  useEffect(() => {
    let cancelled = false

    ;(async () => {
      try {
        const n = await notificationsApi.listNotifications({ limit: 1 })

        if (!cancelled) {
          useNotificationStore.setState({
            unreadCount: n.unreadCount
          })
        }
      } catch {}
    })()

    return () => {
      cancelled = true
    }
  }, [])

  const loading = useIncidentStore((s) => s.loading)
  const error = useIncidentStore((s) => s.error)

  const avg = analytics?.avgResponseTimeSec
  const avgLabel = avg == null ? '—' : `${avg}s`

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col justify-between gap-4 md:flex-row md:items-end"
      >
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">
            Operations dashboard
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-300">
            Live incident queue with filters, KPIs computed from real timestamps,
            and Smart SOS entry points.
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.92 }}
          type="button"
          onClick={() => setSosOpen(true)}
          className="inline-flex items-center justify-center rounded-2xl bg-red-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-red-600/20 hover:bg-red-700"
        >
          Smart SOS
        </motion.button>
      </motion.div>

      <div className="grid gap-3 md:grid-cols-4">
        <Kpi
          label="Total incidents"
          value={analytics?.totalIncidents ?? (anaLoading ? '…' : 0)}
        />

        <Kpi
          label="Active"
          value={analytics?.activeIncidents ?? '—'}
          hint="Pending + In progress"
        />

        <Kpi
          label="Resolved"
          value={analytics?.resolvedIncidents ?? '—'}
        />

        <Kpi
          label="Avg response time"
          value={avgLabel}
          hint={
            analytics?.responseSamples
              ? `n=${analytics.responseSamples}`
              : 'Until first response'
          }
        />

        {anaError && (
          <div className="md:col-span-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/30 dark:text-red-200">
            {anaError}
          </div>
        )}
      </div>

      <IncidentFilters value={filters} onChange={setFilters} />

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/30 dark:text-red-200">
          {error}
        </div>
      )}

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">
          Active incidents
        </h2>

        {loading && (
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
            <Spinner />
            Refreshing…
          </div>
        )}
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {incidents.length === 0 && !loading && (
          <div className="text-sm text-slate-600 dark:text-slate-300">
            No incidents match these filters.
          </div>
        )}

        {incidents.map((inc, idx) => (
          <motion.div
            key={inc._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08 }}
          >
            <IncidentCard incident={inc} index={idx} />
          </motion.div>
        ))}
      </div>

      <SosModal
        open={sosOpen}
        onClose={() => setSosOpen(false)}
        onCreated={() => {
          loadIncidents()
          loadAnalytics()
        }}
      />
    </div>
  )
}