import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import * as authApi from '../api/auth.js'
import { useAuthStore } from '../store/authStore.js'
import Spinner from '../components/Spinner.jsx'

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const setAuth = useAuthStore((s) => s.setAuth)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function onSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const data = await authApi.login({ email, password })
      setAuth({ token: data.token, user: data.user })
      navigate(location.state?.from?.pathname || '/', { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-bg-glow"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="login-card"
      >
        <div className="login-top">
          <h1>Sign in</h1>
          <p>Access the CrisisSync command center</p>
        </div>

        <form className="login-form" onSubmit={onSubmit}>
          <label>
            <span>Email</span>

            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              autoComplete="email"
              placeholder="Enter your email"
              required
            />
          </label>

          <label>
            <span>Password</span>

            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              required
            />
          </label>

          {error && <div className="login-error">{error}</div>}

          <motion.button
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={loading}
            className="login-btn"
          >
            {loading && <Spinner />}
            Continue
          </motion.button>
        </form>

        <p className="login-footer">
          New here?{' '}
          <Link to="/register">
            Create an account
          </Link>
        </p>
      </motion.div>
    </div>
  )
}