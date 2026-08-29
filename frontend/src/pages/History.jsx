import { useEffect, useState } from "react";
import API from "../services/api";
import { History as HistoryIcon, Calendar, CheckCircle2, ChevronRight, Brain } from "lucide-react";

export default function History() {
  const userId = localStorage.getItem("userId");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get(`/history/${userId}`)
      .then(res => {
        setHistory(res.data || []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load history", err);
        setLoading(false);
      });
  }, [userId]);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="animate-spin text-[var(--accent-primary)]">
          <HistoryIcon size={48} />
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown Date";
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute:'2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row items-center justify-between border-b border-[var(--border-color)] pb-6 gap-4">
        <div>
          <h1 className="text-3xl font-black flex items-center pro-text-main">
            <HistoryIcon className="text-[var(--accent-primary)] mr-3" size={32} />
            Training History
          </h1>
          <p className="pro-text-muted mt-2">Review your past cognitive sessions and scores.</p>
        </div>
        <div className="bg-[var(--accent-glow)] text-[var(--accent-primary)] px-6 py-3 rounded-2xl border border-[var(--border-color)] font-bold flex items-center shadow-sm">
          <Brain className="mr-2" size={20} />
          {history.length} Sessions Logged
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {history.map((h, i) => (
          <div key={i} className="glass-card flex flex-col justify-between group h-full">
            <div>
              <div className="flex justify-between items-start mb-6">
                <div className="pro-bg-secondary p-3 rounded-xl border border-[var(--border-color)] shadow-inner">
                  <Calendar className="pro-text-muted opacity-60" size={24} />
                </div>
                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${h.score >= 80 ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500' : h.score >= 50 ? 'bg-[var(--accent-glow)] border-[var(--accent-primary)] text-[var(--accent-primary)]' : 'bg-red-500/10 border-red-500/30 text-red-500'}`}>
                  {h.score >= 80 ? 'Excellent' : h.score >= 50 ? 'Optimal' : 'Calibration Reqd'}
                </div>
              </div>
              
              <h3 className="text-4xl font-black pro-text-main mb-1">
                {h.score}% <span className="text-xs font-bold pro-text-muted uppercase tracking-widest opacity-60 ml-1">Score Matrix</span>
              </h3>
              
              <p className="pro-text-muted text-xs font-bold mt-4 flex items-center opacity-80 italic">
                 {formatDate(h.date || h.createdAt)}
              </p>
            </div>
            
            <div className="mt-8 pt-4 border-t border-[var(--border-color)] flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
               <span className="text-[10px] pro-text-muted font-black uppercase tracking-widest">View Analysis</span>
               <ChevronRight size={16} className="pro-text-muted" />
            </div>
          </div>
        ))}

        {history.length === 0 && (
          <div className="col-span-full py-20 flex flex-col items-center justify-center pro-text-muted glass-panel border-dashed">
            <HistoryIcon size={80} className="pro-text-muted opacity-20 mb-6" />
            <h3 className="text-2xl font-black pro-text-main mb-2">No Neural Records Found</h3>
            <p className="mt-2 text-center max-w-sm pro-text-muted italic">Complete your first daily quiz to start building your cognitive training history.</p>
          </div>
        )}
      </div>
    </div>
  );
}