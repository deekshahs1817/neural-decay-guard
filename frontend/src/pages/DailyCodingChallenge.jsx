import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import { 
  Flame, Trophy, Calendar as CalendarIcon, CheckCircle2, ArrowRight, Shield, 
  Sparkles, Award, Clock, Users, Zap, Star, ChevronRight, X, Timer, ExternalLink, Check
} from "lucide-react";

export default function DailyCodingChallenge() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const [challengeData, setChallengeData] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBadgeModal, setShowBadgeModal] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");

  // Real-time 24-hour Countdown Timer until Midnight Reset
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const midnight = new Date(now);
      midnight.setHours(24, 0, 0, 0);
      const diff = midnight - now;

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(
        `${String(hours).padStart(2, '0')}h ${String(mins).padStart(2, '0')}m ${String(secs).padStart(2, '0')}s`
      );
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchChallengeData = async () => {
    try {
      setLoading(true);
      const localDate = new Date();
      const clientDate = `${localDate.getFullYear()}-${String(localDate.getMonth() + 1).padStart(2, '0')}-${String(localDate.getDate()).padStart(2, '0')}`;
      
      const [challengeRes, statsRes] = await Promise.all([
        API.get("/coding/daily-challenge", { params: { userId, clientDate } }),
        API.get(`/userStats/${userId}`)
      ]);
      setChallengeData(challengeRes.data);
      setStats(statsRes.data);
    } catch (err) {
      console.error("Failed to load daily challenge data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChallengeData();
  }, []);

  const handleToggleDay = async (dateStr, problemId) => {
    if (!userId) return;

    // Optimistic instant state update for immediate green tick
    setChallengeData(prev => {
      if (!prev) return prev;
      const isToday = dateStr === currentDateStr;
      const newMonthDays = (prev.monthDays || []).map(d => {
        if (d.date === dateStr) {
          return { ...d, isCompleted: !d.isCompleted };
        }
        return d;
      });
      const newCompletedCount = newMonthDays.filter(d => d.isCompleted).length;
      return {
        ...prev,
        isCompleted: isToday ? !prev.isCompleted : prev.isCompleted,
        monthDays: newMonthDays,
        monthlyStats: prev.monthlyStats ? {
          ...prev.monthlyStats,
          completedCount: newCompletedCount,
          percentage: Math.round((newCompletedCount / (prev.monthlyStats.totalDays || 30)) * 100)
        } : prev.monthlyStats
      };
    });

    try {
      await API.post("/coding/toggle-calendar-day", {
        userId,
        dateStr,
        problemId: problemId || challengeData?.problem?._id
      });
      fetchChallengeData();
    } catch (err) {
      console.error("Failed to toggle calendar day:", err);
      fetchChallengeData();
    }
  };

  const openLeetCode = (title) => {
    const slug = (title || "two-sum").toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-');
    const url = `https://leetcode.com/problems/${slug}/`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  if (loading) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-2 border-[var(--accent-primary)] border-t-transparent rounded-full animate-spin"></div>
        <p className="pro-text-muted text-xs font-bold">Synchronizing Daily Challenge Protocol...</p>
      </div>
    );
  }

  const { monthlyStats, monthDays, weeklySchedule, problem } = challengeData || {};

  // Exact real-time local date calculation
  const localDate = new Date();
  const clientDayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const currentDayOfWeek = clientDayNames[localDate.getDay()];
  const currentDateStr = `${localDate.getFullYear()}-${String(localDate.getMonth() + 1).padStart(2, '0')}-${String(localDate.getDate()).padStart(2, '0')}`;

  const leetcodeSlug = (problem?.title || "two-sum").toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-');
  const leetcodeUrl = problem?.url || `https://leetcode.com/problems/${leetcodeSlug}/`;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-300 pb-16">
      {/* Hero Banner */}
      <div className="hud-panel p-8 border-[var(--border-color)] bg-gradient-to-r from-[var(--bg-secondary)] via-[var(--bg-card)] to-[var(--bg-secondary)] relative overflow-hidden shadow-lg">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-500 text-xs font-black uppercase">
                <Flame size={14} className="animate-bounce" /> Daily Neural Challenge
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold">
                <Timer size={13} />
                <span>Resets in: {timeLeft}</span>
              </div>
            </div>
            <h1 className="text-3xl md:text-5xl font-black pro-text-main tracking-tight uppercase">
              {currentDayOfWeek}'s <span className="text-[var(--accent-primary)]">Challenge</span>
            </h1>
            <p className="pro-text-muted text-sm font-medium max-w-lg">
              Practice one curated algorithm per day on LeetCode and check it off to earn your Monthly Champion Badge.
            </p>
          </div>

          {/* Active Retention Streak Badge (Powered by Daily Retention Quiz) */}
          <div className="p-5 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl flex items-center gap-4 shadow-sm">
            <div className="w-14 h-14 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-center text-amber-500">
              <Flame size={32} />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase pro-text-muted tracking-widest block">Retention Streak</span>
              <p className="text-3xl font-black font-mono pro-text-main">
                {stats?.quizStreak || stats?.learningStreak || stats?.streak || 0} <span className="text-sm font-normal pro-text-muted">Days</span>
              </p>
              <span className="text-[10px] text-amber-500 font-mono font-bold">Quiz Powered</span>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Retention Quiz Link Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-[var(--bg-card)] to-cyan-500/10 border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center shrink-0">
            <Zap size={24} className="animate-pulse" />
          </div>
          <div>
            <h3 className="text-base font-black pro-text-main uppercase tracking-tight flex items-center gap-2">
              <span>Daily Retention Quiz Protocol</span>
              <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">Main Streak Driver</span>
            </h3>
            <p className="text-xs pro-text-muted font-medium mt-0.5">
              Solve today's 5-question retention quiz to prevent synaptic decay and maintain your <strong>{stats?.quizStreak || stats?.learningStreak || stats?.streak || 0}-day active streak</strong>.
            </p>
          </div>
        </div>
        <Link
          to="/daily-quiz"
          className="btn-primary !px-6 !py-3 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 shrink-0 shadow-lg hover:scale-105 transition-transform"
        >
          <span>Take Retention Quiz</span>
          <ArrowRight size={15} />
        </Link>
      </div>

      {/* Today's LeetCode Challenge Card */}
      {challengeData && (
        <div className="glass-panel p-8 border-[var(--border-color)] space-y-6 shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-[var(--border-color)]">
            <div>
              <div className="flex items-center gap-2.5 mb-1.5">
                <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                  challengeData.difficulty === "Easy" ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" :
                  challengeData.difficulty === "Medium" ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" :
                  "bg-rose-500/10 text-rose-500 border border-rose-500/20"
                }`}>
                  {challengeData.difficulty} Difficulty
                </span>
                <span className="text-xs font-mono font-bold pro-text-muted">
                  {problem?.category}
                </span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-[var(--bg-secondary)] border border-[var(--border-color)] text-slate-400">
                  {currentDateStr}
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-black pro-text-main">
                {problem?.title}
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Direct LeetCode Link */}
              <button
                onClick={() => openLeetCode(problem?.title)}
                className="btn-primary !px-6 !py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-xl hover:scale-105 transition-transform"
              >
                <span>Solve on LeetCode</span>
                <ExternalLink size={15} />
              </button>

              {/* Manual Tick / Solved Toggle */}
              <button
                onClick={() => handleToggleDay(currentDateStr, problem?._id)}
                className={`px-6 py-3.5 rounded-2xl font-bold text-xs flex items-center gap-2 border transition-all ${
                  challengeData.isCompleted
                    ? "bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-md ring-2 ring-emerald-500/30"
                    : "bg-[var(--bg-secondary)] border-[var(--border-color)] pro-text-main hover:border-emerald-500 hover:text-emerald-400"
                }`}
              >
                <CheckCircle2 size={16} className={challengeData.isCompleted ? "text-emerald-400" : "text-slate-400"} />
                <span>{challengeData.isCompleted ? "Marked as Solved ✓" : "Mark as Solved"}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl">
              <span className="text-[10px] font-black uppercase pro-text-muted">Platform Completions</span>
              <p className="text-lg font-bold font-mono pro-text-main mt-1">
                {challengeData.totalCompletions || 1} Engineers Solved
              </p>
            </div>
            <div className="p-4 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl">
              <span className="text-[10px] font-black uppercase pro-text-muted">Expected Time Complexity</span>
              <p className="text-lg font-bold font-mono text-[var(--accent-primary)] mt-1">
                {problem?.timeComplexity || "O(N)"}
              </p>
            </div>
            <div className="p-4 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl">
              <span className="text-[10px] font-black uppercase pro-text-muted">Base Reward</span>
              <p className="text-lg font-bold font-mono text-emerald-500 mt-1">
                +{challengeData.xpReward || 20} XP Points
              </p>
            </div>
          </div>
        </div>
      )}

      {/* LeetCode-Style Monthly Calendar & Monthly Badge Progress */}
      <div className="glass-panel p-8 border-[var(--border-color)] space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border-color)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--accent-glow)] text-[var(--accent-primary)] flex items-center justify-center">
              <CalendarIcon size={20} />
            </div>
            <div>
              <h3 className="text-xl font-black pro-text-main uppercase tracking-tight">
                {monthlyStats?.monthName || "August"} {monthlyStats?.year || 2026} Calendar
              </h3>
              <p className="text-xs pro-text-muted font-medium">
                Click any day to solve on LeetCode and toggle checkmarks to earn the <strong>Monthly Champion Badge</strong>!
              </p>
            </div>
          </div>

          {/* Monthly Badge Pill */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] font-black uppercase pro-text-muted block">Monthly Progress</span>
              <span className="text-sm font-mono font-black text-amber-500">
                {monthlyStats?.completedCount || 0} / {monthlyStats?.totalDays || 30} Days ({monthlyStats?.percentage || 0}%)
              </span>
            </div>
            <button
              onClick={() => setShowBadgeModal(true)}
              className="p-3 bg-amber-500/10 border border-amber-500/30 text-amber-500 hover:bg-amber-500/20 rounded-2xl transition flex items-center gap-2 shadow-sm"
              title="View Monthly Badge"
            >
              <Trophy size={20} />
              <span className="text-xs font-black uppercase hidden sm:inline">Monthly Badge</span>
            </button>
          </div>
        </div>

        {/* LeetCode-Style 7-Column Calendar Grid */}
        <div className="space-y-2">
          {/* Day of Week Headers */}
          <div className="grid grid-cols-7 gap-2 text-center text-[11px] font-black uppercase pro-text-muted pb-1 font-mono">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-2">
            {/* Empty padding cells so Day 1 starts under its exact Day of the Week */}
            {Array.from({ 
              length: (monthDays && monthDays.length > 0 && monthDays[0].date) 
                ? new Date(monthDays[0].date + "T00:00:00").getDay() 
                : new Date(localDate.getFullYear(), localDate.getMonth(), 1).getDay() 
            }).map((_, padIdx) => (
              <div key={`pad-${padIdx}`} className="p-3 min-h-[85px] rounded-2xl border border-dashed border-slate-800/40 bg-slate-950/20 pointer-events-none" />
            ))}

            {monthDays?.map((d) => {
              const isToday = d.date === currentDateStr;

              return (
                <div
                  key={d.date}
                  className={`relative p-3 min-h-[85px] rounded-2xl border transition-all flex flex-col justify-between group ${
                    d.isCompleted
                      ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.15)]"
                      : isToday
                      ? "bg-amber-500/10 border-amber-500 text-amber-500 shadow-md ring-2 ring-amber-500/20"
                      : "bg-[var(--bg-secondary)] border-[var(--border-color)] hover:border-[var(--accent-primary)] hover:bg-[var(--bg-card)] pro-text-muted"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-mono font-bold text-xs">{d.dayNumber}</span>
                    
                    {/* Manual Tick Button on Calendar Day */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleDay(d.date, d.problemId);
                      }}
                      className={`p-1 rounded-full border transition-all ${
                        d.isCompleted
                          ? "bg-emerald-500 text-slate-950 border-emerald-400 shadow-md"
                          : "bg-slate-900/60 border-slate-700 text-slate-400 hover:border-emerald-400 hover:text-emerald-400"
                      }`}
                      title={d.isCompleted ? "Uncheck day" : "Mark problem as solved on LeetCode"}
                    >
                      <Check size={11} className={d.isCompleted ? "stroke-[3]" : ""} />
                    </button>
                  </div>

                  <div className="mt-1 flex items-center justify-between gap-1">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        openLeetCode(d.problemTitle);
                      }}
                      className={`text-[9px] font-mono font-bold block truncate hover:underline flex items-center gap-1 text-left w-full ${
                        d.isCompleted ? "text-emerald-400" : "pro-text-muted hover:text-[var(--accent-primary)]"
                      }`}
                      title={`Solve ${d.problemTitle || "Challenge"} on LeetCode`}
                    >
                      <span className="truncate">{d.problemTitle || "Challenge"}</span>
                      <ExternalLink size={9} className="shrink-0" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Monthly Badge Modal */}
      {showBadgeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="glass-panel p-8 max-w-md w-full border-[var(--border-color)] shadow-2xl relative space-y-6">
            <button
              onClick={() => setShowBadgeModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg transition"
            >
              <X size={20} />
            </button>

            <div className="text-center space-y-4">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 shadow-xl">
                <Award size={44} />
              </div>

              <div>
                <h3 className="text-2xl font-black pro-text-main uppercase">
                  {monthlyStats?.badgeName || "Monthly Coding Champion"}
                </h3>
                <p className="text-xs text-amber-500 font-mono font-bold mt-1">
                  Exclusive Monthly Achievement NFT
                </p>
              </div>

              <p className="text-xs pro-text-muted leading-relaxed">
                {monthlyStats?.badgeDescription || "Mastered the 30-Day LeetCode Daily Challenge Protocol."}
              </p>

              <div className="p-4 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="pro-text-muted">Monthly Protocol</span>
                  <span className="text-amber-500 font-mono">
                    {monthlyStats?.completedCount || 0} / {monthlyStats?.totalDays || 30} Days
                  </span>
                </div>
                <div className="w-full bg-[var(--bg-card)] rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-amber-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${monthlyStats?.percentage || 0}%` }}
                  />
                </div>
              </div>

              <button
                onClick={() => setShowBadgeModal(false)}
                className="w-full btn-primary !py-3 rounded-xl text-xs font-bold uppercase"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
