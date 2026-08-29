import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import { 
  BookOpen, CheckCircle2, Lock, Sparkles, ChevronRight, 
  X, Play, Award, Brain, Lightbulb, ArrowRight, HelpCircle,
  ExternalLink, Trophy
} from "lucide-react";

export default function DSARoadmap() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const [sets, setSets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSet, setActiveSet] = useState(null);
  const [modalTab, setModalTab] = useState("concept"); // concept, quiz, practice

  // Quiz Form State
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizSubmitting, setQuizSubmitting] = useState(false);
  const [quizResult, setQuizResult] = useState(null);

  useEffect(() => {
    fetchSets();
  }, []);

  const fetchSets = async () => {
    try {
      setLoading(true);
      const res = await API.get("/learning-path/sets", { params: { userId } });
      setSets(res.data.sets || []);
    } catch (err) {
      console.error("Failed to load DSA sets:", err);
    } finally {
      setLoading(false);
    }
  };

  const openSetModal = async (setNumber) => {
    try {
      setModalTab("concept");
      setSelectedAnswers({});
      setQuizResult(null);
      const res = await API.get(`/learning-path/sets/${setNumber}`);
      setActiveSet(res.data);
    } catch (err) {
      console.error("Failed to load set details:", err);
    }
  };

  const handleSelectOption = (qIdx, option) => {
    setSelectedAnswers(prev => ({ ...prev, [qIdx]: option }));
  };

  const submitAssessment = async () => {
    try {
      setQuizSubmitting(true);
      const res = await API.post(`/learning-path/sets/${activeSet.setNumber}/submit`, {
        userId,
        answers: selectedAnswers
      });
      setQuizResult(res.data);
      fetchSets();
    } catch (err) {
      console.error("Submit quiz failed:", err);
    } finally {
      setQuizSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      {/* Header Banner */}
      <div className="hud-panel p-8 border-[var(--border-color)] bg-[var(--bg-secondary)] relative overflow-hidden shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent-glow)] border border-[var(--border-color)] text-[var(--accent-primary)] text-xs font-black uppercase">
              <Brain size={14} /> Comprehensive 25-Set Curriculum
            </div>
            <h1 className="text-3xl md:text-5xl font-black pro-text-main tracking-tight uppercase">
              DSA <span className="text-[var(--accent-primary)]">Roadmap</span>
            </h1>
            <p className="pro-text-muted text-sm font-medium max-w-xl">
              25 Mastery Sets with 125 Core Interactive DSA Questions, concept deep dives, and structured progression.
            </p>
          </div>

          <div className="p-4 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl flex items-center gap-4 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500">
              <Award size={24} />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase pro-text-muted tracking-widest block">Completed Sets</span>
              <p className="text-2xl font-black font-mono pro-text-main">
                {sets.filter(s => s.isCompleted).length} / 25
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 25 Sets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-20 text-center pro-text-muted font-bold">
            <div className="w-8 h-8 border-2 border-[var(--accent-primary)] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            Loading DSA Learning Path...
          </div>
        ) : (
          sets.map(s => (
            <div
              key={s.setNumber}
              onClick={() => s.isUnlocked && openSetModal(s.setNumber)}
              className={`glass-card border-[var(--border-color)] p-6 space-y-4 transition-all duration-200 relative overflow-hidden ${
                s.isCompleted
                  ? "border-emerald-500/40 bg-emerald-500/[0.02]"
                  : s.isUnlocked
                  ? "hover:border-[var(--accent-primary)] cursor-pointer shadow-md"
                  : "opacity-50 cursor-not-allowed bg-[var(--bg-secondary)]"
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-xl bg-[var(--accent-glow)] border border-[var(--border-color)] flex items-center justify-center font-mono font-black text-xs text-[var(--accent-primary)]">
                    {s.setNumber}
                  </span>
                  <div>
                    <span className="text-[10px] font-black uppercase pro-text-muted">{s.category}</span>
                    <h3 className="font-bold text-base pro-text-main leading-tight">{s.title}</h3>
                  </div>
                </div>

                {s.isCompleted ? (
                  <span className="p-1.5 bg-emerald-500/10 text-emerald-500 rounded-lg">
                    <CheckCircle2 size={18} />
                  </span>
                ) : s.isUnlocked ? (
                  <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-[var(--accent-glow)] text-[var(--accent-primary)]">
                    Active
                  </span>
                ) : (
                  <span className="p-1.5 bg-slate-500/10 text-slate-400 rounded-lg">
                    <Lock size={16} />
                  </span>
                )}
              </div>

              <p className="pro-text-muted text-xs font-medium line-clamp-2 leading-relaxed">
                {s.description}
              </p>

              <div className="flex items-center justify-between pt-3 border-t border-[var(--border-color)] text-[11px] font-bold">
                <span className="pro-text-muted">5 Questions • +{s.xpReward} XP</span>
                {s.isUnlocked && (
                  <span className="text-[var(--accent-primary)] flex items-center gap-1 font-black uppercase text-[10px]">
                    Explore Set <ChevronRight size={14} />
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Set Details & Quiz Modal */}
      {activeSet && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="glass-panel max-w-3xl w-full max-h-[90vh] flex flex-col border-[var(--border-color)] shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b border-[var(--border-color)] bg-[var(--bg-secondary)] flex justify-between items-center shrink-0">
              <div>
                <span className="text-[10px] font-black uppercase text-[var(--accent-primary)] tracking-widest block">
                  SET {activeSet.setNumber} • {activeSet.category}
                </span>
                <h2 className="text-2xl font-black pro-text-main">{activeSet.title}</h2>
              </div>
              <button 
                onClick={() => setActiveSet(null)}
                className="p-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] pro-text-muted hover:pro-text-main"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Navigation Tabs */}
            <div className="flex border-b border-[var(--border-color)] bg-[var(--bg-secondary)] px-6 gap-3 shrink-0">
              {[
                { id: "concept", label: "Concept Theory", icon: BookOpen },
                { id: "quiz", label: `Assessment Quiz (${activeSet.quizQuestions?.length || 5} Qs)`, icon: HelpCircle },
                { id: "practice", label: "Suggested LeetCode Problems", icon: Trophy }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setModalTab(tab.id)}
                  className={`flex items-center gap-2 py-3 px-3 text-xs font-bold border-b-2 transition-all ${
                    modalTab === tab.id
                      ? "border-[var(--accent-primary)] text-[var(--accent-primary)] font-black"
                      : "border-transparent pro-text-muted hover:pro-text-main"
                  }`}
                >
                  <tab.icon size={15} />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Modal Body */}
            <div className="p-6 flex-1 overflow-y-auto custom-scrollbar space-y-6 bg-[var(--bg-card)]">
              {modalTab === "concept" && activeSet.conceptGuide && (
                <div className="space-y-6">
                  <div className="p-4 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl space-y-2 shadow-sm">
                    <h4 className="text-xs font-black uppercase text-[var(--accent-primary)] tracking-wider">Concept Overview</h4>
                    <p className="text-xs font-medium leading-relaxed pro-text-main">
                      {activeSet.conceptGuide.overview}
                    </p>
                  </div>

                  {activeSet.conceptGuide.keyPatterns?.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-black uppercase pro-text-muted tracking-wider">Key Algorithmic Patterns</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {activeSet.conceptGuide.keyPatterns.map((pat, i) => (
                          <div key={i} className="p-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl text-xs font-bold pro-text-main">
                            • {pat}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeSet.conceptGuide.timeSpaceRules && (
                    <div className="p-4 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl space-y-1">
                      <span className="text-[10px] font-black uppercase pro-text-muted">Complexity Boundaries</span>
                      <p className="font-mono text-xs font-bold text-[var(--accent-primary)]">
                        {activeSet.conceptGuide.timeSpaceRules}
                      </p>
                    </div>
                  )}

                  {activeSet.conceptGuide.codeExample && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-black uppercase pro-text-muted">Pattern Implementation Snippet</h4>
                      <pre className="p-4 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl font-mono text-xs text-[var(--accent-primary)] overflow-x-auto">
                        {activeSet.conceptGuide.codeExample}
                      </pre>
                    </div>
                  )}

                  <button
                    onClick={() => setModalTab("quiz")}
                    className="btn-primary w-full !py-3.5 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg"
                  >
                    <span>Start 5-Question Assessment</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              )}

              {modalTab === "quiz" && (
                <div className="space-y-6">
                  {quizResult ? (
                    <div className="space-y-6 text-center">
                      <div className={`w-16 h-16 rounded-2xl mx-auto flex items-center justify-center ${
                        quizResult.isPassed ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/30" : "bg-amber-500/10 text-amber-500 border border-amber-500/30"
                      }`}>
                        <Award size={32} />
                      </div>
                      <div>
                        <h3 className="text-2xl font-black pro-text-main">
                          {quizResult.isPassed ? "Set Assessment Mastered!" : "Keep Practicing"}
                        </h3>
                        <p className="pro-text-muted text-xs mt-1">
                          Scored {quizResult.scorePercentage}% ({quizResult.correctCount}/{quizResult.totalQuestions} correct) • +{quizResult.xpAwarded} XP Earned
                        </p>
                      </div>

                      <div className="space-y-3 text-left">
                        {quizResult.results.map((r, i) => (
                          <div key={i} className="p-4 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl space-y-1.5 text-xs">
                            <div className="flex items-center gap-2">
                              {r.isCorrect ? <CheckCircle2 size={16} className="text-emerald-500" /> : <X size={16} className="text-rose-500" />}
                              <span className="font-bold pro-text-main">{i + 1}. {r.question}</span>
                            </div>
                            <div className="pro-text-muted text-[11px]">
                              Correct: <span className="text-emerald-500 font-bold">{r.correctAnswer}</span>
                            </div>
                            <p className="text-[10px] text-[var(--accent-primary)] font-medium">{r.explanation}</p>
                          </div>
                        ))}
                      </div>

                      <button
                        onClick={() => {
                          setQuizResult(null);
                          setSelectedAnswers({});
                        }}
                        className="btn-primary !px-8 !py-3 text-xs font-black uppercase tracking-wider"
                      >
                        Retake Assessment
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {activeSet.quizQuestions?.map((q, idx) => (
                        <div key={idx} className="p-5 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl space-y-3">
                          <div className="flex justify-between items-start gap-4">
                            <span className="font-bold text-xs pro-text-main">
                              {idx + 1}. {q.question}
                            </span>
                            <span className="text-[9px] font-mono font-black uppercase px-2 py-0.5 rounded bg-[var(--bg-card)] border border-[var(--border-color)] pro-text-muted">
                              {q.type}
                            </span>
                          </div>

                          {q.codeSnippet && (
                            <pre className="p-3 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl font-mono text-[11px] pro-text-main overflow-x-auto">
                              {q.codeSnippet}
                            </pre>
                          )}

                          <div className="space-y-2">
                            {q.options?.map((opt, oi) => (
                              <button
                                key={oi}
                                onClick={() => handleSelectOption(idx, opt)}
                                className={`w-full text-left p-3 rounded-xl border text-xs font-medium transition-all ${
                                  selectedAnswers[idx] === opt
                                    ? "bg-[var(--accent-glow)] border-[var(--accent-primary)] text-[var(--accent-primary)] font-bold shadow-sm"
                                    : "bg-[var(--bg-card)] border-[var(--border-color)] pro-text-muted hover:pro-text-main"
                                }`}
                              >
                                <span className="font-mono font-bold mr-2">{String.fromCharCode(65 + oi)}.</span>
                                {opt}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}

                      <button
                        onClick={submitAssessment}
                        disabled={quizSubmitting || Object.keys(selectedAnswers).length < activeSet.quizQuestions?.length}
                        className="btn-primary w-full !py-4 text-xs font-black uppercase tracking-widest shadow-xl disabled:opacity-50"
                      >
                        {quizSubmitting ? "Evaluating Assessment..." : "Submit All 5 Questions"}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {modalTab === "practice" && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-black uppercase text-[var(--accent-primary)] tracking-wider">
                      Suggested LeetCode Practice Problems ({activeSet.practiceExercises?.length || 0})
                    </h4>
                    <span className="text-[10px] font-mono pro-text-muted">
                      Direct LeetCode Practice Link
                    </span>
                  </div>

                  <div className="space-y-3">
                    {activeSet.practiceExercises?.map((ex, i) => {
                      const leetcodeSlug = (ex.title || "")
                        .toLowerCase()
                        .replace(/[^a-z0-9\s-]/g, '')
                        .trim()
                        .replace(/\s+/g, '-');
                      const leetcodeUrl = ex.url || `https://leetcode.com/problems/${leetcodeSlug}/`;

                      return (
                        <div 
                          key={i} 
                          className="p-4 bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-[var(--accent-primary)] rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition shadow-sm group"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                                ex.difficulty === "Easy" ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" :
                                ex.difficulty === "Medium" ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" :
                                "bg-rose-500/10 text-rose-500 border border-rose-500/20"
                              }`}>
                                {ex.difficulty}
                              </span>
                              {ex.timeComplexity && (
                                <span className="text-[10px] font-mono text-[var(--accent-primary)] font-bold">
                                  {ex.timeComplexity}
                                </span>
                              )}
                            </div>
                            <h4 className="font-black text-sm pro-text-main group-hover:text-[var(--accent-primary)] transition-colors">
                              {ex.title}
                            </h4>
                            <p className="pro-text-muted text-xs line-clamp-1">{ex.description}</p>
                          </div>

                          <a
                            href={leetcodeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-primary !px-4 !py-2 text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 shrink-0 shadow-md hover:scale-105 transition-transform"
                          >
                            <span>Solve on LeetCode</span>
                            <ExternalLink size={13} />
                          </a>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
