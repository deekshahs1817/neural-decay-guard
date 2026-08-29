import { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { 
  Activity, ShieldCheck, AlertTriangle, AlertOctagon, Brain, 
  Sparkles, ArrowRight, RefreshCw, Zap, Clock, CheckCircle2, Flame, Search
} from 'lucide-react';

export default function Decay() {
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();

  const [decayData, setDecayData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchDecayData();
  }, [userId]);

  const fetchDecayData = async () => {
    try {
      setLoading(true);
      const { data } = await API.get(`/decay/${userId}`);
      setDecayData(data);
    } catch (e) {
      console.error("Failed to fetch decay metrics:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      const { data } = await API.get(`/decay/${userId}`);
      setDecayData(data);
    } catch (e) {
      console.error(e);
    } finally {
      setRefreshing(false);
    }
  };

  const subjects = decayData?.subjects || [];
  const counts = decayData?.counts || {
    strong: subjects.filter(d => d.status === 'Strong').length,
    medium: subjects.filter(d => d.status === 'Medium').length,
    decaying: subjects.filter(d => d.status === 'Decaying').length,
  };

  const filteredSubjects = useMemo(() => {
    let list = subjects;
    if (filterStatus !== 'all') {
      list = list.filter(s => s.status.toLowerCase() === filterStatus.toLowerCase());
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(s => s.subject.toLowerCase().includes(q) || (s.category && s.category.toLowerCase().includes(q)));
    }
    return list;
  }, [subjects, filterStatus, searchQuery]);

  if (loading) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-2 border-[var(--accent-primary)] border-t-transparent rounded-full animate-spin"></div>
        <p className="pro-text-muted text-xs font-bold">Computing Ebbinghaus Retention Vectors...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-6xl mx-auto pb-20">
      {/* Header Banner */}
      <div className="hud-panel p-8 border-[var(--border-color)] bg-[var(--bg-secondary)] relative overflow-hidden shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs font-black uppercase">
              <Activity size={14} className="animate-pulse" /> Ebbinghaus Retention Model
            </div>
            <h1 className="text-3xl md:text-5xl font-black pro-text-main tracking-tight uppercase">
              Neural <span className="text-[var(--accent-primary)]">Decay Monitor</span>
            </h1>
            <p className="pro-text-muted text-xs md:text-sm font-medium max-w-2xl leading-relaxed">
              Real-time cognitive retention tracking. The system models mathematical memory decay over time (Ebbinghaus Formula: R = e^(-Δt/S)) and recommends high-yield spaced reviews before concepts are forgotten.
            </p>
          </div>

          {/* Overall Retention Score */}
          <div className="p-5 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl flex items-center gap-4 shadow-sm w-full md:w-auto">
            <div className="w-14 h-14 rounded-2xl bg-[var(--accent-glow)] border border-[var(--accent-primary)]/30 flex items-center justify-center text-[var(--accent-primary)]">
              <Brain size={30} />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase pro-text-muted tracking-widest block">Average Retention</span>
              <p className="text-3xl font-black font-mono text-[var(--accent-primary)]">
                {decayData?.overallRetentionAverage || 78}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Top 3 Interactive Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div 
          onClick={() => setFilterStatus(filterStatus === 'strong' ? 'all' : 'strong')}
          className={`glass-panel p-6 border-b-4 border-b-emerald-500 flex flex-col items-center justify-center text-center cursor-pointer transition-all hover:scale-[1.02] shadow-sm ${
            filterStatus === 'strong' ? 'ring-2 ring-emerald-500 bg-emerald-500/5' : ''
          }`}
        >
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-3">
            <ShieldCheck size={26} />
          </div>
          <h3 className="text-4xl font-black font-mono text-emerald-500">{counts.strong}</h3>
          <p className="pro-text-main font-black mt-1 uppercase text-xs tracking-wider">Strongly Retained</p>
          <span className="text-[10px] pro-text-muted font-medium mt-0.5">Retention ≥ 75% • Memory Fortified</span>
        </div>

        <div 
          onClick={() => setFilterStatus(filterStatus === 'medium' ? 'all' : 'medium')}
          className={`glass-panel p-6 border-b-4 border-b-cyan-500 flex flex-col items-center justify-center text-center cursor-pointer transition-all hover:scale-[1.02] shadow-sm ${
            filterStatus === 'medium' ? 'ring-2 ring-cyan-500 bg-cyan-500/5' : ''
          }`}
        >
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-3">
            <AlertTriangle size={26} />
          </div>
          <h3 className="text-4xl font-black font-mono text-cyan-400">{counts.medium}</h3>
          <p className="pro-text-main font-black mt-1 uppercase text-xs tracking-wider">Fading Topics</p>
          <span className="text-[10px] pro-text-muted font-medium mt-0.5">Retention 50–74% • Spaced Review Recommended</span>
        </div>

        <div 
          onClick={() => setFilterStatus(filterStatus === 'decaying' ? 'all' : 'decaying')}
          className={`glass-panel p-6 border-b-4 border-b-rose-500 flex flex-col items-center justify-center text-center cursor-pointer transition-all hover:scale-[1.02] shadow-sm ${
            filterStatus === 'decaying' ? 'ring-2 ring-rose-500 bg-rose-500/5' : ''
          }`}
        >
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center mb-3">
            <AlertOctagon size={26} />
          </div>
          <h3 className="text-4xl font-black font-mono text-rose-500">{counts.decaying}</h3>
          <p className="pro-text-main font-black mt-1 uppercase text-xs tracking-wider">Needs Urgent Review</p>
          <span className="text-[10px] pro-text-muted font-medium mt-0.5">Retention &lt; 50% • High Decay Velocity</span>
        </div>
      </div>

      {/* Filter & Action Bar */}
      <div className="glass-panel p-5 border-[var(--border-color)] space-y-4 shadow-sm">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search decaying subjects or algorithms..."
              className="input-field !pl-10 !py-2.5 text-xs font-medium w-full rounded-xl bg-[var(--bg-secondary)] border-[var(--border-color)]"
            />
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] pro-text-muted hover:pro-text-main text-xs font-bold flex items-center gap-2 transition"
            >
              <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
              <span>{refreshing ? "Recalculating..." : "Recalculate Decay"}</span>
            </button>

            <Link
              to="/daily-quiz"
              className="btn-primary !px-6 !py-2.5 text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-lg"
            >
              <Zap size={14} />
              <span>Launch Spaced Quiz (+100% Boost)</span>
            </Link>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-[var(--border-color)] text-xs">
          {[
            { id: 'all', label: 'All Tracked Subjects', count: subjects.length },
            { id: 'strong', label: 'Strong Retention (≥75%)', count: counts.strong },
            { id: 'medium', label: 'Fading Topics (50-74%)', count: counts.medium },
            { id: 'decaying', label: 'Needs Review (<50%)', count: counts.decaying }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilterStatus(f.id)}
              className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 ${
                filterStatus === f.id
                  ? 'bg-[var(--accent-primary)] text-white font-black shadow-sm'
                  : 'bg-[var(--bg-secondary)] border border-[var(--border-color)] pro-text-muted hover:pro-text-main'
              }`}
            >
              <span>{f.label}</span>
              <span className="px-1.5 py-0.2 rounded-full bg-[var(--bg-card)] text-[10px] font-mono">
                {f.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Detailed Subject Health Cards List */}
      <div className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-sm font-black uppercase pro-text-main tracking-wider flex items-center gap-2">
            <Brain size={18} className="text-[var(--accent-primary)]" />
            Detailed Subject Memory Health ({filteredSubjects.length})
          </h3>
          <span className="text-[10px] font-mono pro-text-muted">
            Spaced Repetition Active
          </span>
        </div>

        {filteredSubjects.length > 0 ? (
          <div className="space-y-3">
            {filteredSubjects.map((item, idx) => {
              const isStrong = item.status === 'Strong';
              const isMedium = item.status === 'Medium';

              const barColor = isStrong ? 'bg-emerald-500' : isMedium ? 'bg-cyan-400' : 'bg-rose-500';
              const textColor = isStrong ? 'text-emerald-500' : isMedium ? 'text-cyan-400' : 'text-rose-500';
              const badgeCls = isStrong 
                ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30'
                : isMedium 
                ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                : 'bg-rose-500/10 text-rose-500 border-rose-500/30';

              return (
                <div 
                  key={idx}
                  className="glass-panel p-5 border-[var(--border-color)] hover:border-[var(--accent-primary)]/50 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-5 transition-all shadow-sm group"
                >
                  {/* Subject Name & Category */}
                  <div className="space-y-1 w-full md:w-1/3">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-color)] pro-text-muted">
                        {item.category || "DSA & Algorithms"}
                      </span>
                      <span className="text-[10px] font-mono pro-text-muted">
                        {item.daysSinceLastReview === 0 ? "Reviewed Today" : `${item.daysSinceLastReview}d ago`}
                      </span>
                    </div>
                    <h4 className="font-black text-sm md:text-base pro-text-main group-hover:text-[var(--accent-primary)] transition-colors">
                      {item.subject}
                    </h4>
                  </div>

                  {/* Retention Progress Bar */}
                  <div className="flex-1 w-full space-y-1.5">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="pro-text-muted text-[11px]">Retention Stability</span>
                      <span className={`font-mono font-black ${textColor}`}>
                        {item.retentionScore}%
                      </span>
                    </div>
                    <div className="h-2.5 w-full bg-[var(--bg-secondary)] rounded-full overflow-hidden border border-[var(--border-color)]">
                      <div 
                        className={`h-full ${barColor} rounded-full transition-all duration-700`}
                        style={{ width: `${item.retentionScore}%` }}
                      />
                    </div>
                  </div>

                  {/* Status Badge & Direct Interactive Actions */}
                  <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-[var(--border-color)]">
                    <span className={`px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider border flex items-center gap-1.5 ${badgeCls}`}>
                      {isStrong ? <ShieldCheck size={14} /> : isMedium ? <AlertTriangle size={14} /> : <AlertOctagon size={14} />}
                      <span>{item.statusLabel || item.status}</span>
                    </span>

                    {/* Revive / Practice Action Button */}
                    <Link
                      to="/daily-quiz"
                      className="px-3.5 py-1.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-[var(--accent-primary)] text-xs font-bold pro-text-main flex items-center gap-1.5 transition shadow-sm"
                    >
                      <Zap size={13} className="text-[var(--accent-primary)]" />
                      <span>Revive (Quiz)</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="glass-panel p-12 text-center space-y-3">
            <Activity size={48} className="mx-auto text-slate-400 opacity-40" />
            <h4 className="text-base font-bold pro-text-main">No topics matched your filter.</h4>
            <p className="text-xs pro-text-muted">Try selecting "All Tracked Subjects" or clearing your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
