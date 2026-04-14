import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as authApi from '../api/auth.js';
import { useAuthStore } from '../store/authStore.js';
import Spinner from '../components/Spinner.jsx';

export default function RegisterPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Staff');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await authApi.register({ name, email, password, role });
      setAuth({ token: data.token, user: data.user });
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-full max-w-md flex-col justify-center px-4 py-16">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl border border-slate-200 bg-white p-8 shadow-panel dark:border-slate-800 dark:bg-slate-950">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Create account</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Admin accounts are provisioned via seeding; public signup is Staff/Security.</p>
        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <label className="block text-sm">
            <div className="mb-1 font-medium">Full name</div>
            <input
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
          <label className="block text-sm">
            <div className="mb-1 font-medium">Email</div>
            <input
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
            />
          </label>
          <label className="block text-sm">
            <div className="mb-1 font-medium">Password (min 8)</div>
            <input
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              minLength={8}
              required
            />
          </label>
          <label className="block text-sm">
            <div className="mb-1 font-medium">Role</div>
            <select
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="Staff">Staff</option>
              <option value="Security">Security</option>
            </select>
          </label>
          {error && <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200">{error}</div>}
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-crisis-600 py-2.5 text-sm font-bold text-white hover:bg-crisis-700 disabled:opacity-60"
          >
            {loading && <Spinner />}
            Register
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-slate-600 dark:text-slate-300">
          Already have access?{' '}
          <Link className="font-semibold text-crisis-700 hover:underline dark:text-crisis-300" to="/login">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
