import { useEffect, useState } from "react";
import API from "../../services/api";
import { ShieldAlert, Users, Database, Activity, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // AI Gen State
  const [promptTopic, setPromptTopic] = useState("");
  const [genLoading, setGenLoading] = useState(false);
  const [genStatus, setGenStatus] = useState("");
  
  const navigate = useNavigate();

  useEffect(() => {
    // Verify admin role first
    const role = localStorage.getItem("role");
    if (role !== "admin") {
      navigate("/dashboard");
      return;
    }

    const fetchAdminData = async () => {
      try {
        const [metricsRes, usersRes] = await Promise.all([
          API.get("/admin/metrics"),
          API.get("/admin/users")
        ]);
        setMetrics(metricsRes.data);
        setUsers(usersRes.data);
      } catch (err) {
        console.error("Admin fetch failed", err);
        setError("Failed to fetch admin data. Are you an admin?");
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [navigate]);

  const handleGenerateProblem = async (e) => {
    e.preventDefault();
    if (!promptTopic) return;

    setGenLoading(true);
    setGenStatus("Connecting to Gemini Neural Engine...");
    
    try {
      const res = await API.post("/admin/problems/generate", { promptTopic });
      setGenStatus(res.data.message);
      setPromptTopic("");
      // Refresh metrics specifically for problem count
      const metricsRes = await API.get("/admin/metrics");
      setMetrics(metricsRes.data);
    } catch (err) {
      setGenStatus("Failed: " + (err.response?.data?.message || err.message));
    } finally {
      setGenLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Activity className="animate-spin text-[var(--accent-primary)]" size={48} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col h-full items-center justify-center space-y-4">
        <Lock className="text-red-500" size={64} />
        <h2 className="text-xl font-bold text-red-500">Restricted Access</h2>
        <p className="pro-text-muted">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in zoom-in duration-500 max-w-5xl mx-auto">
      <div className="border-b border-[var(--border-color)] pb-4 flex items-center justify-between">
        <div className="flex items-center">
          <ShieldAlert className="text-[var(--accent-primary)] mr-3" size={32} />
          <div>
            <h1 className="text-2xl font-black pro-text-main uppercase tracking-widest">Master Overview</h1>
            <p className="pro-text-muted text-sm mt-1">Platform Telemetry & Metrics</p>
          </div>
        </div>
        <button
          onClick={() => navigate("/admin/judge-audit")}
          className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs uppercase tracking-wider transition shadow-md shadow-purple-900/30 flex items-center gap-2"
        >
          <span>Judge Quality Audit</span>
          <span className="px-1.5 py-0.5 rounded bg-purple-800 text-[10px]">100% HEALTH</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-panel p-6 border-l-4 border-l-indigo-500 flex flex-col justify-between shadow-md">
          <div className="flex justify-between items-start mb-4">
            <h3 className="pro-text-muted font-bold text-xs uppercase tracking-wider">Total Subjects</h3>
            <Users className="text-indigo-500 bg-indigo-500/10 p-2 rounded-lg" size={36} />
          </div>
          <div>
            <p className="text-4xl font-black pro-text-main">{metrics?.totalUsers || 0}</p>
            <p className="text-xs text-emerald-500 font-bold mt-2">+12% from last week</p>
          </div>
        </div>

        <div className="glass-panel p-6 border-l-4 border-l-cyan-500 flex flex-col justify-between shadow-md">
          <div className="flex justify-between items-start mb-4">
            <h3 className="pro-text-muted font-bold text-xs uppercase tracking-wider">Database Size</h3>
            <Database className="text-cyan-500 bg-cyan-500/10 p-2 rounded-lg" size={36} />
          </div>
          <div>
            <p className="text-4xl font-black pro-text-main">{metrics?.totalProblems || 0}</p>
            <p className="text-xs pro-text-muted mt-2">Active cognitive problems</p>
          </div>
        </div>

        <div className="glass-panel p-6 border-l-4 border-l-emerald-500 flex flex-col justify-between shadow-md">
          <div className="flex justify-between items-start mb-4">
            <h3 className="pro-text-muted font-bold text-xs uppercase tracking-wider">Total Activity</h3>
            <Activity className="text-emerald-500 bg-emerald-500/10 p-2 rounded-lg" size={36} />
          </div>
          <div>
            <p className="text-4xl font-black pro-text-main">{metrics?.totalSubmissions || 0}</p>
            <p className="text-xs pro-text-muted mt-2">Historical submissions</p>
          </div>
        </div>
        
        <div className="glass-panel p-6 border-l-4 border-l-rose-500 flex flex-col justify-between shadow-md">
          <div className="flex justify-between items-start mb-4">
            <h3 className="pro-text-muted font-bold text-xs uppercase tracking-wider">Active (24h)</h3>
            <Activity className="text-rose-500 bg-rose-500/10 p-2 rounded-lg" size={36} />
          </div>
          <div>
            <p className="text-4xl font-black pro-text-main">{metrics?.activeSubmissions || 0}</p>
            <p className="text-xs text-emerald-500 font-bold mt-2">Highly active usage</p>
          </div>
        </div>
      </div>

      {/* AI Problem Matrix */}
      <div className="glass-panel overflow-hidden mt-8 border border-[var(--border-color)] shadow-xl">
        <div className="p-5 border-b border-[var(--border-color)] bg-[var(--accent-glow)] flex items-center">
           <Database className="text-[var(--accent-primary)] mr-3" size={24}/>
           <h3 className="font-black text-[var(--accent-primary)] tracking-wide uppercase text-sm">AI Problem Content Engine</h3>
        </div>
        <div className="p-6">
          <p className="pro-text-muted mb-4 text-sm leading-relaxed">
            Dynamically expand the dataset using the Gemini Neural Generator. Enter a specific computer science topic, problem archetype, or algorithm name to immediately synthesize a fully parsed JSON question.
          </p>
          <form onSubmit={handleGenerateProblem} className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <input 
              type="text"
              value={promptTopic}
              onChange={(e) => setPromptTopic(e.target.value)}
              placeholder="e.g. 'Dijkstra Shortest Path' or 'Binary Tree Inversion'"
              className="input-field flex-1"
              disabled={genLoading}
            />
            <button 
              type="submit"
              disabled={genLoading || !promptTopic}
              className="btn-primary whitespace-nowrap disabled:opacity-50"
            >
              {genLoading ? <Activity className="animate-spin mr-2" size={20}/> : null}
              {genLoading ? "Synthesizing..." : "Generate AI Problem"}
            </button>
          </form>
          {genStatus && (
            <div className="mt-4 p-3.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--accent-primary)] text-sm font-mono flex items-center font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--accent-primary)] animate-pulse mr-2.5"></span>
              {genStatus}
            </div>
          )}
        </div>
      </div>

      <div className="glass-panel overflow-hidden mt-8 shadow-xl">
        <div className="p-4 border-b border-[var(--border-color)] bg-[var(--bg-secondary)]">
           <h3 className="font-black pro-text-main uppercase tracking-wider text-sm">Registered Identities</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--accent-glow)] border-b border-[var(--border-color)] pro-text-muted text-xs uppercase tracking-wider">
                <th className="py-4 px-6 font-bold">Name</th>
                <th className="py-4 px-6 font-bold">Email</th>
                <th className="py-4 px-6 font-bold">Role</th>
                <th className="py-4 px-6 font-bold text-right">Streak</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-b border-[var(--border-color)] hover:bg-[var(--bg-secondary)] transition-colors">
                  <td className="py-4 px-6 font-bold pro-text-main">{u.name}</td>
                  <td className="py-4 px-6 pro-text-muted text-sm">{u.email}</td>
                  <td className="py-4 px-6">
                    <span className={`px-2.5 py-1 text-[10px] font-black uppercase rounded-full border ${u.role === 'admin' ? 'bg-indigo-500/10 text-indigo-500 border-indigo-500/30' : 'bg-[var(--bg-secondary)] pro-text-muted border-[var(--border-color)]'}`}>
                      {u.role.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right font-mono font-bold text-[var(--accent-primary)]">{u.streak} Days</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
