import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import { 
  Flame, Trophy, Calendar as CalendarIcon, CheckCircle2, ArrowRight, Shield, 
  Sparkles, Award, Clock, Users, Zap, Star, ChevronRight, X
} from "lucide-react";

export default function DailyCodingChallenge() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const [challengeData, setChallengeData] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBadgeModal, setShowBadgeModal] = useState(false);

  useEffect(() => {
    fetchChallengeData();
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

  if (loading) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-2 border-[var(--accent-primary)] border-t-transparent rounded-full animate-spin"></div>
        <p className="pro-text-muted text-xs font-bold">Synchronizing Daily Challenge Protocol...</p>
      </div>
    );
  }

  const { monthlyStats, monthDays, weeklySchedule, problem } = challengeData || {};

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-300 pb-16">
      {/* Hero Banner */}
      <div className="hud-panel p-8 border-[var(--border-color)] bg-gradient-to-r from-[var(--bg-secondary)] via-[var(--bg-card)] to-[var(--bg-secondary)] relative overflow-hidden shadow-lg">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-500 text-xs font-black uppercase">
              <Flame size={14} className="animate-bounce" /> Daily Neural Challenge
            </div>
            <h1 className="text-3xl md:text-5xl font-black pro-text-main tracking-tight uppercase">
              {challengeData?.dayOfWeek}'s <span className="text-[var(--accent-primary)]">Challenge</span>
            </h1>
            <p className="pro-text-muted text-sm font-medium max-w-lg">
              One algorithm per day to keep cognitive decay at zero and build compounding mastery.
            </p>
          </div>

          {/* Current Streak Badge */}
          <div className="p-5 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl flex items-center gap-4 shadow-sm">
            <div className="w-14 h-14 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-center text-amber-500">
              <Flame size={32} />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase pro-text-muted tracking-widest block">Coding Streak</span>
              <p className="text-3xl font-black font-mono pro-text-main">
                {stats?.codingStreak || stats?.streak || 0} <span className="text-sm font-normal pro-text-muted">Days</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Today's Challenge Card */}
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
              </div>
              <h2 className="text-2xl md:text-3xl font-black pro-text-main">
                {problem?.title}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              {challengeData.isCompleted ? (
                <div className="px-6 py-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 font-black text-sm flex items-center gap-2">
                  <CheckCircle2 size={18} /> Completed Today (+{challengeData.xpReward} XP)
                </div>
              ) : (
                <Link
                  to={`/coding/${problem?._id}?daily=true`}
                  className="btn-primary !px-8 !py-4 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-xl"
                >
                  <span>Solve Challenge (+{challengeData.xpReward} XP)</span>
                  <ArrowRight size={16} />
                </Link>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl">
              <span className="text-[10px] font-black uppercase pro-text-muted">Completion Rate</span>
              <p className="text-lg font-bold font-mono pro-text-main mt-1">
                {challengeData.totalCompletions} Engineers Solved
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
                +{challengeData.xpReward} XP Points
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
                {monthlyStats?.monthName} {monthlyStats?.year} Calendar
              </h3>
              <p className="text-xs pro-text-muted font-medium">
                Complete each day's challenge to earn a checkmark. Complete all days for the <strong>Monthly Champion Badge</strong>!
              </p>
            </div>
          </div>

          {/* Monthly Badge Pill */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] font-black uppercase pro-text-muted block">Monthly Progress</span>
              <span className="text-sm font-mono font-black text-amber-500">
                {monthlyStats?.completedCount} / {monthlyStats?.totalDays} Days ({monthlyStats?.percentage}%)
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
            {monthDays?.map((d) => (
              <div
                key={d.date}
                onClick={() => d.problemId && navigate(`/coding/${d.problemId}?daily=true`)}
                className={`relative p-3 min-h-[75px] rounded-2xl border transition-all cursor-pointer flex flex-col justify-between group ${
                  d.isCompleted
                    ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.15)]"
                    : d.isToday
                    ? "bg-amber-500/10 border-amber-500 text-amber-500 shadow-md animate-pulse"
                    : "bg-[var(--bg-secondary)] border-[var(--border-color)] hover:border-[var(--accent-primary)] hover:bg-[var(--bg-card)] pro-text-muted"
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-mono font-bold text-xs">{d.dayNumber}</span>
                  {d.isCompleted && (
                    <span className="p-0.5 rounded-full bg-emerald-500 text-slate-950">
                      <CheckCircle2 size={13} className="stroke-[3]" />
                    </span>
                  )}
                  {d.isToday && !d.isCompleted && (
                    <span className="px-1.5 py-0.2 rounded text-[8px] font-black uppercase bg-amber-500 text-slate-950">
                      Today
                    </span>
                  )}
                </div>

                <div className="mt-1">
                  <span className={`text-[9px] font-mono font-bold block truncate group-hover:text-[var(--accent-primary)] ${
                    d.isCompleted ? "text-emerald-400" : "pro-text-muted"
                  }`}>
                    {d.problemTitle || "Challenge"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Weekly Rotation Schedule & Streak Milestones Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Weekly Schedule with direct Access Problem action */}
        <div className="md:col-span-7 glass-panel p-6 border-[var(--border-color)] shadow-sm space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <CalendarIcon size={18} className="text-[var(--accent-primary)]" />
            <h3 className="text-sm font-black uppercase tracking-wider pro-text-main">Weekly Rotation Schedule</h3>
          </div>
          <div className="space-y-2">
            {weeklySchedule?.map((item) => (
              <div 
                key={item.day}
                className={`p-3.5 rounded-xl border flex items-center justify-between transition-colors ${
                  challengeData?.dayOfWeek === item.day
                    ? "bg-[var(--accent-glow)] border-[var(--accent-primary)] shadow-sm font-bold"
                    : "bg-[var(--bg-secondary)] border-[var(--border-color)] pro-text-muted hover:border-[var(--accent-primary)]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-black pro-text-main">{item.day}</span>
                  {challengeData?.dayOfWeek === item.day && (
                    <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-[var(--accent-primary)] text-white">Today</span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 font-mono text-xs">
                    <span className={`font-bold ${
                      item.diff === "Easy" ? "text-emerald-500" :
                      item.diff === "Medium" ? "text-amber-500" : "text-rose-500"
                    }`}>
                      {item.diff}
                    </span>
                    <span className="text-xs font-bold text-[var(--accent-primary)]">+{item.xp} XP</span>
                  </div>

                  {/* Direct Access Problem Button */}
                  {item.problemId && (
                    <Link
                      to={`/coding/${item.problemId}?daily=true`}
                      className="px-3 py-1 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-[var(--accent-primary)] text-[10px] font-black uppercase text-[var(--accent-primary)] flex items-center gap-1 transition shadow-sm"
                    >
                      <span>Access</span>
                      <ArrowRight size={11} />
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Streak Milestone Rewards */}
        <div className="md:col-span-5 glass-panel p-6 border-[var(--border-color)] shadow-sm space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Trophy size={18} className="text-amber-500" />
            <h3 className="text-sm font-black uppercase tracking-wider pro-text-main">Streak Bonuses</h3>
          </div>
          <div className="space-y-3">
            {[
              { milestone: "3-Day Streak", bonus: "+20 XP", desc: "Consistency Protocol Initialized" },
              { milestone: "7-Day Streak", bonus: "+50 XP", desc: "Weekly Habit Fortified" },
              { milestone: "30-Day Streak", bonus: "+300 XP", desc: "Grandmaster Neural Synapse" }
            ].map((m, i) => (
              <div key={i} className="p-4 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-xs pro-text-main">{m.milestone}</span>
                  <span className="font-mono font-black text-amber-500 text-xs">{m.bonus}</span>
                </div>
                <p className="text-[11px] pro-text-muted font-medium">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly Badge Celebration Modal */}
      {showBadgeModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="hud-panel max-w-md w-full p-8 text-center space-y-6 border-amber-500/40 shadow-2xl relative">
            <button
              onClick={() => setShowBadgeModal(false)}
              className="absolute top-4 right-4 p-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] pro-text-muted hover:pro-text-main"
            >
              <X size={18} />
            </button>

            {/* Holographic Badge Emblem */}
            <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-tr from-amber-600 via-amber-400 to-yellow-200 border-2 border-amber-300 flex items-center justify-center text-slate-950 shadow-[0_0_30px_rgba(251,191,36,0.6)]">
              <Trophy size={48} />
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-500 text-[10px] font-black uppercase">
                <Star size={12} /> Monthly Milestone Achievement
              </div>
              <h3 className="text-2xl font-black pro-text-main">
                {monthlyStats?.badgeName}
              </h3>
              <p className="text-xs pro-text-muted font-medium leading-relaxed">
                {monthlyStats?.badgeDescription}
              </p>
            </div>

            <div className="p-4 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl space-y-2 text-xs">
              <div className="flex justify-between font-bold">
                <span className="pro-text-muted">Month Completion</span>
                <span className="text-amber-500 font-mono">{monthlyStats?.completedCount} / {monthlyStats?.totalDays} Days</span>
              </div>
              <div className="w-full bg-[var(--bg-card)] h-2 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-amber-500 rounded-full" 
                  style={{ width: `${monthlyStats?.percentage}%` }}
                ></div>
              </div>
            </div>

            <button
              onClick={() => setShowBadgeModal(false)}
              className="btn-primary w-full !py-3.5 text-xs font-black uppercase tracking-wider"
            >
              Continue Daily Streak
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
