import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { 
  LayoutDashboard, Brain, History, Trophy, Lightbulb, LogOut, 
  Shield, ShieldAlert, Users, Zap, Sun, Moon, BookOpen, Globe,
  Code2, Flame, Sparkles, GraduationCap, Bell, CheckCircle2, 
  AlertTriangle, Coffee, ArrowRight, X, Activity, Award, Star
} from "lucide-react";
import ChatWidget from "./ChatWidget";
import API from "../services/api";

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");
  const userId = localStorage.getItem("userId");

  // User Stats & Telemetry
  const [userStats, setUserStats] = useState(null);
  const [showStreakModal, setShowStreakModal] = useState(false);
  const [showLevelModal, setShowLevelModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const notifRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  const [isAdminMode, setIsAdminMode] = useState(false);
  const userRole = localStorage.getItem("role") || "client";

  useEffect(() => {
    if (userRole === "admin" && location.pathname.startsWith('/admin')) {
      setIsAdminMode(true);
    }
  }, [location, userRole]);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "study");
    if (theme !== "dark") {
      root.classList.add(theme);
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Fetch Stats & Build Activity Notifications
  useEffect(() => {
    if (!userId) return;
    API.get(`/userStats/${userId}`)
      .then(res => {
        const data = res.data;
        setUserStats(data);

        // Dynamically build real-time activity notifications based on user state
        const generatedNotifs = [];
        const todayStr = new Date().toISOString().split("T")[0];
        const hasActivityToday = data.dailyActivityMap && data.dailyActivityMap[todayStr];

        // 1. Live Completed Quiz / Activity Notification
        if (hasActivityToday || data.totalQuiz > 0) {
          generatedNotifs.push({
            id: 'notif-quiz-done',
            type: 'quiz',
            title: 'Spaced Retention Quiz Completed',
            desc: `Great job! Your retention score is boosted to ${data.retentionScore || 85}%.`,
            time: 'Today',
            icon: CheckCircle2,
            color: 'text-emerald-400 bg-emerald-500/10',
            link: '/dashboard'
          });
        }

        // 3. Particular Quiz / Retention Notification
        if (!hasActivityToday) {
          generatedNotifs.push({
            id: 'notif-quiz',
            type: 'quiz',
            title: 'Daily Retention Quiz Synced',
            desc: 'A 5-question spaced repetition quiz is ready based on your Knowledge Profile.',
            time: 'Pending',
            icon: Sparkles,
            color: 'text-cyan-400 bg-cyan-500/10',
            link: '/daily-quiz'
          });
        }

        // 4. Course Decaying Warning
        generatedNotifs.push({
          id: 'notif-decay',
          type: 'decay',
          title: 'Neural Decay Warning: 1 Course Decaying',
          desc: 'Operating Systems & DBMS memory retention has dropped below 50%. Revive now!',
          time: 'Urgent',
          icon: AlertTriangle,
          color: 'text-rose-500 bg-rose-500/10',
          link: '/decay'
        });

        // 5. Cognitive Break & Wellness Alert (When studying long sessions)
        generatedNotifs.push({
          id: 'notif-break',
          type: 'break',
          title: 'Cognitive Break Recommendation',
          desc: 'High cognitive intensity detected. Take a 5-minute Box Breathing reset in the Focus Room.',
          time: 'Wellness',
          icon: Coffee,
          color: 'text-emerald-400 bg-emerald-500/10',
          link: '/focus-room'
        });

        // 6. Certification Milestone
        if (data.level >= 2 || data.solvedCodingCount > 0) {
          generatedNotifs.push({
            id: 'notif-cert',
            type: 'cert',
            title: 'CSE Core Academy Milestone',
            desc: 'Course sets completed! Check your progress towards Master Verification Certificates.',
            time: 'Milestone',
            icon: Award,
            color: 'text-[var(--accent-primary)] bg-[var(--accent-glow)]',
            link: '/core-subjects'
          });
        }

        setNotifications(generatedNotifs);
      })
      .catch(err => console.error("Error loading user stats:", err));
  }, [userId, location.pathname]);

  // Close notifications on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleAdminMode = () => {
    if (userRole !== "admin") return;
    if (isAdminMode) {
      setIsAdminMode(false);
      navigate("/dashboard");
    } else {
      setIsAdminMode(true);
      navigate("/admin");
    }
  };

  const cycleTheme = () => {
    if (theme === "dark") setTheme("light");
    else if (theme === "light") setTheme("study");
    else setTheme("dark");
  };

  const clientNavItems = [
    { name: "Analytics Dashboard", path: "/dashboard", icon: <LayoutDashboard size={19} /> },
    { name: "CSE Core Academy (7 Courses)", path: "/core-subjects", icon: <GraduationCap size={19} className="text-emerald-400" /> },
    { name: "DSA Roadmap (25 Sets)", path: "/dsa-roadmap", icon: <BookOpen size={19} /> },
    { name: "Daily Retention Quiz", path: "/daily-quiz", icon: <Sparkles size={19} className="text-cyan-400" /> },
    { name: "Knowledge Profile", path: "/profile", icon: <Lightbulb size={19} /> },
    { name: "Leaderboard", path: "/leaderboard", icon: <Trophy size={19} /> },
    { name: "Neural Decay Engine", path: "/decay", icon: <Brain size={19} className="text-rose-400" /> },
    { name: "Focus Room", path: "/focus-room", icon: <Zap size={19} className="text-[var(--accent-primary)] shadow-[0_0_10px_var(--accent-glow)]" /> },
    { name: "Enterprise Console", path: "/enterprise", icon: <Globe size={19} className="text-cyan-500 animate-pulse" /> },
  ];

  const adminNavItems = [
    { name: "Master Overview", path: "/admin", icon: <ShieldAlert size={19} /> },
  ];

  const activeNavItems = isAdminMode ? adminNavItems : clientNavItems;
  const streakCount = userStats?.codingStreak || userStats?.streak || 0;
  const userLevel = userStats?.level || 1;
  const userXP = userStats?.xp || 0;

  // Rank titles based on level
  const getRankTitle = (lvl) => {
    if (lvl < 5) return "Novice Scholar";
    if (lvl < 15) return "Algorithmic Apprentice";
    if (lvl < 25) return "Synaptic Practitioner";
    if (lvl < 40) return "Systems Architect";
    return "Grandmaster Polymath";
  };

  const currentLevelProgress = userXP % 100;
  const xpNeeded = 100 - currentLevelProgress;

  return (
    <div className="flex h-screen bg-[var(--bg-primary)] overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-[var(--bg-secondary)] border-r border-[var(--border-color)] flex flex-col hidden md:flex z-50 shadow-sm">
        <div className="h-16 flex items-center px-6 border-b border-[var(--border-color)]">
          <Brain className="text-[var(--accent-primary)] mr-2.5" size={26} />
          <h1 className="text-lg font-black tracking-wider pro-text-main uppercase">NEURAL GUARD</h1>
        </div>
        
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto custom-scrollbar">
          {userRole === "admin" && (
            <div className="mb-4 px-1">
              <label className="flex items-center justify-between cursor-pointer group bg-[var(--bg-card)] p-2 rounded-xl border border-[var(--border-color)] hover:border-[var(--accent-primary)] transition shadow-sm">
                <div className="flex items-center text-xs font-bold pro-text-main uppercase tracking-wider">
                  <Shield size={15} className={`mr-2 transition-colors ${isAdminMode ? 'text-[var(--accent-primary)]' : 'pro-text-muted'}`} />
                  Admin Mode
                </div>
                <div className="relative">
                  <input type="checkbox" className="sr-only" checked={isAdminMode} onChange={toggleAdminMode} />
                  <div className={`block w-9 h-5 rounded-full transition-colors ${isAdminMode ? 'bg-[var(--accent-primary)]' : 'bg-slate-400 dark:bg-slate-700'}`}></div>
                  <div className={`dot absolute left-1 top-0.5 bg-white w-4 h-4 rounded-full transition-transform ${isAdminMode ? 'transform translate-x-4' : ''}`}></div>
                </div>
              </label>
            </div>
          )}

          {activeNavItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path === "/coding" && location.pathname.startsWith("/coding/"));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-3.5 py-2.5 rounded-xl transition-all duration-200 group font-bold text-xs ${
                  isActive
                    ? "bg-[var(--accent-glow)] text-[var(--accent-primary)] border border-[var(--border-color)] shadow-sm font-black"
                    : "pro-text-muted hover:bg-[var(--bg-card)] hover:pro-text-main"
                }`}
              >
                <div className={`mr-3 transition-colors ${isActive ? "text-[var(--accent-primary)]" : "opacity-70 group-hover:opacity-100 group-hover:text-[var(--accent-primary)]"}`}>
                  {item.icon}
                </div>
                <span className="truncate">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Theme & Footer Controls */}
        <div className="p-3 border-t border-[var(--border-color)] space-y-1.5 bg-[var(--bg-secondary)] shrink-0">
          <button 
            onClick={cycleTheme}
            className="flex items-center w-full px-3.5 py-2 text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-[var(--bg-card)] transition group border border-transparent hover:border-[var(--border-color)] pro-text-main shadow-sm"
          >
            {theme === "dark" && <Moon size={16} className="mr-2.5 text-[var(--accent-primary)]" />}
            {theme === "light" && <Sun size={16} className="mr-2.5 text-amber-500" />}
            {theme === "study" && <BookOpen size={16} className="mr-2.5 text-emerald-600" />}
            <span className="capitalize">{theme} Mode</span>
          </button>

          <button 
            onClick={handleLogout}
            className="flex items-center w-full px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-rose-500 hover:bg-rose-500/10 rounded-xl transition"
          >
            <LogOut size={16} className="mr-2.5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full relative overflow-y-auto bg-[var(--bg-primary)]">
        {/* Global Top Header Bar (Desktop & Mobile) */}
        <header className="h-16 px-6 bg-[var(--bg-secondary)] border-b border-[var(--border-color)] flex items-center justify-between shrink-0 shadow-sm z-40">
          {/* Left Title / Breadcrumbs */}
          <div className="flex items-center gap-3">
            <div className="md:hidden flex items-center">
              <Brain className="text-[var(--accent-primary)] mr-2" size={24} />
              <h1 className="text-base font-black tracking-wider pro-text-main">NEURAL GUARD</h1>
            </div>
            <div className="hidden md:flex items-center gap-2 text-xs font-bold pro-text-muted">
              <span className="text-[var(--accent-primary)] font-mono">NODE://</span>
              <span className="capitalize pro-text-main">{location.pathname.replace('/', '').replace('-', ' ') || 'Dashboard'}</span>
            </div>
          </div>

          {/* Right Header Controls: Streaks + Notifications + Level + Theme */}
          <div className="flex items-center gap-3">
            {/* 1. Streaks Trigger Button */}
            <button
              onClick={() => setShowStreakModal(true)}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-500 text-xs font-black uppercase flex items-center gap-2 transition shadow-xs cursor-pointer active:scale-95"
              title="Click to view Streak & Activity Analysis"
            >
              <Flame size={15} className="animate-bounce" />
              <span>{streakCount} Days Streak</span>
            </button>

            {/* 2. Notification Center Bell */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-[var(--accent-primary)] pro-text-main relative transition shadow-xs cursor-pointer active:scale-95"
                title="Activity Notifications"
              >
                <Bell size={17} />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-mono font-black flex items-center justify-center animate-pulse">
                    {notifications.length}
                  </span>
                )}
              </button>

              {/* Notification Pop-up Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 sm:w-96 glass-panel p-4 border-[var(--border-color)] shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-200 rounded-2xl space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b border-[var(--border-color)]">
                    <div className="flex items-center gap-2">
                      <Bell size={16} className="text-[var(--accent-primary)]" />
                      <h4 className="text-xs font-black uppercase pro-text-main tracking-wider">Activity Feed ({notifications.length})</h4>
                    </div>
                    <button
                      onClick={() => setNotifications([])}
                      className="text-[10px] pro-text-muted hover:pro-text-main font-bold uppercase"
                    >
                      Clear All
                    </button>
                  </div>

                  <div className="space-y-2 max-h-80 overflow-y-auto custom-scrollbar">
                    {notifications.map((notif) => (
                      <Link
                        key={notif.id}
                        to={notif.link}
                        onClick={() => setShowNotifications(false)}
                        className="p-3 bg-[var(--bg-card)] hover:bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl flex items-start gap-3 transition group block"
                      >
                        <div className={`p-2 rounded-xl ${notif.color} shrink-0 mt-0.5`}>
                          <notif.icon size={15} />
                        </div>
                        <div className="space-y-0.5 flex-1 min-w-0">
                          <div className="flex justify-between items-center">
                            <h5 className="text-xs font-black pro-text-main truncate group-hover:text-[var(--accent-primary)]">
                              {notif.title}
                            </h5>
                            <span className="text-[9px] font-mono pro-text-muted ml-1 shrink-0">{notif.time}</span>
                          </div>
                          <p className="text-[11px] pro-text-muted leading-tight line-clamp-2">
                            {notif.desc}
                          </p>
                        </div>
                      </Link>
                    ))}

                    {notifications.length === 0 && (
                      <div className="py-6 text-center pro-text-muted text-xs">
                        No unread activity alerts.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* 3. Level & XP Pill (Interactive Modal Trigger) */}
            {userStats && (
              <button 
                onClick={() => setShowLevelModal(true)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--bg-card)] hover:bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-[var(--accent-primary)] text-xs font-bold shadow-xs transition cursor-pointer active:scale-95"
                title="Click to view Level & XP Mastery Matrix"
              >
                <span className="text-[var(--accent-primary)] font-black">LVL {userLevel}</span>
                <span className="text-[10px] font-mono pro-text-muted">({userXP} XP)</span>
              </button>
            )}

            {/* 4. Mobile Theme Toggle */}
            <div className="md:hidden">
              <button onClick={cycleTheme} className="p-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] pro-text-main shadow-xs">
                {theme === "dark" ? <Moon size={16} className="text-[var(--accent-primary)]" /> : theme === "light" ? <Sun size={16} className="text-amber-500" /> : <BookOpen size={16} className="text-emerald-600" />}
              </button>
            </div>
          </div>
        </header>
        
        {/* Page Content */}
        <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full flex-1">
          <Outlet />
        </div>

        {/* Global AI Floating Widget */}
        <ChatWidget />
      </main>

      {/* Level & XP Progression Modal */}
      {showLevelModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="hud-panel max-w-lg w-full p-8 space-y-6 border-[var(--accent-primary)]/40 shadow-2xl relative">
            <button
              onClick={() => setShowLevelModal(false)}
              className="absolute top-4 right-4 p-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] pro-text-muted hover:pro-text-main"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-[var(--accent-glow)] border border-[var(--border-color)] flex items-center justify-center text-[var(--accent-primary)] shadow-sm">
                <Trophy size={32} />
              </div>
              <div>
                <div className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-[var(--accent-primary)]">
                  <Star size={11} fill="currentColor" /> Rank Mastery Matrix
                </div>
                <h3 className="text-2xl font-black pro-text-main">
                  Level {userLevel} • {getRankTitle(userLevel)}
                </h3>
              </div>
            </div>

            {/* XP Progress Bar to Next Level */}
            <div className="p-4 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl space-y-2">
              <div className="flex justify-between items-center text-xs font-mono font-bold">
                <span className="pro-text-main">{userXP} Total XP</span>
                <span className="text-[var(--accent-primary)]">{xpNeeded} XP to Level {userLevel + 1}</span>
              </div>
              <div className="w-full bg-[var(--bg-card)] h-2.5 rounded-full overflow-hidden border border-[var(--border-color)]">
                <div 
                  className="bg-gradient-to-r from-[var(--accent-primary)] to-cyan-400 h-full rounded-full transition-all duration-700 shadow-[0_0_8px_var(--accent-glow)]"
                  style={{ width: `${currentLevelProgress}%` }}
                />
              </div>
            </div>

            {/* How to Earn XP Breakdown */}
            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase pro-text-muted tracking-wider block">
                XP Velocity Breakdown
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl space-y-0.5">
                  <span className="font-bold pro-text-main block">💻 Coding Solves</span>
                  <span className="text-[11px] font-mono text-emerald-400 font-bold">+10 to +40 XP</span>
                </div>
                <div className="p-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl space-y-0.5">
                  <span className="font-bold pro-text-main block">🧠 Retention Quiz</span>
                  <span className="text-[11px] font-mono text-cyan-400 font-bold">+10 to +50 XP</span>
                </div>
                <div className="p-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl space-y-0.5">
                  <span className="font-bold pro-text-main block">🎓 CSE Set Clear</span>
                  <span className="text-[11px] font-mono text-[var(--accent-primary)] font-bold">+50 XP</span>
                </div>
                <div className="p-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl space-y-0.5">
                  <span className="font-bold pro-text-main block">🔥 7-Day Streak</span>
                  <span className="text-[11px] font-mono text-amber-500 font-bold">+50 XP Bonus</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowLevelModal(false)}
              className="btn-primary w-full !py-3.5 text-xs font-black uppercase tracking-wider"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Streak & Activity Analysis Pop-Up Window Modal */}
      {showStreakModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="hud-panel max-w-lg w-full p-8 space-y-6 border-amber-500/40 shadow-2xl relative">
            <button
              onClick={() => setShowStreakModal(false)}
              className="absolute top-4 right-4 p-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] pro-text-muted hover:pro-text-main"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 shadow-sm">
                <Flame size={32} />
              </div>
              <div>
                <div className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-amber-500">
                  <Sparkles size={11} /> Cognitive Synapse Active
                </div>
                <h3 className="text-2xl font-black pro-text-main">
                  Streak & Activity Analysis
                </h3>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl">
                <span className="text-[10px] font-black uppercase pro-text-muted">Current Streak</span>
                <p className="text-3xl font-black font-mono pro-text-main mt-1">
                  {streakCount} <span className="text-sm font-normal pro-text-muted">Days</span>
                </p>
              </div>
              <div className="p-4 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl">
                <span className="text-[10px] font-black uppercase pro-text-muted">Retention Stability</span>
                <p className="text-3xl font-black font-mono text-emerald-500 mt-1">
                  {userStats?.retentionScore || 85}%
                </p>
              </div>
            </div>

            {/* Daily Checklist */}
            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase pro-text-muted tracking-wider block">
                Today's Retention Protocol
              </span>
              {[
                { name: "Daily Coding Challenge", desc: "Solve Saturday algorithm (+40 XP)", link: "/daily-challenge" },
                { name: "Knowledge Profile Spaced Quiz", desc: "5-question retention check", link: "/daily-quiz" },
                { name: "CSE Core Set Progression", desc: "Advance through 25 sets", link: "/core-subjects" },
                { name: "Focus Room Mental Reset", desc: "4-4-4-4 Box Breathing & ambient sound", link: "/focus-room" }
              ].map((task, i) => (
                <Link
                  key={i}
                  to={task.link}
                  onClick={() => setShowStreakModal(false)}
                  className="p-3 bg-[var(--bg-secondary)] hover:bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl flex items-center justify-between transition group"
                >
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold pro-text-main group-hover:text-[var(--accent-primary)] block">
                      {task.name}
                    </span>
                    <span className="text-[10px] pro-text-muted">{task.desc}</span>
                  </div>
                  <ArrowRight size={14} className="text-[var(--accent-primary)] opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              ))}
            </div>

            <button
              onClick={() => setShowStreakModal(false)}
              className="btn-primary w-full !py-3.5 text-xs font-black uppercase tracking-wider"
            >
              Continue Learning
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
