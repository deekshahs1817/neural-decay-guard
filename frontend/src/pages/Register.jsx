import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import { Brain, User, Mail, Lock, Phone, UserPlus, Loader2 } from "lucide-react";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const register = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await API.post("/register", { name, email, mobile: `+${mobile.replace(/\D/g, '')}`, password });
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] p-4 relative overflow-hidden transition-colors">
      {/* Background Decor */}
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-[var(--accent-primary)] opacity-5 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-[var(--accent-primary)] opacity-5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="glass-panel w-full max-w-md p-8 relative z-10 shadow-2xl border-[var(--border-color)]">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[var(--accent-glow)] rounded-2xl mb-4 shadow-lg border border-[var(--border-color)] neural-pulse">
            <Brain className="text-[var(--accent-primary)]" size={32} />
          </div>
          <h1 className="text-2xl font-black pro-text-main tracking-tighter uppercase flex items-center justify-center">
            Create <span className="text-[var(--accent-primary)] ml-2">Identity</span>
          </h1>
          <p className="pro-text-muted mt-2 font-bold uppercase tracking-widest text-[10px]">Enroll in Neural Guard</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm font-medium text-center">
            {error}
          </div>
        )}

        <form onSubmit={register} className="space-y-4">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <User className="pro-text-muted opacity-50 group-focus-within:text-[var(--accent-primary)] transition-colors" size={20} />
            </div>
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="input-field pl-11 shadow-sm"
            />
          </div>

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
              <Phone className="pro-text-muted opacity-50 group-focus-within:text-[var(--accent-primary)] transition-colors" size={20} />
            </div>
            <input
              type="tel"
              placeholder="Mobile (+1234567890)"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              required
              className="input-field pl-11 shadow-sm"
            />
          </div>

          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="pro-text-muted opacity-50 group-focus-within:text-[var(--accent-primary)] transition-colors" size={20} />
            </div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input-field pl-11 shadow-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center py-3.5 mt-4 disabled:opacity-70 disabled:cursor-not-allowed shadow-2xl"
          >
            {loading ? <Loader2 className="animate-spin mr-2" size={20} /> : <UserPlus className="mr-2" size={20} />}
            <span className="uppercase tracking-widest font-black text-sm">Generate Identity</span>
          </button>
        </form>

        <p className="text-center pro-text-muted mt-8 text-sm font-medium">
          Already enrolled?{" "}
          <Link to="/" className="text-[var(--accent-primary)] hover:opacity-80 font-bold transition-all">
            Login here
          </Link>
        </p>
        <p className="text-center mt-4 border-t border-[var(--border-color)] pt-4">
          <Link to="/enterprise" className="text-[var(--accent-primary)] hover:opacity-80 text-xs font-black uppercase tracking-widest transition-all">
            Enterprise Solutions
          </Link>
        </p>
      </div>
    </div>
  );
}