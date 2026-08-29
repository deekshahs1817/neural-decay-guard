import { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, Timer } from "lucide-react";

export default function PomodoroTimer() {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 mins
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState("Focus"); // Focus, Break

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      if (mode === "Focus") {
        setMode("Break");
        setTimeLeft(5 * 60); // 5 min break
      } else {
        setMode("Focus");
        setTimeLeft(25 * 60);
      }
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode]);

  const toggle = () => setIsActive(!isActive);
  
  const reset = () => {
    setIsActive(false);
    setTimeLeft(mode === "Focus" ? 25 * 60 : 5 * 60);
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5 flex flex-col items-center shadow-xl w-full max-w-sm backdrop-blur-md">
      <div className="flex items-center justify-between w-full mb-3">
        <div className="flex items-center pro-text-muted text-xs font-bold uppercase tracking-widest">
          <Timer size={14} className="mr-1 text-[var(--accent-primary)]" />
          Neural Pomodoro
        </div>
        <div className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${mode === 'Focus' ? 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30' : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'}`}>
          {mode}
        </div>
      </div>
      
      <div className="text-4xl font-mono font-bold tracking-widest pro-text-main my-2">
        {formatTime(timeLeft)}
      </div>

      <div className="flex items-center space-x-3 mt-4">
        <button
          onClick={toggle}
          className={`flex items-center justify-center w-11 h-11 rounded-full transition-all hover:scale-105 active:scale-95 shadow-md ${isActive ? 'bg-rose-500/10 text-rose-500 border border-rose-500/30' : 'bg-[var(--accent-glow)] text-[var(--accent-primary)] border border-[var(--border-color)]'}`}
        >
          {isActive ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
        </button>
        <button
          onClick={reset}
          className="flex items-center justify-center w-9 h-9 rounded-full bg-[var(--bg-secondary)] pro-text-muted hover:pro-text-main border border-[var(--border-color)] transition hover:scale-105"
        >
          <RotateCcw size={14} />
        </button>
      </div>

      <div className="w-full bg-[var(--bg-secondary)] h-1.5 mt-5 rounded-full overflow-hidden border border-[var(--border-color)]">
        <div 
          className={`h-full transition-all duration-500 ${mode === 'Focus' ? 'bg-[var(--accent-primary)]' : 'bg-emerald-500'}`} 
          style={{ width: `${(( (mode === "Focus" ? 25*60 : 5*60) - timeLeft) / (mode === "Focus" ? 25*60 : 5*60)) * 100}%` }}
        ></div>
      </div>
    </div>
  );
}
