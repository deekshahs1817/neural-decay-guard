import { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, RotateCcw, Brain, Shield, Zap, Coffee, 
  CheckCircle2, Volume2, VolumeX, Timer, Wind, Eye, 
  Sparkles, Maximize2, Minimize2, Heart, Music, Smile
} from 'lucide-react';

export default function FocusRoom() {
  // Timer State
  const [mode, setMode] = useState('focus'); // 'focus' | 'reset'
  const [focusDuration, setFocusDuration] = useState(25); // in minutes
  const [resetDuration, setResetDuration] = useState(5); // in minutes
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [cycles, setCycles] = useState(0);

  // Relaxing Activity Tab
  const [activeActivity, setActiveActivity] = useState('breathing'); // 'breathing', 'soundscape', 'eye_reset', 'zen_popper'

  // Box Breathing State
  const [breathPhase, setBreathPhase] = useState('Inhale'); // Inhale, Hold, Exhale, Hold
  const [breathCount, setBreathCount] = useState(4);
  const [breathCyclesCompleted, setBreathCyclesCompleted] = useState(0);

  // Ambient Soundscape Web Audio Synthesizer
  const [soundPlaying, setSoundPlaying] = useState(null); // 'rain' | 'binaural' | 'waves' | null
  const [soundVolume, setSoundVolume] = useState(0.5);
  const audioCtxRef = useRef(null);
  const soundNodeRef = useRef(null);
  const gainNodeRef = useRef(null);

  // Zen Popper State
  const [bubbles, setBubbles] = useState(() => Array.from({ length: 16 }, (_, i) => ({ id: i, popped: false })));
  const [zenPops, setZenPops] = useState(0);

  // Eye Reset Timer
  const [eyeSeconds, setEyeSeconds] = useState(20);
  const [eyeActive, setEyeActive] = useState(false);

  // Switch between Deep Work and Mental Reset
  const switchMode = (newMode) => {
    setIsActive(false);
    setMode(newMode);
    if (newMode === 'focus') {
      setMinutes(focusDuration);
      setSeconds(0);
    } else {
      setMinutes(resetDuration);
      setSeconds(0);
    }
  };

  // Main Pomodoro Interval
  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1);
        } else if (minutes > 0) {
          setMinutes(minutes - 1);
          setSeconds(59);
        } else {
          // Cycle Completed
          setIsActive(false);
          if (mode === 'focus') {
            setCycles(prev => prev + 1);
            switchMode('reset');
          } else {
            switchMode('focus');
          }
          playChime();
        }
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, minutes, seconds, mode, focusDuration, resetDuration]);

  // Box Breathing Interval (4s Inhale - 4s Hold - 4s Exhale - 4s Hold)
  useEffect(() => {
    let breathInterval = null;
    if (mode === 'reset' && activeActivity === 'breathing') {
      breathInterval = setInterval(() => {
        setBreathCount(prev => {
          if (prev > 1) return prev - 1;
          // Transition Phase
          setBreathPhase(currPhase => {
            if (currPhase === 'Inhale') return 'Hold (Full)';
            if (currPhase === 'Hold (Full)') return 'Exhale';
            if (currPhase === 'Exhale') return 'Hold (Empty)';
            setBreathCyclesCompleted(c => c + 1);
            return 'Inhale';
          });
          return 4;
        });
      }, 1000);
    }
    return () => clearInterval(breathInterval);
  }, [mode, activeActivity]);

  // 20-20-20 Eye Exercise Interval
  useEffect(() => {
    let eyeInterval = null;
    if (eyeActive) {
      eyeInterval = setInterval(() => {
        setEyeSeconds(prev => {
          if (prev > 1) return prev - 1;
          setEyeActive(false);
          playChime();
          return 20;
        });
      }, 1000);
    }
    return () => clearInterval(eyeInterval);
  }, [eyeActive]);

  // Web Audio Chime
  const playChime = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3); // A5
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.2);
    } catch (e) {
      console.warn("Audio context not allowed yet:", e);
    }
  };

  // Ambient Sound Synthesizer
  const toggleAmbientSound = (soundType) => {
    if (soundPlaying === soundType) {
      stopSound();
      return;
    }
    stopSound();
    startSound(soundType);
  };

  const startSound = (soundType) => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      audioCtxRef.current = ctx;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(soundVolume * 0.15, ctx.currentTime);
      gainNodeRef.current = gain;
      gain.connect(ctx.destination);

      if (soundType === 'binaural') {
        // Binaural Alpha Beats (200Hz Left / 210Hz Right = 10Hz Alpha Wave)
        const merger = ctx.createChannelMerger(2);
        const oscL = ctx.createOscillator();
        const oscR = ctx.createOscillator();
        oscL.frequency.value = 216; // 432Hz harmonic
        oscR.frequency.value = 226; // +10Hz alpha wave difference
        oscL.connect(merger, 0, 0);
        oscR.connect(merger, 0, 1);
        merger.connect(gain);
        oscL.start();
        oscR.start();
        soundNodeRef.current = { stop: () => { oscL.stop(); oscR.stop(); } };
      } else {
        // White / Pink Noise generator for Rain or Ocean Waves
        const bufferSize = ctx.sampleRate * 2;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99 * b0 + white * 0.05;
          b1 = 0.95 * b1 + white * 0.1;
          b2 = 0.85 * b2 + white * 0.2;
          data[i] = (b0 + b1 + b2) * (soundType === 'waves' ? Math.sin(i / 15000) : 0.8);
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = soundType === 'rain' ? 'lowpass' : 'bandpass';
        filter.frequency.value = soundType === 'rain' ? 800 : 400;

        noise.connect(filter);
        filter.connect(gain);
        noise.start();
        soundNodeRef.current = noise;
      }

      setSoundPlaying(soundType);
    } catch (e) {
      console.error("Failed to start sound synthesis:", e);
    }
  };

  const stopSound = () => {
    if (soundNodeRef.current) {
      try { soundNodeRef.current.stop(); } catch (e) {}
      soundNodeRef.current = null;
    }
    if (audioCtxRef.current) {
      try { audioCtxRef.current.close(); } catch (e) {}
      audioCtxRef.current = null;
    }
    setSoundPlaying(null);
  };

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setMinutes(mode === 'focus' ? focusDuration : resetDuration);
    setSeconds(0);
  };

  const popBubble = (id) => {
    setBubbles(prev => prev.map(b => b.id === id ? { ...b, popped: true } : b));
    setZenPops(p => p + 1);
  };

  const resetBubbles = () => {
    setBubbles(Array.from({ length: 16 }, (_, i) => ({ id: i, popped: false })));
  };

  const currentTotal = (mode === 'focus' ? focusDuration : resetDuration) * 60;
  const currentRemaining = minutes * 60 + seconds;
  const progress = Math.min(100, Math.max(0, ((currentTotal - currentRemaining) / currentTotal) * 100));

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Header Banner */}
      <div className="hud-panel p-8 border-[var(--border-color)] bg-[var(--bg-secondary)] relative overflow-hidden shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent-glow)] border border-[var(--border-color)] text-[var(--accent-primary)] text-xs font-black uppercase">
              <Shield size={14} /> Synaptic Focus & Recovery Chamber
            </div>
            <h1 className="text-3xl md:text-5xl font-black pro-text-main tracking-tight uppercase">
              Focus & <span className="text-[var(--accent-primary)]">Mental Reset</span>
            </h1>
            <p className="pro-text-muted text-xs md:text-sm font-medium max-w-xl leading-relaxed">
              Maintain optimal cognitive flow through timed Deep Work sprints, paired with scientifically designed neural reset and relaxation protocols.
            </p>
          </div>

          {/* Mode Switcher Buttons */}
          <div className="flex bg-[var(--bg-card)] p-1.5 rounded-2xl border border-[var(--border-color)] shadow-sm">
            <button
              onClick={() => switchMode('focus')}
              className={`px-5 py-3 rounded-xl text-xs font-black uppercase transition flex items-center gap-2 ${
                mode === 'focus'
                  ? 'bg-[var(--accent-primary)] text-white shadow-md'
                  : 'pro-text-muted hover:pro-text-main'
              }`}
            >
              <Brain size={16} />
              <span>Deep Work</span>
            </button>
            <button
              onClick={() => switchMode('reset')}
              className={`px-5 py-3 rounded-xl text-xs font-black uppercase transition flex items-center gap-2 ${
                mode === 'reset'
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'pro-text-muted hover:pro-text-main'
              }`}
            >
              <Coffee size={16} />
              <span>Mental Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Timer & Controls Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Circular SVG Timer Card */}
        <div className="lg:col-span-6 glass-panel p-8 flex flex-col items-center justify-center border-[var(--border-color)] shadow-sm relative min-h-[380px]">
          <div className="relative flex justify-center items-center">
            <svg className="w-72 h-72 transform -rotate-90">
              <circle
                cx="144"
                cy="144"
                r="125"
                stroke="var(--border-color)"
                strokeWidth="10"
                fill="transparent"
                className="opacity-30"
              />
              <circle
                cx="144"
                cy="144"
                r="125"
                stroke={mode === 'focus' ? 'var(--accent-primary)' : '#10b981'}
                strokeWidth="10"
                fill="transparent"
                strokeDasharray={785}
                strokeDashoffset={785 - (785 * progress) / 100}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-linear shadow-[0_0_20px_var(--accent-glow)]"
              />
            </svg>

            <div className="absolute text-center z-10 space-y-1">
              <span className="text-6xl font-mono font-black pro-text-main block tracking-tighter">
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </span>
              <span className={`text-[11px] font-black uppercase tracking-widest px-3 py-0.5 rounded-full inline-block ${
                mode === 'focus' ? 'bg-[var(--accent-glow)] text-[var(--accent-primary)]' : 'bg-emerald-500/20 text-emerald-400'
              }`}>
                {mode === 'focus' ? 'Deep Work Session' : 'Synaptic Recovery'}
              </span>
            </div>
          </div>

          {/* Quick Preset Buttons */}
          <div className="flex gap-2 mt-6">
            {(mode === 'focus' ? [15, 25, 45, 60] : [3, 5, 10, 15]).map(mins => (
              <button
                key={mins}
                onClick={() => {
                  if (mode === 'focus') setFocusDuration(mins);
                  else setResetDuration(mins);
                  setMinutes(mins);
                  setSeconds(0);
                  setIsActive(false);
                }}
                className={`px-3 py-1 rounded-xl text-xs font-mono font-bold transition ${
                  (mode === 'focus' ? focusDuration : resetDuration) === mins
                    ? 'bg-[var(--accent-primary)] text-white'
                    : 'bg-[var(--bg-secondary)] border border-[var(--border-color)] pro-text-muted hover:pro-text-main'
                }`}
              >
                {mins}m
              </button>
            ))}
          </div>
        </div>

        {/* Controls & Focus Metrics */}
        <div className="lg:col-span-6 space-y-6">
          <div className="glass-panel p-6 border-[var(--border-color)] space-y-6 shadow-sm">
            <div className="flex justify-between items-center pb-4 border-b border-[var(--border-color)]">
              <div>
                <h3 className="text-base font-black pro-text-main uppercase tracking-wider">
                  {mode === 'focus' ? 'Active Focus Session' : 'Active Mental Cooldown'}
                </h3>
                <p className="text-xs pro-text-muted">
                  {mode === 'focus' ? 'Zero distractions. Maximizes deep retention encoding.' : 'Lowers mental fatigue and prevents cognitive burn.'}
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] flex items-center justify-center text-[var(--accent-primary)]">
                <Timer size={20} />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button 
                onClick={toggleTimer}
                className={`flex-1 flex items-center justify-center py-4 px-6 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg ${
                  isActive 
                    ? 'bg-rose-500 hover:bg-rose-600 text-white' 
                    : mode === 'focus' ? 'btn-primary' : 'bg-emerald-500 hover:bg-emerald-600 text-slate-950'
                }`}
              >
                {isActive ? <><Pause className="mr-2" size={16} /> Pause Cycle</> : <><Play className="mr-2" size={16} /> Start Session</>}
              </button>
              
              <button 
                onClick={resetTimer}
                className="px-5 py-4 rounded-2xl pro-text-muted border border-[var(--border-color)] bg-[var(--bg-secondary)] hover:pro-text-main transition text-xs font-bold flex items-center justify-center gap-1.5"
              >
                <RotateCcw size={15} />
                <span>Reset</span>
              </button>
            </div>

            {/* Completed Pomodoro Cycles */}
            <div className="pt-4 border-t border-[var(--border-color)]">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[10px] font-black uppercase pro-text-muted tracking-widest">
                  Completed Deep Work Cycles
                </span>
                <span className="text-xs font-mono font-bold text-emerald-500">
                  {cycles} Sprints Finished
                </span>
              </div>
              <div className="flex gap-2">
                {Array.from({ length: Math.max(5, cycles + 1) }).map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-9 flex-1 rounded-xl border flex items-center justify-center transition-all ${
                      i < cycles 
                        ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400 font-bold shadow-xs' 
                        : 'bg-[var(--bg-secondary)] border-[var(--border-color)] pro-text-muted opacity-30'
                    }`}
                  >
                    {i < cycles ? <CheckCircle2 size={16} /> : <Zap size={14} />}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Interactive Deep Work & Mental Reset Switcher Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div 
              onClick={() => switchMode('focus')}
              className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                mode === 'focus'
                  ? 'bg-[var(--accent-glow)] border-[var(--accent-primary)] shadow-sm'
                  : 'glass-card hover:border-[var(--accent-primary)]/50'
              }`}
            >
              <Brain className={`mb-2 ${mode === 'focus' ? 'text-[var(--accent-primary)]' : 'text-slate-400'}`} size={24} />
              <h4 className="pro-text-main font-black text-sm uppercase">Deep Work</h4>
              <p className="text-[11px] pro-text-muted mt-1 leading-snug">High cognitive load state optimized for coding & algorithms.</p>
            </div>

            <div 
              onClick={() => switchMode('reset')}
              className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                mode === 'reset'
                  ? 'bg-emerald-500/10 border-emerald-500/60 shadow-sm'
                  : 'glass-card hover:border-emerald-500/50'
              }`}
            >
              <Coffee className={`mb-2 ${mode === 'reset' ? 'text-emerald-400' : 'text-slate-400'}`} size={24} />
              <h4 className="pro-text-main font-black text-sm uppercase">Mental Reset</h4>
              <p className="text-[11px] pro-text-muted mt-1 leading-snug">Synaptic cooldown & breathing to eliminate fatigue.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Relaxing & Mental Reset Interactive Suite */}
      <div className="glass-panel p-8 border-[var(--border-color)] space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border-color)]">
          <div>
            <h3 className="text-xl font-black pro-text-main uppercase tracking-tight flex items-center gap-2">
              <Sparkles size={20} className="text-amber-500" />
              Cognitive Recharge & Relaxation Activities
            </h3>
            <p className="text-xs pro-text-muted mt-0.5">
              Science-backed micro-recovery protocols to lower cognitive strain between hard coding sessions.
            </p>
          </div>

          {/* Activity Tabs */}
          <div className="flex bg-[var(--bg-secondary)] p-1 rounded-xl border border-[var(--border-color)]">
            {[
              { id: 'breathing', label: 'Box Breathing', icon: Wind },
              { id: 'soundscape', label: 'Ambient Sounds', icon: Music },
              { id: 'eye_reset', label: '20-20-20 Eye Rest', icon: Eye },
              { id: 'zen_popper', label: 'Zen Stress Popper', icon: Smile }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveActivity(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                  activeActivity === tab.id
                    ? 'bg-[var(--accent-primary)] text-white shadow-xs font-black'
                    : 'pro-text-muted hover:pro-text-main'
                }`}
              >
                <tab.icon size={13} />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 1. Box Breathing Guide */}
        {activeActivity === 'breathing' && (
          <div className="p-8 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-3xl flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-3 max-w-md">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase">
                <Wind size={12} /> Autonomic Nervous System Reset
              </div>
              <h4 className="text-2xl font-black pro-text-main">4-4-4-4 Box Breathing</h4>
              <p className="text-xs pro-text-muted leading-relaxed">
                Inhale for 4s, hold for 4s, exhale for 4s, and hold for 4s. Used by elite performers to quickly calm heart rate and eliminate coding frustration.
              </p>
              <div className="text-xs font-mono font-bold text-emerald-400">
                Completed Breath Cycles: <span className="text-base">{breathCyclesCompleted}</span>
              </div>
            </div>

            {/* Breathing Animation Orb */}
            <div className="flex flex-col items-center justify-center">
              <div className={`w-44 h-44 rounded-full border-4 flex flex-col items-center justify-center text-center transition-all duration-1000 shadow-2xl ${
                breathPhase.startsWith('Inhale')
                  ? 'scale-110 bg-emerald-500/20 border-emerald-500 shadow-[0_0_35px_rgba(16,185,129,0.4)]'
                  : breathPhase.startsWith('Exhale')
                  ? 'scale-90 bg-cyan-500/10 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.2)]'
                  : 'scale-100 bg-amber-500/15 border-amber-400 shadow-[0_0_25px_rgba(251,191,36,0.3)]'
              }`}>
                <span className="text-xs font-black uppercase tracking-widest pro-text-muted block">
                  {breathPhase}
                </span>
                <span className="text-5xl font-mono font-black pro-text-main mt-1">
                  {breathCount}s
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 2. Ambient Soundscape Generator */}
        {activeActivity === 'soundscape' && (
          <div className="p-8 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-3xl space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-xl font-black pro-text-main">Binaural & Natural Focus Soundscapes</h4>
                <p className="text-xs pro-text-muted mt-0.5">Procedurally synthesized ambient sound directly generated in your browser for zero distraction.</p>
              </div>
              {soundPlaying && (
                <button
                  onClick={stopSound}
                  className="px-3 py-1 rounded-xl bg-rose-500/10 text-rose-500 border border-rose-500/30 text-xs font-bold flex items-center gap-1.5"
                >
                  <VolumeX size={14} /> Stop Audio
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { id: 'binaural', title: 'Binaural 10Hz Alpha Beats', desc: '432Hz harmonic wave for deep cognitive flow.' },
                { id: 'rain', title: 'Gentle Rain & White Noise', desc: 'Low-frequency continuous acoustic mask.' },
                { id: 'waves', title: 'Ocean Waves & Surf', desc: 'Rhythmic natural pink noise oscillation.' }
              ].map(snd => (
                <div
                  key={snd.id}
                  onClick={() => toggleAmbientSound(snd.id)}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                    soundPlaying === snd.id
                      ? 'bg-[var(--accent-glow)] border-[var(--accent-primary)] shadow-md'
                      : 'bg-[var(--bg-card)] border-[var(--border-color)] hover:border-[var(--accent-primary)]/50'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <Volume2 className={soundPlaying === snd.id ? 'text-[var(--accent-primary)] animate-bounce' : 'text-slate-400'} size={20} />
                    {soundPlaying === snd.id && (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-[var(--accent-primary)] text-white">Playing</span>
                    )}
                  </div>
                  <h5 className="font-bold text-sm pro-text-main">{snd.title}</h5>
                  <p className="text-xs pro-text-muted mt-1 leading-snug">{snd.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. 20-20-20 Eye Rest Protocol */}
        {activeActivity === 'eye_reset' && (
          <div className="p-8 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-3xl flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-3 max-w-md">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 text-[10px] font-black uppercase">
                <Eye size={12} /> Optical Decompression Rule
              </div>
              <h4 className="text-2xl font-black pro-text-main">The 20-20-20 Optical Reset</h4>
              <p className="text-xs pro-text-muted leading-relaxed">
                Every 20 minutes spent staring at code, look at an object at least <strong>20 feet away</strong> for <strong>20 seconds</strong> to relax the ciliary muscles in your eyes.
              </p>
              <button
                onClick={() => setEyeActive(!eyeActive)}
                className="btn-primary !px-6 !py-2.5 text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-md"
              >
                <Eye size={15} />
                <span>{eyeActive ? 'Stop Optical Timer' : 'Start 20s Optical Reset'}</span>
              </button>
            </div>

            {/* Eye Timer Visual */}
            <div className="w-40 h-40 rounded-3xl bg-[var(--bg-card)] border-2 border-cyan-400/40 flex flex-col items-center justify-center shadow-lg">
              <Eye size={36} className={`text-cyan-400 ${eyeActive ? 'animate-pulse' : ''}`} />
              <span className="text-3xl font-mono font-black pro-text-main mt-2">
                {eyeSeconds}s
              </span>
              <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest mt-0.5">
                {eyeActive ? 'Look 20ft Away' : 'Ready'}
              </span>
            </div>
          </div>
        )}

        {/* 4. Zen Stress Popper */}
        {activeActivity === 'zen_popper' && (
          <div className="p-8 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-3xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-[var(--border-color)]">
              <div>
                <h4 className="text-xl font-black pro-text-main">Zen Tactile Stress Reliever</h4>
                <p className="text-xs pro-text-muted">Pop bubbles to release micro-tension before your next coding challenge.</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-bold text-amber-500">
                  Total Popped: {zenPops}
                </span>
                <button
                  onClick={resetBubbles}
                  className="px-3 py-1 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-xs font-bold pro-text-muted hover:pro-text-main"
                >
                  Refill
                </button>
              </div>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-8 gap-3 pt-2">
              {bubbles.map(b => (
                <button
                  key={b.id}
                  onClick={() => popBubble(b.id)}
                  disabled={b.popped}
                  className={`aspect-square rounded-2xl border-2 transition-all flex items-center justify-center ${
                    b.popped
                      ? 'bg-[var(--bg-card)] border-[var(--border-color)] opacity-20 scale-90'
                      : 'bg-gradient-to-tr from-amber-500/20 to-amber-300/30 border-amber-400/60 hover:scale-105 hover:shadow-[0_0_15px_rgba(251,191,36,0.5)] active:scale-95'
                  }`}
                >
                  {b.popped ? <span className="text-xs pro-text-muted font-mono">✓</span> : <Sparkles size={16} className="text-amber-400" />}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
