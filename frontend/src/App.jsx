import { useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from './components/MainLayout.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import IntroAnimation from './components/IntroAnimation.jsx'

import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import IncidentDetailPage from './pages/IncidentDetailPage.jsx'
import AnalyticsPage from './pages/AnalyticsPage.jsx'

import { useAuthStore } from './store/authStore.js'
import { connectSocket, disconnectSocket } from './lib/socket.js'
import { useIncidentStore } from './store/incidentStore.js'
import { useNotificationStore } from './store/notificationStore.js'
import { playAlertBeep, unlockAudio } from './lib/alertSound.js'
import ParticlesBg from './components/ParticlesBg.jsx'
import CursorGlow from './components/CursorGlow.jsx'

export default function App() {
  const token = useAuthStore((s) => s.token)
  const [showIntro, setShowIntro] = useState(true)

  useEffect(() => {
    const onFirst = () => unlockAudio()
    window.addEventListener('pointerdown', onFirst, { once: true })

    return () => window.removeEventListener('pointerdown', onFirst)
  }, [])

  useEffect(() => {
    if (!token) {
      disconnectSocket()
      return
    }

    const socket = connectSocket()
    if (!socket) return

    const onNew = (payload) => {
      if (payload?.incident) {
        useIncidentStore.getState().upsert(payload.incident)
      }

      playAlertBeep()
    }

    const onUpdated = (payload) => {
      if (payload?.incident) {
        useIncidentStore.getState().upsert(payload.incident)
      }
    }

    const onStatus = (payload) => {
      const id = payload?.incidentId

      if (!id || !payload?.to) return

      const list = useIncidentStore.getState().incidents
      const existing = list.find((x) => String(x._id) === String(id))

      if (existing) {
        useIncidentStore.getState().upsert({
          ...existing,
          status: payload.to
        })
      }
    }

    const onNotif = (payload) => {
      if (payload?.notification) {
        useNotificationStore.getState().prepend(payload.notification)
        playAlertBeep()
      }
    }

    socket.on('new_incident', onNew)
    socket.on('incident_updated', onUpdated)
    socket.on('status_changed', onStatus)
    socket.on('notification_new', onNotif)

    return () => {
      socket.off('new_incident', onNew)
      socket.off('incident_updated', onUpdated)
      socket.off('status_changed', onStatus)
      socket.off('notification_new', onNotif)
    }
  }, [token])
if (showIntro) {
  return <IntroAnimation onFinish={() => setShowIntro(false)} />
}

return (
  <>
    <ParticlesBg />
    <CursorGlow />

    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route path="/register" element={<RegisterPage />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="incidents/:id" element={<IncidentDetailPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </>
)
 
}