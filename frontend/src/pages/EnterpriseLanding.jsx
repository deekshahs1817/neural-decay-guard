import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Shield, Zap, Users, BarChart3, Radar, 
  ChevronRight, Brain, Globe, Cpu, Lock, CheckCircle2,
  Terminal as TerminalIcon, X, ArrowRight, Moon, Sun, BookOpen,
  Code2, GraduationCap, Flame, Sparkles, Award, Coffee, Activity
} from "lucide-react";
import Login from "./Login";
import Register from "./Register";

export default function EnterpriseLanding() {
  const [authMode, setAuthMode] = useState(null); // null, 'login', 'register'
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "study");
    if (theme !== "dark") {
      root.classList.add(theme);
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const cycleTheme = () => {
    if (theme === "dark") setTheme("light");
    else if (theme === "light") setTheme("study");
    else setTheme("dark");
  };

  const toggleAuth = (mode) => {
    setAuthMode(mode);
    if (mode) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const PLATFORM_PILLARS = [
    {
      title: "DSA Roadmap & LeetCode Practice",
      tag: "25-SET CURRICULUM",
      icon: BookOpen,
      desc: "25 structured algorithmic roadmap sets covering Arrays to Advanced Dynamic Programming, featuring topic-specific concept guides, interactive assessment quizzes, and hand-curated LeetCode problem recommendations.",
      stat: "25 Sets • 125 MCQs"
    },
    {
      title: "CSE Core Subjects Academy",
      tag: "7 ACCREDITED COURSES",
      icon: GraduationCap,
      desc: "175 structured mastery sets (875+ questions) across DBMS, OS, Computer Networks, COA, OOPs, TOC/Compilers, and System Design with verifiable cryptographic completion certificates.",
      stat: "175 Sets • 7 Certs"
    },
    {
      title: "Ebbinghaus Neural Decay Engine",
      tag: "SPACED REPETITION",
      icon: Activity,
      desc: "Real-time mathematical memory decay modeling (R = e^(-Δt/S)). Automatically generates personalized Daily Retention Quizzes tailored to your Knowledge Profile to prevent skill erosion.",
      stat: "Zero Cognitive Decay"
    },
    {
      title: "Focus Room & Recovery Chamber",
      tag: "COGNITIVE FLOW",
      icon: Coffee,
      desc: "Timed Deep Work sprints paired with science-backed mental reset protocols including 4-4-4-4 Box Breathing, Web Audio binaural soundscapes (432Hz), and 20-20-20 optical relief.",
      stat: "Flow State Optimized"
    }
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] pro-text-main selection:bg-[var(--accent-glow)] overflow-x-hidden transition-colors duration-200">
      {/* Background Grid & Ambient Glows */}
      <div className="fixed inset-0 neural-grid opacity-30 pointer-events-none"></div>
      <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[var(--accent-primary)] opacity-5 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-cyan-600/10 blur-[120px] rounded-full pointer-events-none"></div>

      {/* Navigation */}
      <nav className="relative z-[100] border-b border-[var(--border-color)] bg-[var(--bg-secondary)] backdrop-blur-xl shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-[var(--accent-glow)] border border-[var(--border-color)] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Brain className="text-[var(--accent-primary)]" size={24} />
            </div>
            <span className="text-xl font-black tracking-tighter uppercase italic pro-text-main">
              Neural <span className="text-[var(--accent-primary)]">Decay Guard</span>
            </span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-bold uppercase tracking-widest pro-text-muted">
            <a href="#pillars" className="hover:text-[var(--accent-primary)] transition-colors">Architecture</a>
            <a href="#curriculum" className="hover:text-[var(--accent-primary)] transition-colors">Curriculum</a>
            <a href="#decay-model" className="hover:text-[var(--accent-primary)] transition-colors">Retention Model</a>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={cycleTheme}
              className="p-2.5 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl hover:bg-[var(--bg-secondary)] transition-colors shadow-sm"
              title={`Switch to ${theme === 'dark' ? 'light' : theme === 'light' ? 'study' : 'dark'} mode`}
            >
              {theme === 'dark' ? <Moon size={18} className="text-[var(--accent-primary)]" /> : theme === 'light' ? <Sun size={18} className="text-[var(--accent-primary)]" /> : <BookOpen size={18} className="text-emerald-500" />}
            </button>
            <button 
              onClick={() => toggleAuth('login')}
              className="hidden sm:block text-sm font-bold uppercase tracking-widest pro-text-muted hover:pro-text-main transition-colors"
            >
              Access
            </button>
            <button 
              onClick={() => toggleAuth('register')}
              className="btn-primary !px-6 !py-2.5 text-[10px] tracking-[0.2em] font-black uppercase shadow-lg"
            >
              LAUNCH PLATFORM
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section / Auth Overlay */}
      <section className="relative pt-20 pb-16 px-6 min-h-[75vh] flex flex-col items-center justify-center">
        {authMode ? (
          <div className="w-full max-w-2xl relative animate-in fade-in zoom-in-95 duration-200">
             <div className="hud-panel p-1 border-[var(--border-color)] overflow-visible relative shadow-2xl">
                {/* Header for Auth Box */}
                <div className="bg-[var(--bg-secondary)] px-6 py-3.5 border-b border-[var(--border-color)] flex justify-between items-center rounded-t-3xl">
                   <div className="flex items-center gap-2">
                       <TerminalIcon size={14} className="text-[var(--accent-primary)]" />
                       <span className="text-[10px] font-mono text-[var(--accent-primary)] uppercase tracking-widest font-bold">
                         {authMode === 'login' ? 'ACCESS_PROTOCOL_v4.auth' : 'DEPLOYMENT_PROTOCOL_v4.init'}
                       </span>
                   </div>
                   <button onClick={() => toggleAuth(null)} className="p-1 hover:bg-[var(--bg-card)] rounded-full transition-colors pro-text-muted hover:pro-text-main">
                      <X size={16} />
                   </button>
                </div>
                
                {/* Auth Inner Content */}
                <div className="bg-[var(--bg-card)] p-4 md:p-8 rounded-b-3xl">
                   <div className="flex justify-center mb-8">
                      <div className="relative bg-[var(--bg-secondary)] p-1 rounded-xl border border-[var(--border-color)] flex w-full max-w-xs shadow-inner">
                         <div 
                           className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-[var(--accent-primary)] rounded-lg transition-all duration-200 shadow-md ${authMode === 'register' ? 'left-[calc(50%+2px)]' : 'left-1'}`}
                         ></div>
                         
                         <button 
                            onClick={() => setAuthMode('login')}
                            className={`relative z-10 flex-1 py-2 text-[10px] font-black uppercase tracking-widest transition-colors duration-200 ${authMode === 'login' ? 'text-white' : 'pro-text-muted hover:pro-text-main'}`}
                         >
                            Access
                         </button>
                         <button 
                            onClick={() => setAuthMode('register')}
                            className={`relative z-10 flex-1 py-2 text-[10px] font-black uppercase tracking-widest transition-colors duration-200 ${authMode === 'register' ? 'text-white' : 'pro-text-muted hover:pro-text-main'}`}
                         >
                            Initialize
                         </button>
                      </div>
                   </div>
                   
                   <div className="max-h-[65vh] overflow-y-auto custom-scrollbar px-2">
                      {authMode === 'login' ? <Login /> : <Register />}
                   </div>
                </div>
              </div>
             <div className="absolute -inset-10 bg-[var(--accent-primary)] opacity-5 blur-[100px] -z-10 rounded-full"></div>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto text-center animate-in fade-in slide-in-from-bottom-8 duration-500">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--accent-glow)] border border-[var(--border-color)] mb-8 shadow-sm">
              <span className="status-pulse w-2 h-2 !bg-[var(--accent-primary)] shadow-[0_0_10px_var(--accent-glow)]"></span>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--accent-primary)]">
                AI Coding & Knowledge Retention Architecture Active
              </span>
            </div>
            
            <h1 className="text-4xl md:text-7xl font-black tracking-tighter mb-6 leading-[1.05] pro-text-main">
              NEVER FORGET WHAT YOU LEARN. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-primary)] via-amber-400 to-[var(--accent-primary)]">
                MASTER DSA & CSE CORE FOREVER.
              </span>
            </h1>
            
            <p className="max-w-2xl mx-auto text-base md:text-lg pro-text-muted mb-10 font-medium leading-relaxed">
              The complete engineering skill retention platform. Combines LeetCode-style algorithmic coding, 7 accredited CSE core subject curriculums, and mathematical Ebbinghaus decay forecasting.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={() => toggleAuth('register')}
                className="btn-primary !px-10 !py-4 rounded-2xl group flex items-center gap-3 shadow-2xl active:scale-95 text-xs font-black uppercase tracking-widest"
              >
                <span>Initialize Platform</span>
                <ChevronRight className="group-hover:translate-x-1 transition-transform" size={18} />
              </button>
              <a 
                href="#pillars" 
                className="px-8 py-4 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] hover:bg-[var(--bg-secondary)] transition-all flex items-center gap-2 pro-text-main font-black uppercase tracking-widest text-xs shadow-sm"
              >
                 <span>Explore Systems</span>
                 <ArrowRight size={15} />
              </a>
            </div>
          </div>
        )}

        {/* Live System Telemetry Visual */}
        {!authMode && (
          <div className="max-w-5xl mx-auto mt-14 relative animate-in fade-in zoom-in-95 duration-500 delay-200 w-full">
            <div className="hud-panel p-6 md:p-8 backdrop-blur-3xl shadow-2xl">
               <div className="flex items-center justify-between mb-6 border-b border-[var(--border-color)] pb-4">
                  <div className="flex gap-2 items-center">
                     <div className="w-3 h-3 rounded-full bg-rose-500/60"></div>
                     <div className="w-3 h-3 rounded-full bg-amber-500/60"></div>
                     <div className="w-3 h-3 rounded-full bg-emerald-500/60"></div>
                     <span className="text-[10px] font-mono pro-text-muted ml-2">NEURAL_DECAY_GUARD_SYSTEMS.v4</span>
                  </div>
                  <p className="text-[10px] font-mono text-emerald-400 font-bold tracking-widest uppercase flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span> 100% OPERATIONAL
                  </p>
               </div>
               
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: "DSA Roadmap Sets", val: "25 Sets", icon: BookOpen, color: "text-[var(--accent-primary)]" },
                    { label: "CSE Core Sets", val: "175 Sets", icon: GraduationCap, color: "text-emerald-400" },
                    { label: "Memory Stability", val: "e^(-Δt/S)", icon: Activity, color: "text-rose-400" },
                    { label: "Curated LeetCode", val: "75+ Problems", icon: Sparkles, color: "text-amber-400" },
                  ].map((stat, i) => (
                    <div key={i} className="bg-[var(--bg-card)] border border-[var(--border-color)] p-4 rounded-xl shadow-sm">
                       <div className="flex items-center gap-2.5 mb-1.5">
                          <stat.icon size={16} className={stat.color} />
                          <span className="text-[10px] font-black uppercase tracking-widest pro-text-muted">{stat.label}</span>
                       </div>
                       <p className="text-xl font-mono font-bold pro-text-main">{stat.val}</p>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        )}
      </section>

      {/* Platform Pillars Grid */}
      <section id="pillars" className="py-24 px-6 relative border-t border-[var(--border-color)] bg-[var(--bg-secondary)]">
         <div className="max-w-7xl mx-auto space-y-16">
            <div className="text-center space-y-3">
               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent-glow)] border border-[var(--border-color)] text-[var(--accent-primary)] text-[10px] font-black uppercase tracking-widest">
                 System Architecture
               </div>
               <h2 className="text-3xl md:text-5xl font-black tracking-tight pro-text-main">
                 THE FOUR PILLARS OF MASTERY
               </h2>
               <p className="pro-text-muted text-xs md:text-sm max-w-xl mx-auto font-medium">
                 Engineered to transform short-term learning into permanent long-term cognitive synaptic memory.
               </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {PLATFORM_PILLARS.map((pillar, i) => (
                 <div key={i} className="glass-panel p-8 border-[var(--border-color)] hover:border-[var(--accent-primary)]/50 rounded-3xl transition-all shadow-sm space-y-4 group">
                    <div className="flex justify-between items-start">
                       <div className="w-12 h-12 bg-[var(--accent-glow)] border border-[var(--border-color)] rounded-2xl flex items-center justify-center text-[var(--accent-primary)] group-hover:scale-110 transition-transform">
                          <pillar.icon size={24} />
                       </div>
                       <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--accent-primary)] uppercase">
                         {pillar.stat}
                       </span>
                    </div>
                    
                    <div className="space-y-1">
                       <p className="text-[10px] font-black uppercase tracking-widest text-[var(--accent-primary)]">{pillar.tag}</p>
                       <h3 className="text-xl font-black pro-text-main">{pillar.title}</h3>
                    </div>
                    
                    <p className="pro-text-muted text-xs leading-relaxed font-medium">
                       {pillar.desc}
                    </p>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* CSE Academy & DSA Curriculum Section */}
      <section id="curriculum" className="py-24 px-6 relative border-t border-[var(--border-color)]">
         <div className="max-w-7xl mx-auto space-y-16">
            <div className="text-center space-y-3">
               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-black uppercase tracking-widest">
                 Accredited Curriculum
               </div>
               <h2 className="text-3xl md:text-5xl font-black tracking-tight pro-text-main">
                 CSE CORE COURSES & CERTIFICATES
               </h2>
               <p className="pro-text-muted text-xs md:text-sm max-w-xl mx-auto font-medium">
                 Every course contains 25 progression sets with 125 interactive questions, concept guides, and tamper-proof cryptographic certificates.
               </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { title: "Database Management Systems", code: "DBMS", sets: "25 Sets", q: "125 Qs" },
                { title: "Operating Systems", code: "OS", sets: "25 Sets", q: "125 Qs" },
                { title: "Computer Networks", code: "CN", sets: "25 Sets", q: "125 Qs" },
                { title: "Computer Organization (COA)", code: "COA", sets: "25 Sets", q: "125 Qs" },
                { title: "OOPs & Design Patterns", code: "OOPS", sets: "25 Sets", q: "125 Qs" },
                { title: "Theory of Computation & CD", code: "TOC", sets: "25 Sets", q: "125 Qs" },
                { title: "Software Eng & System Design", code: "SE", sets: "25 Sets", q: "125 Qs" },
                { title: "DSA Complete Roadmap", code: "DSA-25", sets: "25 Sets", q: "125 Qs + LeetCode" },
              ].map((c, i) => (
                <div key={i} className="bg-[var(--bg-card)] border border-[var(--border-color)] p-5 rounded-2xl space-y-2 hover:border-emerald-500/40 transition shadow-sm">
                   <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono">
                        {c.code}
                      </span>
                      <Award size={16} className="text-amber-500" />
                   </div>
                   <h4 className="font-black text-sm pro-text-main">{c.title}</h4>
                   <div className="flex justify-between text-[11px] pro-text-muted font-mono pt-1">
                      <span>{c.sets}</span>
                      <span className="text-emerald-500 font-bold">{c.q}</span>
                   </div>
                </div>
              ))}
            </div>
         </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-[var(--border-color)] px-6 bg-[var(--bg-secondary)]">
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 bg-[var(--accent-glow)] border border-[var(--border-color)] rounded-lg flex items-center justify-center">
                  <Brain size={16} className="text-[var(--accent-primary)]" />
               </div>
               <span className="text-xs font-black tracking-tighter uppercase pro-text-muted">
                  Neural Decay Guard // AI Engineering & Retention Engine // 2026
               </span>
            </div>
            <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest pro-text-muted">
               <span className="hover:text-[var(--accent-primary)] transition-colors cursor-pointer">Ebbinghaus Retention</span>
               <span className="hover:text-[var(--accent-primary)] transition-colors cursor-pointer">DSA Pattern Roadmap</span>
               <span className="hover:text-[var(--accent-primary)] transition-colors cursor-pointer">Cryptographic Verification</span>
            </div>
         </div>
      </footer>
    </div>
  );
}
