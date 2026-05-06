import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/admin";

  useEffect(() => {
    if (!authLoading && isAdmin) {
      navigate(from, { replace: true });
    }
  }, [authLoading, isAdmin, from, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email?.trim() || !password?.trim()) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);

    const result = await login(email, password);

    if (result.success) {
      navigate(from, { replace: true });
      return;
    }

    setError(result.error || "Failed to login. Please try again.");
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-5xl rounded-[2rem] overflow-hidden shadow-2xl ring-1 ring-black/5 bg-white dark:bg-slate-950">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="relative px-10 py-12 sm:px-14 sm:py-16 bg-gradient-to-b from-sky-700 to-blue-800 text-white">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle,_rgba(255,255,255,0.25),_transparent_35%)]" />
            <div className="relative z-10">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-xs uppercase tracking-[0.35em] text-white shadow-sm">Secure admin login</span>
              <h1 className="mt-10 text-4xl font-semibold tracking-tight">Admin Dashboard Access</h1>
              <p className="mt-6 max-w-md text-base leading-7 text-blue-100/85">Sign in with the registered admin email to manage bookings, update status, and assign staff securely.</p>
              <div className="mt-10 space-y-4 text-sm text-sky-100/90">
                <p><strong>Only the configured admin email can access this dashboard.</strong> If you don’t have access, use the contact form on the homepage.</p>
                <p>All admin actions are protected and require authentication.</p>
              </div>
            </div>
          </div>

          <div className="px-10 py-12 sm:px-14 sm:py-16 bg-slate-50 dark:bg-slate-900">
            <div className="max-w-md mx-auto">
              <div className="text-center mb-8">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400 mb-3">Admin sign in</p>
                <h2 className="text-3xl font-semibold text-slate-900 dark:text-white">Welcome back</h2>
                <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">Log in with your admin credentials to continue to the protected dashboard.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-400/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                    placeholder="admin@gkghealth.com"
                    autoComplete="email"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-400/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                  />
                </div>

                {error && (
                  <div className="rounded-3xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300">{error}</div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex w-full items-center justify-center rounded-3xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/10 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <><span className="mr-2 inline-flex h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />Signing in...</>
                  ) : (
                    "Sign in"
                  )}
                </button>
              </form>

              <div className="mt-8 rounded-[2rem] border border-slate-200 bg-white p-5 text-sm text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300">
                <p className="font-semibold text-slate-900 dark:text-white">Admin login details</p>
                <p className="mt-3">Use the registered admin email and password to access the protected dashboard.</p>
                <p className="mt-3 text-xs text-slate-500 dark:text-slate-500">Only your configured admin email is granted dashboard access.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;