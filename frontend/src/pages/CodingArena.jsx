import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import { 
  Code2, Search, Filter, CheckCircle2, Circle, Flame, 
  Sparkles, ArrowRight, Zap, Trophy, Shield, Brain, BookOpen, Clock
} from "lucide-react";

const DSA_TOPICS = [
  "All", "Arrays", "Strings", "Linked Lists", "Stacks", "Queues",
  "Trees", "Binary Search Trees", "Heaps", "Hashing", "Recursion",
  "Backtracking", "Dynamic Programming", "Graphs", "Greedy", "Sliding Window",
  "Binary Search", "Bit Manipulation", "Tries", "Segment Trees", "Union Find",
  "Shortest Path", "Advanced Graph Algorithms"
];

export default function CodingArena() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const [problems, setProblems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedTopic, setSelectedTopic] = useState("All");
  const [selectedDiff, setSelectedDiff] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const [dailyChallenge, setDailyChallenge] = useState(null);

  useEffect(() => {
    fetchProblems();
  }, [selectedTopic, selectedDiff, searchQuery, page]);

  useEffect(() => {
    fetchDailyChallenge();
  }, []);

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/coding/problems`, {
        params: {
          category: selectedTopic,
          difficulty: selectedDiff,
          search: searchQuery,
          page,
          limit: 15,
          userId
        }
      });
      setProblems(res.data.problems);
      setTotal(res.data.total);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error("Failed to load problems:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDailyChallenge = async () => {
    try {
      const localDate = new Date();
      const clientDate = `${localDate.getFullYear()}-${String(localDate.getMonth() + 1).padStart(2, '0')}-${String(localDate.getDate()).padStart(2, '0')}`;
      const res = await API.get("/coding/daily-challenge", { params: { userId, clientDate } });
      setDailyChallenge(res.data);
    } catch (err) {
      console.error("Failed to load daily challenge:", err);
    }
  };

  // Real-time client day calculation
  const clientDayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const currentDayOfWeek = clientDayNames[new Date().getDay()];

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[var(--bg-secondary)] border border-[var(--border-color)] p-6 md:p-8 rounded-3xl shadow-sm relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent-glow)] border border-[var(--border-color)] mb-3">
            <Code2 size={14} className="text-[var(--accent-primary)]" />
            <span className="text-[10px] font-black uppercase tracking-widest text-[var(--accent-primary)]">Algorithm Overwatch</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black pro-text-main tracking-tight uppercase">
            Coding <span className="text-[var(--accent-primary)]">Arena</span>
          </h1>
          <p className="pro-text-muted mt-1 text-sm font-medium max-w-xl">
            Battle-test your algorithmic intuition across 260+ curated DSA challenges with 3-tier automated test evaluation.
          </p>
        </div>

        {/* Quick Links */}
        <div className="flex items-center gap-3 relative z-10">
          <Link 
            to="/daily-challenge" 
            className="px-5 py-3 rounded-2xl bg-[var(--accent-glow)] border border-[var(--border-color)] hover:border-[var(--accent-primary)] transition-all flex items-center gap-2.5 font-bold text-xs pro-text-main shadow-sm"
          >
            <Flame size={16} className="text-amber-500 animate-pulse" />
            <span>Daily Challenge</span>
          </Link>
          <Link 
            to="/dsa-roadmap" 
            className="btn-primary !px-5 !py-3 rounded-2xl text-xs font-black uppercase tracking-wider shadow-lg flex items-center gap-2"
          >
            <BookOpen size={16} />
            <span>25-Set Roadmap</span>
          </Link>
        </div>
      </div>

      {/* Daily Challenge Spotlight Card */}
      {dailyChallenge && (
        <div className="hud-panel p-6 border-[var(--border-color)] bg-gradient-to-r from-[var(--bg-card)] via-[var(--bg-secondary)] to-[var(--bg-card)] relative overflow-hidden shadow-lg">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0">
                <Flame size={24} className="text-amber-500" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-amber-500">
                    TODAY'S CHALLENGE • {currentDayOfWeek.toUpperCase()}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                    dailyChallenge.difficulty === "Easy" ? "bg-emerald-500/10 text-emerald-500" :
                    dailyChallenge.difficulty === "Medium" ? "bg-amber-500/10 text-amber-500" : "bg-rose-500/10 text-rose-500"
                  }`}>
                    {dailyChallenge.difficulty}
                  </span>
                </div>
                <h3 className="text-xl font-black pro-text-main">
                  {dailyChallenge.problem?.title || "Daily Algorithmic Protocol"}
                </h3>
                <p className="pro-text-muted text-xs font-medium mt-0.5">
                  Reward: <span className="font-bold text-[var(--accent-primary)]">+{dailyChallenge.xpReward} XP</span> • {dailyChallenge.totalCompletions} engineers completed
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              {dailyChallenge.isCompleted ? (
                <div className="flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-xs font-bold w-full md:w-auto justify-center">
                  <CheckCircle2 size={16} /> Completed
                </div>
              ) : (
                <Link
                  to={`/coding/${dailyChallenge.problem?._id || dailyChallenge.problem?.slug}?daily=true`}
                  className="btn-primary !px-6 !py-3 w-full md:w-auto justify-center text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-xl"
                >
                  <span>Solve Challenge</span>
                  <ArrowRight size={16} />
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="glass-panel p-4 border-[var(--border-color)] space-y-4 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          {/* Search */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] opacity-50" size={18} />
            <input
              type="text"
              placeholder="Search algorithms, data structures, tags..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
              className="input-field pl-10 !py-2.5 text-xs shadow-sm"
            />
          </div>

          {/* Difficulty Chips */}
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            {["All", "Easy", "Medium", "Hard"].map(diff => (
              <button
                key={diff}
                onClick={() => { setSelectedDiff(diff); setPage(1); }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedDiff === diff
                    ? diff === "Easy" ? "bg-emerald-500 text-white shadow-md" :
                      diff === "Medium" ? "bg-amber-500 text-white shadow-md" :
                      diff === "Hard" ? "bg-rose-500 text-white shadow-md" :
                      "bg-[var(--accent-primary)] text-white shadow-md"
                    : "bg-[var(--bg-secondary)] border border-[var(--border-color)] pro-text-muted hover:pro-text-main"
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>

        {/* 22 DSA Topic Chips */}
        <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-2 pt-1">
          {DSA_TOPICS.map(topic => (
            <button
              key={topic}
              onClick={() => { setSelectedTopic(topic); setPage(1); }}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all ${
                selectedTopic === topic
                  ? "bg-[var(--accent-glow)] text-[var(--accent-primary)] border border-[var(--border-color)] shadow-sm font-black"
                  : "bg-[var(--bg-card)] border border-[var(--border-color)] pro-text-muted hover:pro-text-main"
              }`}
            >
              {topic}
            </button>
          ))}
        </div>
      </div>

      {/* Problems Table */}
      <div className="glass-panel overflow-hidden border-[var(--border-color)] shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--border-color)] bg-[var(--bg-secondary)] text-[10px] font-black uppercase tracking-widest pro-text-muted">
                <th className="py-4 px-6 w-16 text-center">Status</th>
                <th className="py-4 px-6">Problem Title</th>
                <th className="py-4 px-6">DSA Topic</th>
                <th className="py-4 px-6">Difficulty</th>
                <th className="py-4 px-6 text-center">Acceptance</th>
                <th className="py-4 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)]">
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-16 pro-text-muted font-bold">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-8 h-8 border-2 border-[var(--accent-primary)] border-t-transparent rounded-full animate-spin"></div>
                      <span>Scanning Problem Bank...</span>
                    </div>
                  </td>
                </tr>
              ) : problems.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-16 pro-text-muted font-medium">
                    No coding problems found matching criteria.
                  </td>
                </tr>
              ) : (
                problems.map((p, idx) => (
                  <tr 
                    key={p._id} 
                    onClick={() => navigate(`/coding/${p._id}`)}
                    className="hover:bg-[var(--bg-card)] transition-colors cursor-pointer group"
                  >
                    <td className="py-4 px-6 text-center">
                      {p.isSolved ? (
                        <CheckCircle2 size={18} className="text-emerald-500 mx-auto" />
                      ) : (
                        <Circle size={18} className="pro-text-muted opacity-30 mx-auto group-hover:opacity-60" />
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-bold text-sm pro-text-main group-hover:text-[var(--accent-primary)] transition-colors">
                        {(page - 1) * 15 + idx + 1}. {p.title}
                      </div>
                      <div className="flex gap-1.5 mt-1">
                        {p.tags?.slice(0, 2).map((t, ti) => (
                          <span key={ti} className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[var(--bg-secondary)] border border-[var(--border-color)] pro-text-muted">
                            {t}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-xs font-bold pro-text-muted">
                        {p.category}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        p.difficulty === "Easy" ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" :
                        p.difficulty === "Medium" ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" :
                        "bg-rose-500/10 text-rose-500 border border-rose-500/20"
                      }`}>
                        {p.difficulty}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center font-mono text-xs font-bold pro-text-muted">
                      {p.acceptanceRate}%
                    </td>
                    <td className="py-4 px-6 text-right">
                      <Link 
                        to={`/coding/${p._id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="btn-primary !px-4 !py-1.5 text-[10px] font-black uppercase tracking-wider inline-flex items-center gap-1.5 opacity-90 group-hover:opacity-100 shadow-sm"
                      >
                        <span>Solve</span>
                        <ArrowRight size={12} />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-[var(--border-color)] bg-[var(--bg-secondary)] flex justify-between items-center">
            <span className="text-xs pro-text-muted font-bold">
              Showing {(page - 1) * 15 + 1} - {Math.min(page * 15, total)} of {total} Problems
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-card)] text-xs font-bold disabled:opacity-40 pro-text-main shadow-sm"
              >
                Previous
              </button>
              <div className="flex items-center px-3 text-xs font-bold pro-text-main">
                {page} / {totalPages}
              </div>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-card)] text-xs font-bold disabled:opacity-40 pro-text-main shadow-sm"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
