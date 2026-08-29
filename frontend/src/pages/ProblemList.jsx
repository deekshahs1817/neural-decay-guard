import { useEffect, useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";
import { List, CheckCircle2, Circle, Activity, ShieldCheck, AlertTriangle } from "lucide-react";

export default function ProblemList() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get(`/problems?limit=200`)
      .then(res => {
        setProblems(res.data.problems);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load problems", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Activity className="animate-spin text-[var(--accent-primary)]" size={48} />
      </div>
    );
  }

  const getDifficultyColor = (diff) => {
    if (diff === 'Easy') return 'text-emerald-400 font-bold';
    if (diff === 'Medium') return 'text-cyan-400 font-bold';
    if (diff === 'Hard') return 'text-rose-400 font-bold';
    return 'pro-text-muted font-medium';
  };

  return (
    <div className="space-y-8 animate-in fade-in zoom-in duration-500 max-w-5xl mx-auto">
      <div className="border-b border-[var(--border-color)] pb-4">
        <h1 className="text-3xl font-bold flex items-center pro-text-main">
          <List className="text-[var(--accent-primary)] mr-3" size={32} />
          Problem Set
        </h1>
        <p className="pro-text-muted mt-2">Browse the massive cognitive database and tackle new challenges.</p>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center bg-[var(--bg-secondary)] p-4 rounded-xl border border-[var(--border-color)] gap-4 transition-colors">
        <div className="pro-text-main font-medium flex items-center">
          <Activity className="text-[var(--accent-primary)] mr-2" size={20} />
          <span className="mr-4">Filter by Subject:</span>
          <select 
            className="input-field py-2 px-4 !w-auto"
            onChange={(e) => {
              setLoading(true);
              API.get(`/problems?category=${e.target.value}&limit=200`)
                .then(res => { setProblems(res.data.problems); setLoading(false); })
                .catch(() => setLoading(false));
            }}
          >
            <option value="All">All Subjects</option>
            <option value="DBMS">DBMS</option>
            <option value="DSA">DSA</option>
            <option value="Java">Java</option>
            <option value="C">C</option>
            <option value="Python">Python</option>
            <option value="CN">Computer Networks (CN)</option>
            <option value="COA">Computer Architecture (COA)</option>
            <option value="OS">Operating Systems (OS)</option>
          </select>
        </div>
        <div className="pro-text-muted text-sm">{problems.length} total displayed matching view</div>
      </div>

      <div className="glass-panel overflow-hidden transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="pro-bg-secondary border-b border-[var(--border-color)] pro-text-muted text-sm uppercase tracking-wider">
                <th className="py-4 px-6 font-bold text-center w-16">Status</th>
                <th className="py-4 px-6 font-bold">Title</th>
                <th className="py-4 px-6 font-bold">Acceptance</th>
                <th className="py-4 px-6 font-bold">Difficulty</th>
                <th className="py-4 px-6 font-bold">Category</th>
              </tr>
            </thead>
            <tbody>
              {problems.map((p, i) => (
                <tr key={p._id} className="border-b border-[var(--border-color)] group hover:bg-[var(--bg-card)] transition-colors">
                  <td className="py-4 px-6 text-center">
                    <Circle size={18} className="pro-text-muted opacity-40 inline-block" />
                  </td>
                  <td className="py-4 px-6">
                    <Link to={`/workspace/${p._id}`} className="pro-text-main hover:text-[var(--accent-primary)] font-semibold transition-colors">
                      {i + 1}. {p.title}
                    </Link>
                  </td>
                  <td className="py-4 px-6 pro-text-muted">
                    {p.acceptanceRate}%
                  </td>
                  <td className={`py-4 px-6 ${getDifficultyColor(p.difficulty)}`}>
                    {p.difficulty}
                  </td>
                  <td className="py-4 px-6">
                    <span className="bg-[var(--bg-card)] pro-text-muted text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-[var(--border-color)]">
                      {p.category}
                    </span>
                  </td>
                </tr>
              ))}

              {problems.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-12 text-center pro-text-muted italic">
                    No problems found. Run the seeder script to populate questions!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
