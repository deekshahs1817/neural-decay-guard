import { useEffect, useState } from "react";
import API from "../services/api";
import { Trophy, Medal, Award, Flame, User, Search, Plus } from "lucide-react";

export default function Leaderboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState("global"); // 'global' or 'friends'
  const [friendEmail, setFriendEmail] = useState("");
  const [friendStatus, setFriendStatus] = useState("");
  const userId = localStorage.getItem("userId");

  const fetchLeaderboard = () => {
    setLoading(true);
    const endpoint = mode === "global" ? "/leaderboard" : `/friends/leaderboard/${userId}`;
    API.get(endpoint)
      .then(res => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load leaderboard", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [mode]);

  const handleAddFriend = async (e) => {
    e.preventDefault();
    if (!friendEmail.trim()) return;
    try {
      const res = await API.post("/friends/add", { userId, friendEmail });
      setFriendStatus(res.data.message);
      setFriendEmail("");
      if (mode === "friends") fetchLeaderboard();
    } catch (err) {
      setFriendStatus(err.response?.data?.message || "Failed to add friend.");
    }
    setTimeout(() => setFriendStatus(""), 4000);
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="animate-spin text-violet-500">
          <Trophy size={48} />
        </div>
      </div>
    );
  }

  const getRankIcon = (index) => {
    if (index === 0) return <Trophy className="text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.5)]" size={32} />;
    if (index === 1) return <Medal className="text-slate-400" size={28} />;
    if (index === 2) return <Award className="text-violet-700" size={28} />;
    return <span className="pro-text-muted font-bold w-10 h-10 flex items-center justify-center bg-[var(--bg-card)] rounded-full text-sm border border-[var(--border-color)]">{index + 1}</span>;
  };

  const getRowStyle = (index) => {
    if (index === 0) return "bg-cyan-500/5 border-cyan-500/20";
    if (index === 1) return "bg-slate-400/5 border-slate-400/20";
    if (index === 2) return "bg-violet-700/5 border-violet-700/20";
    return "hover:bg-[var(--bg-card)] transition-colors";
  };

  return (
    <div className="space-y-12 animate-in fade-in zoom-in duration-700 max-w-5xl mx-auto">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-violet-500/10 rounded-full mb-2 shadow-[0_0_40px_rgba(139,92,246,0.2)] border border-violet-500/20 neural-pulse">
          <Trophy className="text-violet-500" size={48} />
        </div>
        <h1 className="text-5xl font-black pro-text-main tracking-tighter uppercase italic">Neural <span className="text-violet-500">Rankings</span></h1>
        <p className="pro-text-muted max-w-xl mx-auto font-medium">Propagate through the cognitive hierarchy by accumulating raw Experience Points.</p>
        
        {/* Toggle & Social */}
        <div className="flex flex-col items-center mt-8 space-y-6">
          <div className="pro-bg-secondary border border-[var(--border-color)] rounded-2xl p-1.5 flex shadow-inner">
            <button 
              onClick={() => setMode("global")} 
              className={`px-8 py-2.5 rounded-xl text-xs font-black uppercase tracking-[0.2em] transition-all ${mode === 'global' ? 'bg-violet-600 text-white shadow-lg' : 'pro-text-muted hover:pro-text-main'}`}
            >
              Global Grid
            </button>
            <button 
              onClick={() => setMode("friends")} 
              className={`px-8 py-2.5 rounded-xl text-xs font-black uppercase tracking-[0.2em] transition-all ${mode === 'friends' ? 'bg-cyan-600 text-white shadow-lg' : 'pro-text-muted hover:pro-text-main'}`}
            >
              Local Mesh
            </button>
          </div>

          <form onSubmit={handleAddFriend} className="flex relative w-full max-w-md group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
               <Search className="pro-text-muted opacity-40 group-focus-within:text-violet-400 transition-colors" size={18} />
            </div>
            <input 
              type="email" 
              placeholder="Inject Identity Signature (Email)..." 
              value={friendEmail} 
              onChange={(e) => setFriendEmail(e.target.value)}
              className="input-field pl-12 rounded-r-none border-r-0 focus:border-violet-500"
            />
            <button type="submit" className="bg-violet-600 hover:bg-violet-500 px-6 font-black text-xs uppercase tracking-widest text-white rounded-r-2xl shadow-xl active:scale-95 transition-all">
              Add Friend
            </button>
          </form>
          {friendStatus && <p className="text-violet-400 text-xs font-black animate-bounce">{friendStatus}</p>}
        </div>
      </div>

      <div className="glass-panel overflow-hidden transition-colors shadow-2xl border-[var(--border-color)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--accent-glow)] pro-text-muted border-b border-[var(--border-color)]">
                <th className="py-5 px-8 font-black text-[10px] uppercase tracking-[0.3em] text-center w-24">Rank</th>
                <th className="py-5 px-8 font-black text-[10px] uppercase tracking-[0.3em]">Neural Entity</th>
                <th className="py-5 px-8 font-black text-[10px] uppercase tracking-[0.3em] text-center">Badges</th>
                <th className="py-5 px-8 font-black text-[10px] uppercase tracking-[0.3em] text-right">Power Level (XP)</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <tr 
                  key={i} 
                  className={`border-b border-[var(--border-color)] last:border-b-0 group transition-all ${getRowStyle(i)}`}
                >
                  <td className="py-6 px-8 relative">
                    <div className="flex items-center justify-center">
                      {getRankIcon(i)}
                    </div>
                  </td>
                  <td className="py-6 px-8 flex items-center group">
                    <div className="w-12 h-12 rounded-2xl pro-bg-secondary flex items-center justify-center mr-4 border border-[var(--border-color)] relative transition-transform group-hover:scale-110">
                      <User size={24} className="pro-text-muted opacity-40" />
                      <div className="absolute -bottom-2 -right-2 bg-violet-600 text-[10px] w-6 h-6 flex items-center justify-center rounded-lg text-white font-black border-2 border-[var(--bg-primary)] shadow-md">
                        {u.level || 1}
                      </div>
                    </div>
                    <div>
                      <div className="pro-text-main font-black text-lg group-hover:text-violet-400 transition-colors">{u.name}</div>
                      <div className="text-[10px] pro-text-muted font-black uppercase tracking-widest flex items-center mt-1">
                        <Flame className={u.streak > 0 ? "text-rose-500 mr-1 animate-pulse" : "pro-text-muted opacity-20 mr-1"} size={14} />
                        {u.streak} Day Neural Streak
                      </div>
                    </div>
                  </td>
                  <td className="py-6 px-8">
                    <div className="flex items-center justify-center space-x-2">
                      {(u.badges || []).slice(0, 3).map((b, idx) => (
                        <div key={idx} className="bg-violet-500/10 text-violet-400 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg border border-violet-500/20 whitespace-nowrap shadow-sm hover:bg-violet-500/20 transition-colors" title={b}>
                          {b}
                        </div>
                      ))}
                      {(!u.badges || u.badges.length === 0) && <span className="pro-text-muted italic opacity-20 text-xs">-</span>}
                    </div>
                  </td>
                  <td className="py-6 px-8 text-right font-black text-2xl text-violet-400 tracking-tighter">
                    <span className="pro-text-muted text-[10px] uppercase tracking-widest mr-3 opacity-40 italic">Core XP</span>
                    {u.xp || 0}
                  </td>
                </tr>
              ))}
              
              {users.length === 0 && (
                <tr>
                  <td colSpan="4" className="py-20 text-center pro-text-muted italic">
                    Grid offline. No neural entities detected.
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