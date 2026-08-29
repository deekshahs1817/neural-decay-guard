import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import { Brain, Mail, Lock, LogIn, Loader2, Sparkles, KeyRound, ArrowLeft, CheckCircle2, Eye, EyeOff } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Forgot password state
  const [isResetMode, setIsResetMode] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [resetMsg, setResetMsg] = useState("");
  const [resetLoading, setResetLoading] = useState(false);

  const login = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await API.post("/login", { email, password });
      localStorage.setItem("userId", res.data.userId);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role); // Save role for Admin UI toggle
      navigate(res.data.role === 'admin' ? "/admin" : "/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials. Please check your password.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setResetLoading(true);
    setError("");
    setResetMsg("");

    try {
      const res = await API.post("/reset-password", { email: resetEmail, newPassword });
      setResetMsg(res.data.message || "Password reset successfully! You can now log in.");
      setTimeout(() => {
        setEmail(resetEmail);
        setIsResetMode(false);
        setResetMsg("");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password. Please check your email.");
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] p-4 relative overflow-hidden transition-colors">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[var(--accent-primary)] opacity-5 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-[var(--accent-primary)] opacity-5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="glass-panel w-full max-w-md p-8 relative z-10 shadow-2xl border-[var(--border-color)]">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[var(--accent-glow)] rounded-2xl mb-4 shadow-lg border border-[var(--border-color)] neural-pulse">
            <Brain className="text-[var(--accent-primary)]" size={32} />
          </div>
          <h1 className="text-3xl font-black pro-text-main flex items-center justify-center tracking-tighter uppercase">
            NEURAL <span className="text-[var(--accent-primary)] ml-2">GUARD</span>
          </h1>
          <p className="pro-text-muted mt-1 font-bold uppercase tracking-widest text-[10px]">
            {isResetMode ? "Reset Security Vector" : "Authenticate Identity"}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-500 text-sm font-bold text-center">
             {error}
          </div>
        )}

        {resetMsg && (
          <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-600 dark:text-emerald-400 text-sm font-bold text-center flex items-center justify-center">
             <CheckCircle2 size={18} className="mr-2" /> {resetMsg}
          </div>
        )}

        {!isResetMode ? (
          <form onSubmit={login} className="space-y-4">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="pro-text-muted opacity-50 group-focus-within:text-[var(--accent-primary)] transition-colors" size={20} />
              </div>
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input-field pl-11 shadow-sm"
              />
            </div>

            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="pro-text-muted opacity-50 group-focus-within:text-[var(--accent-primary)] transition-colors" size={20} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="input-field pl-11 pr-11 shadow-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center pro-text-muted hover:pro-text-main transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={() => {
                  setResetEmail(email);
                  setIsResetMode(true);
                  setError("");
                }}
                className="text-xs text-[var(--accent-primary)] hover:underline font-bold transition-colors"
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center py-3.5 mt-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-xl"
            >
              {loading ? <Loader2 className="animate-spin mr-2" size={20} /> : <LogIn className="mr-2" size={20} />}
              <span className="uppercase tracking-widest font-black text-sm">Access System</span>
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-4 animate-in fade-in duration-300">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="pro-text-muted opacity-50 group-focus-within:text-[var(--accent-primary)] transition-colors" size={20} />
              </div>
              <input
                type="email"
                placeholder="Account Email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                required
                className="input-field pl-11 shadow-sm"
              />
            </div>

            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <KeyRound className="pro-text-muted opacity-50 group-focus-within:text-[var(--accent-primary)] transition-colors" size={20} />
              </div>
              <input
                type={showNewPassword ? "text" : "password"}
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={4}
                className="input-field pl-11 pr-11 shadow-sm"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center pro-text-muted hover:pro-text-main transition-colors"
                tabIndex={-1}
              >
                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={resetLoading || !resetEmail || !newPassword}
              className="btn-primary w-full flex items-center justify-center py-3.5 mt-2 disabled:opacity-70 shadow-xl"
            >
              {resetLoading ? <Loader2 className="animate-spin mr-2" size={20} /> : <KeyRound className="mr-2" size={20} />}
              <span className="uppercase tracking-widest font-black text-sm">Update Password</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setIsResetMode(false);
                setError("");
              }}
              className="w-full flex items-center justify-center py-2.5 pro-text-muted hover:pro-text-main text-xs font-bold uppercase tracking-wider transition-colors"
            >
              <ArrowLeft size={16} className="mr-1" /> Back to Login
            </button>
          </form>
        )}

        <p className="text-center pro-text-muted mt-6 text-sm font-medium">
          New neural entity?{" "}
          <Link to="/register" className="text-[var(--accent-primary)] hover:opacity-80 font-bold transition-all">
            Create Identity
          </Link>
        </p>
        <p className="text-center mt-4 border-t border-[var(--border-color)] pt-4">
          <Link to="/enterprise" className="text-[var(--accent-primary)] hover:opacity-80 text-xs font-black uppercase tracking-widest transition-all">
            Enterprise Solutions
          </Link>
        </p>
      </div>
      
      {/* Decorative Sparkle */}
      <div className="absolute top-10 right-10 opacity-20 hidden md:block">
         <Sparkles size={120} className="text-[var(--accent-primary)] animate-pulse" />
      </div>
    </div>
  );
}