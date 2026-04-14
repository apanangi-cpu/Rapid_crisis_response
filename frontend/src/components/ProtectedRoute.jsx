import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore.js';

export default function ProtectedRoute({ children, roles }) {
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const loc = useLocation();

  if (!token) return <Navigate to="/login" replace state={{ from: loc }} />;

  if (roles && user && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
