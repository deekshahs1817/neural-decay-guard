import { useEffect, useState } from "react";
import API from "../services/api";
import { Brain, CheckCircle, ArrowRight, Loader2, ShieldCheck, Flame, Timer, Sparkles } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

export default function DailyQuiz() {
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [personalizedTopics, setPersonalizedTopics] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [score, setScore] = useState(null);
  const [alreadyCompleted, setAlreadyCompleted] = useState(false);
  const [streakCount, setStreakCount] = useState(0);
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

  useEffect(() => {
    if (!userId) return;
    const localNow = new Date();
    const clientDate = `${localNow.getFullYear()}-${String(localNow.getMonth() + 1).padStart(2, '0')}-${String(localNow.getDate()).padStart(2, '0')}`;
    const tzOffset = localNow.getTimezoneOffset();

    API.get(`/daily-random`, { params: { userId, clientDate, tzOffset } })
      .then(res => {
        if (res.data.alreadyCompleted) {
          setAlreadyCompleted(true);
          setStreakCount(res.data.streak || 0);
        } else {
          setQuestions(res.data.questions || []);
          setPersonalizedTopics(res.data.personalizedTopics || []);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load quiz", err);
        setLoading(false);
      });
  }, [userId]);

  const [quizResult, setQuizResult] = useState(null);

  const select = (qid, opt) => {
    setAnswers({ ...answers, [qid]: opt });
  };

  const submit = async () => {
    setSubmitting(true);
    try {
      const localNow = new Date();
      const clientDate = `${localNow.getFullYear()}-${String(localNow.getMonth() + 1).padStart(2, '0')}-${String(localNow.getDate()).padStart(2, '0')}`;
      const tzOffset = localNow.getTimezoneOffset();

      const res = await API.post('/submitQuiz', { userId, answers, clientDate, tzOffset });
      setScore(res.data.score);
      setQuizResult(res.data);
    } catch (err) {
      if (err.response?.data?.alreadyCompleted) {
        setAlreadyCompleted(true);
        setStreakCount(err.response.data.streak || 0);
      } else {
        alert(err.response?.data?.message || "Failed to submit quiz");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="animate-spin text-[var(--accent-primary)]" size={48} />
      </div>
    );
  }

  // Already Completed Today View (Strict 1 Submission Per Day)
  if (alreadyCompleted) {
    return (
      <div className="flex flex-col items-center justify-center py-16 animate-in fade-in zoom-in duration-500 max-w-lg mx-auto text-center space-y-6">
        <div className="w-24 h-24 bg-emerald-500/10 rounded-3xl flex items-center justify-center shadow-xl border border-emerald-500/30">
          <ShieldCheck className="text-emerald-500" size={52} />
        </div>
        
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-black uppercase mb-2">
            <CheckCircle size={14} /> Completed For Today
          </div>
          <h2 className="text-3xl font-black pro-text-main">Synapses Reinforced!</h2>
          <p className="pro-text-muted text-sm font-medium">
            You have already completed today's Daily Retention Quiz. Only 1 submission is allowed per calendar day to ensure scientifically spaced recall.
          </p>
        </div>

        {/* Active Streak Protected Card */}
        <div className="p-5 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl w-full flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center justify-center text-amber-500">
              <Flame size={24} />
            </div>
            <div className="text-left">
              <span className="text-[10px] font-black uppercase pro-text-muted tracking-wider block">Retention Streak</span>
              <p className="text-xl font-black font-mono pro-text-main">
                {streakCount} <span className="text-xs font-normal pro-text-muted">Days Active</span>
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-black uppercase text-cyan-400 block">Next Quiz Unlocks In</span>
            <span className="text-sm font-mono font-black text-cyan-400 flex items-center gap-1 justify-end">
              <Timer size={13} /> {timeLeft}
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
          <button onClick={() => navigate('/dsa-roadmap')} className="btn-primary flex-1 !py-3.5 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl w-full">
            <span>Explore DSA Roadmap</span> <ArrowRight size={16} />
          </button>
          <button onClick={() => navigate('/dashboard')} className="px-6 py-3.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] hover:bg-[var(--bg-secondary)] text-xs font-black uppercase tracking-wider pro-text-main transition shadow-sm w-full sm:w-auto">
            Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (score !== null) {
    return (
      <div className="flex flex-col items-center justify-center py-16 animate-in fade-in zoom-in duration-500 max-w-lg mx-auto text-center space-y-6">
        <div className="w-24 h-24 bg-emerald-500/10 rounded-3xl flex items-center justify-center shadow-xl border border-emerald-500/30">
          <CheckCircle className="text-emerald-500" size={52} />
        </div>
        
        <div className="space-y-1">
          <h2 className="text-3xl font-black pro-text-main">Retention Quiz Complete!</h2>
          <p className="pro-text-muted text-sm font-medium">Your cognitive synapses have been reinforced against Ebbinghaus decay.</p>
        </div>

        {/* Streak Milestone Pill */}
        <div className="p-5 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl w-full flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center justify-center text-amber-500">
              <span className="text-2xl">🔥</span>
            </div>
            <div className="text-left">
              <span className="text-[10px] font-black uppercase pro-text-muted tracking-wider block">Retention Streak</span>
              <p className="text-xl font-black font-mono pro-text-main">
                {quizResult?.streak || 1} <span className="text-xs font-normal pro-text-muted">Days Active</span>
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-black uppercase text-emerald-400 block">Score Earned</span>
            <span className="text-xl font-black font-mono text-emerald-400">
              {score} / {questions.length || 5}
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
          <button onClick={() => navigate('/dsa-roadmap')} className="btn-primary flex-1 !py-3.5 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl w-full">
            <span>Explore DSA Roadmap</span> <ArrowRight size={16} />
          </button>
          <button onClick={() => navigate('/dashboard')} className="px-6 py-3.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] hover:bg-[var(--bg-secondary)] text-xs font-black uppercase tracking-wider pro-text-main transition shadow-sm w-full sm:w-auto">
            Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-4">
        <div>
          <h2 className="text-2xl font-black flex items-center pro-text-main">
            <Brain className="text-[var(--accent-primary)] mr-3" size={28} />
            Daily Skill Retention Quiz
          </h2>
          <p className="pro-text-muted text-xs mt-1">
            Personalized spaced-repetition questions to prevent cognitive decay across your learned topics.
          </p>
        </div>
        <div className="bg-[var(--bg-secondary)] px-4 py-2 rounded-xl border border-[var(--border-color)] shadow-sm">
          <span className="text-[var(--accent-primary)] font-bold text-base">{Object.keys(answers).length}</span>
          <span className="pro-text-muted text-sm font-medium"> / {questions.length}</span>
        </div>
      </div>

      {/* Knowledge Profile Synced Topics Banner */}
      {personalizedTopics.length > 0 && (
        <div className="p-4 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl space-y-2.5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-[var(--accent-primary)]">
              Synced with Knowledge Profile
            </span>
            <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle size={13} /> Decay Prevention Active
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {personalizedTopics.map((topic, i) => (
              <span 
                key={i} 
                className="text-xs font-mono font-bold px-3 py-1 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] pro-text-main shadow-xs flex items-center gap-1.5"
              >
                <span className="text-emerald-500 font-black">✓</span>
                <span>{topic}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-6">
        {questions.map((q, i) => (
          <div key={q._id} className="glass-card shadow-md border-[var(--border-color)]">
            <h3 className="text-lg font-bold pro-text-main mb-5 leading-relaxed">
              <span className="text-[var(--accent-primary)] font-black mr-2">{i + 1}.</span> {q.question}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {q.options.map((opt, j) => (
                <label 
                  key={j} 
                  className={`
                    flex items-center p-4 rounded-xl cursor-pointer border-2 transition-all duration-200
                    ${answers[q._id] === opt 
                      ? 'bg-[var(--accent-glow)] border-[var(--accent-primary)] pro-text-main font-bold shadow-md' 
                      : 'bg-[var(--bg-secondary)] border-[var(--border-color)] pro-text-main font-medium hover:border-[var(--accent-primary)]'}
                  `}
                >
                  <input
                    type="radio"
                    name={q._id}
                    className="hidden"
                    checked={answers[q._id] === opt}
                    onChange={() => select(q._id, opt)}
                  />
                  <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center shrink-0 ${answers[q._id] === opt ? 'border-[var(--accent-primary)]' : 'border-[var(--border-color)]'}`}>
                    {answers[q._id] === opt && <div className="w-2.5 h-2.5 bg-[var(--accent-primary)] rounded-full"></div>}
                  </div>
                  <span className="leading-snug">{opt}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="pt-6 flex justify-end">
        <button 
          className="btn-primary flex items-center px-8 text-lg shadow-xl" 
          onClick={submit}
          disabled={submitting || Object.keys(answers).length < questions.length}
        >
          {submitting ? <Loader2 className="animate-spin mr-2" size={20} /> : <CheckCircle className="mr-2" size={20} />}
          {submitting ? "Analyzing..." : "Submit Answers"}
        </button>
      </div>
    </div>
  );
}