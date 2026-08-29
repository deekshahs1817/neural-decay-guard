import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import { Activity, Play, CheckCircle2, XCircle, ArrowLeft, Lightbulb, Volume2 } from "lucide-react";
import PomodoroTimer from "../components/PomodoroTimer";

export default function Workspace() {
  const { id } = useParams();
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Submission states
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  
  // Timer state
  const [startTime, setStartTime] = useState(Date.now());

  useEffect(() => {
    API.get(`/problems/${id}`)
      .then(res => {
        setProblem(res.data);
        setStartTime(Date.now());
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load problem", err);
        setLoading(false);
      });
  }, [id]);

  const handleSubmit = async () => {
    if (!selectedAnswer) return;
    setSubmitting(true);
    
    const timeSpentSecs = Math.floor((Date.now() - startTime) / 1000);

    try {
      const res = await API.post("/submit", {
        userId,
        problemId: id,
        selectedAnswer,
        timeSpentSecs
      });
      setResult(res.data);
    } catch (err) {
      console.error("Submission failed", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReadAloud = () => {
    if (!problem || !window.speechSynthesis) return;
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    // Strip HTML tags
    const tempElement = document.createElement("div");
    tempElement.innerHTML = problem.description;
    const cleanText = tempElement.textContent || tempElement.innerText || "";

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = "en-US";
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Activity className="animate-spin text-[var(--accent-primary)]" size={48} />
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="flex flex-col items-center justify-center p-12 pro-text-muted">
        <h2 className="text-xl">Problem not found.</h2>
        <button onClick={() => navigate('/problems')} className="mt-4 text-[var(--accent-primary)] hover:underline">Return to Problem Set</button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col animate-in fade-in duration-500">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[var(--border-color)] shrink-0">
        <div className="flex items-center">
          <button 
            onClick={() => navigate('/problems')}
            className="mr-4 p-2 rounded-lg hover:bg-[var(--bg-card)] pro-text-muted transition"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold flex items-center pro-text-main">
            {problem.title}
          </h1>
        </div>
        <div className="flex items-center space-x-3">
          <span className={`px-3 py-1 rounded-full text-xs font-bold border transition-colors ${problem.difficulty === 'Easy'? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.1)]' : problem.difficulty === 'Medium'? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.1)]' : 'bg-rose-500/10 border-rose-500/20 text-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.1)]'}`}>
            {problem.difficulty}
          </span>
          <span className="pro-bg-secondary px-3 py-1 pro-text-muted text-xs rounded-full border border-[var(--border-color)]">
            {problem.category}
          </span>
        </div>
      </div>

      {/* Split Pane */}
      <div className="flex flex-col lg:flex-row flex-1 mt-6 gap-6 min-h-0">
        
        {/* Left Pane: Description */}
        <div className="flex-1 glass-panel flex flex-col min-h-0 overflow-y-auto">
          <div className="p-4 border-b border-[var(--border-color)] bg-[var(--accent-glow)] shrink-0 flex justify-between items-center">
            <h3 className="font-bold pro-text-muted uppercase tracking-widest text-[10px]">Neural Protocol: Description</h3>
            <button 
              onClick={handleReadAloud}
              className="pro-text-muted hover:text-[var(--accent-primary)] p-1.5 rounded-lg hover:bg-[var(--bg-card)] transition border border-transparent hover:border-[var(--border-color)]"
              title="Read description aloud"
            >
              <Volume2 size={16} />
            </button>
          </div>
          <div className="p-6 pro-text-main leading-relaxed text-lg" dangerouslySetInnerHTML={{ __html: problem.description }}>
          </div>
        </div>

        {/* Right Pane: Solver / Results */}
        <div className="flex-1 glass-panel flex flex-col min-h-0 overflow-hidden relative">
          <div className="p-4 border-b border-[var(--border-color)] bg-[var(--accent-glow)] shrink-0">
            <h3 className="font-bold pro-text-muted uppercase tracking-widest text-[10px]">Cognitive Processing Unit</h3>
          </div>
          
          <div className="flex-1 p-6 overflow-y-auto w-full">
            {result ? (
               <div className="flex flex-col w-full animate-in slide-in-from-right duration-500">
                  <div className={`p-6 rounded-2xl border flex items-start w-full ${result.isCorrect ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
                     {result.isCorrect ? <CheckCircle2 className="text-emerald-500 mr-4 shrink-0" size={32}/> : <XCircle className="text-red-500 mr-4 shrink-0" size={32}/>}
                     <div>
                       <h3 className={`text-2xl font-black mb-1 ${result.isCorrect ? 'text-emerald-500' : 'text-red-500'}`}>
                         {result.status}
                       </h3>
                       {!result.isCorrect && (
                         <p className="pro-text-muted mt-2">Optimal Vector: <strong className="pro-text-main pro-bg-secondary px-3 py-1 rounded-lg border border-[var(--border-color)]">{result.correctAnswer}</strong></p>
                       )}
                     </div>
                  </div>

                  {/* Rating / Gamification Rewards */}
                  {result.isCorrect && result.gamification && (
                    <div className="mt-6 grid grid-cols-2 gap-4">
                       <div className="pro-bg-secondary border border-[var(--border-color)] p-4 rounded-xl flex items-center justify-between">
                         <span className="pro-text-muted text-[10px] font-bold tracking-widest uppercase">XP Gain</span>
                         <span className="text-emerald-500 font-mono text-xl font-bold">
                            +{problem.difficulty === 'Easy' ? 10 : problem.difficulty === 'Medium' ? 20 : 30}
                         </span>
                       </div>
                       <div className="pro-bg-secondary border border-[var(--border-color)] p-4 rounded-xl flex items-center justify-between">
                         <span className="pro-text-muted text-[10px] font-bold tracking-widest uppercase">Total XP</span>
                         <span className="text-[var(--accent-primary)] font-mono text-xl font-bold">{result.gamification.currentXp}</span>
                       </div>
                       
                       {result.gamification.leveledUp && (
                         <div className="col-span-2 bg-[var(--accent-glow)] border border-[var(--accent-primary)] text-[var(--accent-primary)] p-3 text-center rounded-xl font-bold animate-pulse">
                           NEURAL RANK UP! Level {result.gamification.currentLevel} Achieved
                         </div>
                       )}

                       {result.gamification.earnedBadges && result.gamification.earnedBadges.length > 0 && (
                         <div className="col-span-2 bg-violet-500/10 border border-violet-500/30 text-violet-400 p-3 text-center rounded-xl font-bold font-mono tracking-widest text-[10px] uppercase">
                           🏆 New Concept Mastered: {result.gamification.earnedBadges.join(", ")}
                         </div>
                       )}
                    </div>
                  )}

                  <div className="mt-6 border border-[var(--border-color)] rounded-2xl p-6 bg-[var(--bg-card)]">
                    <h4 className="flex items-center text-[var(--accent-primary)] mb-3 font-bold uppercase tracking-widest text-xs"><Lightbulb size={16} className="mr-2"/> AI Calibration Insight</h4>
                    <p className="pro-text-main leading-relaxed italic">"{result.explanation}"</p>
                  </div>
                  
                  <button 
                    onClick={() => navigate('/problems')}
                    className="btn-primary mt-8 w-full py-4 text-lg shadow-xl"
                  >
                    Next Objective
                  </button>
               </div>
            ) : (
                <div className="flex flex-col space-y-4 w-full h-full">
                  <p className="pro-text-muted mb-2 font-bold uppercase tracking-widest text-[10px]">Select Cognitive Vector:</p>
                  <div className="flex-1">
                    {problem.options?.map((opt, j) => (
                      <label 
                        key={j} 
                        className={`
                          flex items-center p-5 rounded-2xl cursor-pointer border-2 transition-all duration-300 mb-4
                          ${selectedAnswer === opt 
                            ? 'bg-[var(--accent-glow)] border-[var(--accent-primary)] pro-text-main shadow-lg' 
                            : 'bg-[var(--bg-card)] border-[var(--border-color)] pro-text-muted hover:border-[var(--accent-primary)] hover:pro-text-main'}
                        `}
                      >
                        <input
                          type="radio"
                          className="hidden"
                          checked={selectedAnswer === opt}
                          onChange={() => setSelectedAnswer(opt)}
                        />
                        <div className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center shrink-0 ${selectedAnswer === opt ? 'border-[var(--accent-primary)]' : 'border-[var(--border-color)]'}`}>
                          {selectedAnswer === opt && <div className="w-3 h-3 bg-[var(--accent-primary)] rounded-full animate-in zoom-in"></div>}
                        </div>
                        <span className="text-lg font-medium leading-relaxed">{opt}</span>
                      </label>
                    ))}
                  </div>

                  <div className="pt-6 border-t border-[var(--border-color)] shrink-0">
                    <button 
                      onClick={handleSubmit} 
                      disabled={!selectedAnswer || submitting}
                      className="btn-primary w-full flex items-center justify-center py-4 text-lg shadow-2xl relative overflow-hidden"
                    >
                      {submitting ? <Activity className="animate-spin mr-2" size={24} /> : <Play className="mr-2 fill-current" size={24} />}
                      <span className="relative z-10">{submitting ? "Engaging Neural Engine..." : "Submit Solution"}</span>
                      {submitting && <div className="absolute inset-0 bg-white/20 shimmer"></div>}
                    </button>
                  </div>
                </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Productivity Widget */}
      <div className="fixed bottom-6 right-6 z-50 hidden lg:block">
        <PomodoroTimer />
      </div>
    </div>
  );
}
