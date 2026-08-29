import { useState, useEffect } from "react";
import { 
  Activity, Users, Zap, Shield, ChevronRight, 
  Terminal, BarChart3, Radar, AlertTriangle, 
  Globe, Radio, Cpu, Database
} from "lucide-react";
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, 
  Tooltip, RadarChart, PolarGrid, PolarAngleAxis, 
  PolarRadiusAxis, Radar as RadarArea, BarChart, Bar
} from "recharts";
import API from "../services/api";

export default function EnterpriseBoard() {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState(null);
  const [decayData, setDecayData] = useState([]);
  const [skillGaps, setSkillGaps] = useState(null);
  const [logs, setLogs] = useState([]);
  const [autoProtocol, setAutoProtocol] = useState(false);

  // Mock Simulations for the HUD
  const mockActivity = Array.from({ length: 20 }, (_, i) => ({
    time: i,
    load: 60 + Math.random() * 30,
    intensity: 40 + Math.random() * 50
  }));

  const mockTeams = [
    { name: "Neural Ops", health: 94, status: "Optimal", color: "#10b981" },
    { name: "Logic Core", health: 82, status: "Caution", color: "#f59e0b" },
    { name: "Memory Hive", health: 65, status: "Critical", color: "#ef4444" },
    { name: "Security Mesh", health: 91, status: "Active", color: "#06b6d4" }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [metricsRes, decayRes] = await Promise.all([
          API.get("/enterprise/metrics"),
          API.get("/enterprise/decay-map")
        ]);
        setMetrics(metricsRes.data);
        setDecayData(decayRes.data);
        
        // Push initial simulation logs
        addLog("Neural link established. Syncing Enterprise Cortex...");
        addLog("Scanning team 'Memory Hive': Knowledge decay detected in Recursion protocols.");
        addLog("AI Skill Gap Analyzer operational.");
      } catch (err) {
        console.error("Enterprise fetch failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    
    const interval = setInterval(() => {
       const events = [
         "Subject-404: Cognitive spike detected in Logic Room.",
         "Automated Daily Quiz assigned to 12 entities in 'Neural Ops'.",
         "Neural Decay rate stabilized in 'Security Mesh'.",
         "Socratic Prompt updated for 'Graph Theory' module."
       ];
       addLog(events[Math.floor(Math.random() * events.length)]);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const addLog = (msg) => {
    setLogs(prev => [
      { id: Date.now(), time: new Date().toLocaleTimeString(), message: msg },
      ...prev.slice(0, 10)
    ]);
  };

  const fetchSkillGap = async (teamName) => {
     addLog(`Inquiry sent to Gemini for ${teamName} skill gap...`);
     try {
       const res = await API.get("/enterprise/skill-gap/65f1a2b3c4d5e6f7a8b9c0d1");
       setSkillGaps(res.data);
     } catch (err) {
       addLog("AI Error: Connection to Gemini refused. Switching to local heuristic.");
     }
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-[var(--bg-primary)] text-[var(--accent-primary)] font-mono">
       <div className="flex flex-col items-center">
         <Radio className="animate-ping mb-4" />
         <p className="glitch-text uppercase tracking-[0.3em] font-bold">Calibrating Neural HUD...</p>
       </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] neural-grid p-6 space-y-6 animate-in fade-in duration-500">
      
      {/* HUD Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
        <div className="flex items-center gap-4">
          <div className="status-pulse !bg-[var(--accent-primary)] shadow-[0_0_15px_var(--accent-glow)]"></div>
          <div>
            <h1 className="text-3xl font-black pro-text-main tracking-tighter flex items-center gap-2">
              CORTEX <span className="text-[var(--accent-primary)] italic">ENTERPRISE</span> <Shield className="text-[var(--accent-primary)]" size={20}/>
            </h1>
            <p className="text-[10px] font-mono pro-text-muted uppercase tracking-widest font-bold">Global Cognitive Command Center // SECURE CONNECTION</p>
          </div>
        </div>
        
        <div className="flex gap-4">
          <div className="hud-panel px-6 py-2 flex items-center gap-3">
             <div className="text-right">
                <p className="text-[10px] text-[var(--accent-primary)] font-black uppercase tracking-widest">Memory Integrity</p>
                <p className="text-xl font-mono font-bold pro-text-main">99.98%</p>
             </div>
             <div className="h-8 w-px bg-[var(--border-color)]"></div>
             <BarChart3 className="text-[var(--accent-primary)]" size={24}/>
          </div>
          <div className="hud-panel px-6 py-2 flex items-center gap-3">
             <div className="text-right">
                <p className="text-[10px] text-cyan-500 font-black uppercase tracking-widest">Active Nodes</p>
                <p className="text-xl font-mono font-bold pro-text-main">{metrics?.totalUsers || 248}</p>
             </div>
             <div className="h-8 w-px bg-[var(--border-color)]"></div>
             <Users className="text-cyan-500" size={24}/>
          </div>
        </div>
      </div>

      {/* Main Stats Row */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Real-time Telemetry */}
        <div className="lg:col-span-3 hud-panel p-6">
          <div className="flex justify-between items-center mb-6">
             <h3 className="text-xs font-black uppercase tracking-widest text-[var(--accent-primary)] flex items-center gap-2">
               <Activity size={16}/> Workforce Engagement Flux
             </h3>
             <div className="flex gap-4 text-[10px] font-mono font-bold">
                <span className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm bg-[var(--accent-primary)]"></div> Neural Load</span>
                <span className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm bg-cyan-500"></div> Retention Rate</span>
             </div>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockActivity}>
                <defs>
                   <linearGradient id="colorLoad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.35}/>
                    <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorIntensity" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.35}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="load" stroke="var(--accent-primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorLoad)" />
                <Area type="monotone" dataKey="intensity" stroke="#06b6d4" strokeWidth={2} fillOpacity={0.4} fill="url(#colorIntensity)" strokeDasharray="5 5" />
                <Tooltip 
                  contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '12px', fontSize: '11px', backdropFilter: 'blur(10px)', color: 'var(--text-primary)', fontWeight: 600 }}
                  itemStyle={{ color: 'var(--text-primary)' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Global Decay Radar */}
        <div className="hud-panel p-6">
           <h3 className="text-xs font-black uppercase tracking-widest text-cyan-500 mb-4">Neural Decay Radar</h3>
           <div className="h-[220px] w-full flex items-center justify-center">
             <ResponsiveContainer width="100%" height="100%">
               <RadarChart cx="50%" cy="50%" outerRadius="80%" data={decayData}>
                 <PolarGrid stroke="var(--border-color)" />
                 <PolarAngleAxis dataKey="category" tick={{ fill: 'var(--text-secondary)', fontSize: 10, fontWeight: 600 }} />
                 <RadarArea name="Team Health" dataKey="health" stroke="var(--accent-enterprise)" fill="var(--accent-enterprise)" fillOpacity={0.5} />
               </RadarChart>
             </ResponsiveContainer>
           </div>
           <div className="mt-4 p-4 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl">
              <p className="text-[10px] text-[var(--accent-primary)] mb-1 font-black uppercase tracking-widest">Decay Alert</p>
              <p className="text-xs pro-text-muted leading-relaxed italic">"Logic skills have declined by 4% in Team Delta over 7 days."</p>
           </div>
        </div>
      </div>

      {/* Middle Row: Teams & AI Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Team Performance Tracking */}
        <div className="hud-panel p-6">
           <div className="flex justify-between items-center mb-6">
             <h3 className="text-xs font-black uppercase tracking-widest text-[var(--accent-primary)]">Active Squad Metrics</h3>
             <ChevronRight className="pro-text-muted cursor-pointer" size={16}/>
           </div>
           <div className="space-y-4">
              {mockTeams.map((team) => (
                <div key={team.name} className="flex items-center justify-between p-4 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-color)] hover:border-[var(--accent-primary)] transition shadow-sm group">
                  <div className="flex items-center gap-3">
                     <div className="w-2.5 h-8 rounded-full" style={{ backgroundColor: team.color }}></div>
                     <div>
                        <p className="text-sm font-bold pro-text-main group-hover:text-[var(--accent-primary)] transition-colors uppercase tracking-tight">{team.name}</p>
                        <p className="text-[10px] pro-text-muted uppercase font-black">{team.status}</p>
                     </div>
                  </div>
                  <div className="text-right">
                     <p className="text-lg font-mono font-black pro-text-main">{team.health}%</p>
                     <div className="w-24 h-1.5 bg-[var(--border-color)] rounded-full overflow-hidden mt-1 text-[2px]">
                        <div className="h-full bg-[var(--accent-primary)] shadow-[0_0_5px_var(--accent-glow)]" style={{ width: `${team.health}%` }}></div>
                     </div>
                  </div>
                </div>
              ))}
           </div>
        </div>

        {/* AI Skill Gap Detection */}
        <div className="hud-panel p-6 relative overflow-hidden">
           <div className="absolute top-[-20%] right-[-20%] opacity-5 rotate-12 pointer-events-none">
              <Cpu size={200} className="text-cyan-500" />
           </div>
           <div className="flex justify-between items-center mb-6 relative z-10">
             <h3 className="text-xs font-black uppercase tracking-widest text-cyan-500 flex items-center gap-2">
               <Zap size={16} fill="currentColor"/> AI Skill Gap Detection
             </h3>
             <button 
               onClick={() => fetchSkillGap("Neural Ops")}
               className="text-[10px] btn-primary !py-1.5 !px-4 uppercase tracking-[0.2em] shadow-md"
             >
               Run Scan
             </button>
           </div>
           
           <div className="space-y-4 relative z-10 h-full">
              {skillGaps ? (
                <div className="animate-in slide-in-from-bottom duration-200 h-full flex flex-col justify-between">
                   <div className="space-y-2">
                      {skillGaps.gaps?.map((gap, i) => (
                        <div key={i} className="bg-[var(--bg-secondary)] border border-[var(--border-color)] p-3 rounded-xl flex items-center justify-between shadow-sm">
                           <span className="text-sm pro-text-main font-bold uppercase tracking-tight">{gap}</span>
                           <AlertTriangle size={14} className="text-[var(--accent-primary)]"/>
                        </div>
                      ))}
                   </div>
                   <div className="mt-6 p-4 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-color)]">
                      <p className="text-[10px] text-cyan-500 uppercase font-black mb-2 flex items-center gap-2 tracking-widest"><Globe size={14}/> Strategic Directive</p>
                      <p className="text-sm pro-text-muted italic leading-relaxed">"{skillGaps.strategicAdvice}"</p>
                   </div>
                </div>
              ) : (
                <div className="h-48 flex flex-col items-center justify-center text-center opacity-30">
                   <Database className="mb-4 text-cyan-500" size={48}/>
                   <p className="text-xs font-mono uppercase tracking-[0.4em] pro-text-muted">Awaiting Diagnostic Trigger</p>
                </div>
              )}
           </div>
        </div>

        {/* Neural Activity Logs */}
        <div className="hud-panel p-0">
           <div className="p-4 bg-[var(--bg-secondary)] border-b border-[var(--border-color)] flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-widest text-[var(--accent-primary)] flex items-center gap-2">
                <Terminal size={16}/> Live Neural Bus
              </h3>
              <div className="flex gap-1.5">
                 <div className="w-2 h-2 rounded-full bg-[var(--accent-primary)] animate-pulse"></div>
                 <div className="w-2 h-2 rounded-full bg-[var(--accent-primary)] opacity-40"></div>
                 <div className="w-2 h-2 rounded-full bg-[var(--accent-primary)] opacity-40"></div>
              </div>
           </div>
           <div className="p-4 font-mono text-[10px] space-y-3 overflow-y-auto max-h-[350px] custom-scrollbar bg-[var(--bg-card)]">
              {logs.map(log => (
                <div key={log.id} className="flex gap-3 pro-text-muted animate-in slide-in-from-top border-l-2 border-[var(--accent-primary)] pl-3 py-1">
                  <span className="text-[var(--accent-primary)] font-bold whitespace-nowrap">[{log.time}]</span>
                  <span className="leading-normal pro-text-main">{log.message}</span>
                </div>
              ))}
              <div className="flex items-center gap-2 text-[var(--accent-primary)] pl-3">
                 <span className="w-1.5 h-3 bg-[var(--accent-primary)] animate-pulse"></span>
                 <span className="font-bold tracking-widest">_READING_BUFFER</span>
              </div>
           </div>
        </div>
      </div>

      {/* Automated Control Toggle */}
      <div className="hud-panel p-8 flex flex-col md:flex-row items-center justify-between gap-6">
         <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-3xl bg-[var(--accent-glow)] border border-[var(--border-color)] flex items-center justify-center text-[var(--accent-primary)]">
               <Zap size={32} />
            </div>
            <div>
               <h2 className="text-xl font-black pro-text-main uppercase tracking-tighter">Automated Daily Quiz Assignments</h2>
               <p className="pro-text-muted text-sm max-w-lg font-medium leading-relaxed">Enable state-of-the-art cognitive preservation. AI will automatically select and assign hardening problems to entities based on their unique decay velocity.</p>
            </div>
         </div>
         <div className="flex items-center gap-6">
            <div className="flex flex-col items-end">
               <span className="text-[10px] font-black text-[var(--accent-primary)] uppercase tracking-[0.3em] mb-1">Protocol Status</span>
               <span className={`text-xs uppercase font-bold transition-colors ${autoProtocol ? 'text-emerald-500 font-black' : 'pro-text-muted'}`}>
                 {autoProtocol ? 'Operational' : 'Dormant'}
               </span>
            </div>
            <div 
              onClick={() => {
                const newState = !autoProtocol;
                setAutoProtocol(newState);
                addLog(`Automated Protocol ${newState ? 'Engagement' : 'Disengagement'} requested...`);
              }}
              className={`w-14 h-7 rounded-full p-1 cursor-pointer border transition-all ${autoProtocol ? 'bg-[var(--accent-primary)] border-[var(--accent-primary)] shadow-md' : 'bg-[var(--bg-secondary)] border-[var(--border-color)]'}`}
            >
               <div className={`w-5 h-5 bg-white rounded-full transition-all shadow-md ${autoProtocol ? 'translate-x-7' : 'translate-x-0'}`}></div>
            </div>
            <button 
              onClick={() => addLog("Manual force trigger initiated. Recalibrating mission-critical nodes...")}
              className="btn-primary uppercase tracking-widest text-xs shadow-xl active:scale-95 transition-all"
            >
              Force Trigger
            </button>
         </div>
      </div>

    </div>
  );
}
