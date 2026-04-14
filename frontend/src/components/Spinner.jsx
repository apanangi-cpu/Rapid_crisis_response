export default function Spinner({ className = '' }) {
  return (
    <span
      className={`inline-block h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-crisis-600 dark:border-slate-600 dark:border-t-crisis-500 ${className}`}
      aria-label="Loading"
    />
  );
}
