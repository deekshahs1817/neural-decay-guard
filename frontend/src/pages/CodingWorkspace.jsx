import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import API from "../services/api";
import { 
  Play, Send, RotateCcw, Sparkles, CheckCircle2, XCircle, 
  Clock, Cpu, Brain, Lightbulb, BookOpen, History, Terminal as TerminalIcon,
  ChevronRight, AlertTriangle, ArrowLeft, Flame, Trophy
} from "lucide-react";

export default function CodingWorkspace() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isDaily = searchParams.get("daily") === "true";
  const userId = localStorage.getItem("userId");

  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);

  // Editor State
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  
  // Tabs State
  const [leftTab, setLeftTab] = useState("description"); // description, editorial, submissions, aicoach
  const [bottomTab, setBottomTab] = useState("basic"); // basic, medium, hard, console

  // Execution & Submission State
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [runResult, setRunResult] = useState(null);
  const [submitResult, setSubmitResult] = useState(null);
  
  // AI Coach State
  const [aiHint, setAiHint] = useState("");
  const [hintLevel, setHintLevel] = useState(1);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiDiagnosis, setAiDiagnosis] = useState("");

  // Submissions History
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    fetchProblemDetails();
  }, [id]);

  useEffect(() => {
    if (problem && problem.starterCode) {
      setCode(problem.starterCode[language] || "");
    }
  }, [language, problem]);

  const fetchProblemDetails = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/coding/problems/${id}`);
      setProblem(res.data);
      if (res.data.starterCode) {
        setCode(res.data.starterCode[language] || "");
      }
      if (userId) {
        fetchSubmissions();
      }
    } catch (err) {
      console.error("Failed to load problem:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubmissions = async () => {
    try {
      const res = await API.get(`/coding/submissions/${userId}`);
      setSubmissions(res.data.filter(s => s.problemId?._id === id || s.problemId === id));
    } catch (err) {
      console.error("Failed to load submissions:", err);
    }
  };

  const handleRun = async () => {
    try {
      setRunning(true);
      setRunResult(null);
      setBottomTab("basic");
      const res = await API.post("/coding/run", {
        problemId: problem._id,
        language,
        code
      });
      setRunResult(res.data);
    } catch (err) {
      console.error("Run test cases failed:", err);
    } finally {
      setRunning(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      setSubmitResult(null);
      setBottomTab("basic");
      const res = await API.post("/coding/submit", {
        userId,
        problemId: problem._id,
        language,
        code,
        isDailyChallenge: isDaily
      });
      setSubmitResult(res.data);
      if (userId) fetchSubmissions();
    } catch (err) {
      console.error("Submit failed:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const requestAiHint = async (lvl) => {
    try {
      setAiLoading(true);
      setHintLevel(lvl);
      const res = await API.post("/coding/ai-hint", {
        problemId: problem._id,
        hintLevel: lvl,
        userCode: code
      });
      setAiHint(res.data.hint);
    } catch (err) {
      console.error("Failed to get AI hint:", err);
    } finally {
      setAiLoading(false);
    }
  };

  const requestAiDiagnosis = async () => {
    try {
      setAiLoading(true);
      setLeftTab("aicoach");
      const res = await API.post("/coding/ai-diagnose", {
        problemId: problem._id,
        code,
        language,
        errorOutput: submitResult || runResult
      });
      setAiDiagnosis(res.data.diagnosis);
    } catch (err) {
      console.error("Failed to diagnose:", err);
    } finally {
      setAiLoading(false);
    }
  };

  const resetStarterCode = () => {
    if (problem && problem.starterCode) {
      setCode(problem.starterCode[language] || "");
    }
  };

  if (loading) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-4 border-[var(--accent-primary)] border-t-transparent rounded-full animate-spin"></div>
        <p className="pro-text-muted font-bold text-sm">Initializing High-Precision Coding Workspace...</p>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="p-8 text-center glass-panel">
        <h2 className="text-xl font-bold pro-text-main">Problem Not Found</h2>
        <button onClick={() => navigate("/coding")} className="btn-primary mt-4">
          Return to Arena
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] gap-4 animate-in fade-in duration-200">
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[var(--bg-secondary)] border border-[var(--border-color)] px-6 py-3 rounded-2xl shadow-sm shrink-0">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate("/coding")}
            className="p-1.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] pro-text-muted hover:pro-text-main transition shadow-sm"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-black pro-text-main">{problem.title}</h1>
              <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                problem.difficulty === "Easy" ? "bg-emerald-500/10 text-emerald-500" :
                problem.difficulty === "Medium" ? "bg-amber-500/10 text-amber-500" : "bg-rose-500/10 text-rose-500"
              }`}>
                {problem.difficulty}
              </span>
              {isDaily && (
                <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-amber-500/20 text-amber-500 flex items-center gap-1">
                  <Flame size={10} /> Daily Challenge
                </span>
              )}
            </div>
            <p className="text-[10px] font-bold pro-text-muted">{problem.category}</p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {/* Language Selector */}
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="input-field !py-2 !px-3 text-xs font-bold bg-[var(--bg-card)] border-[var(--border-color)] rounded-xl"
          >
            <option value="javascript">JavaScript (Node.js)</option>
            <option value="python">Python 3</option>
            <option value="cpp">C++ (GCC 12)</option>
            <option value="c">C (Clang)</option>
            <option value="java">Java 17</option>
          </select>

          <button
            onClick={resetStarterCode}
            title="Reset to starter code"
            className="p-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] pro-text-muted hover:pro-text-main transition shadow-sm"
          >
            <RotateCcw size={16} />
          </button>

          <button
            onClick={handleRun}
            disabled={running || submitting}
            className="px-4 py-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] hover:bg-[var(--bg-secondary)] text-xs font-black uppercase pro-text-main transition flex items-center gap-2 shadow-sm disabled:opacity-50"
          >
            <Play size={14} className={running ? "animate-spin" : "text-emerald-500 fill-emerald-500"} />
            <span>{running ? "Executing..." : "Run Tests"}</span>
          </button>

          <button
            onClick={handleSubmit}
            disabled={submitting || running}
            className="btn-primary !px-5 !py-2 text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-lg disabled:opacity-50"
          >
            <Send size={14} className={submitting ? "animate-spin" : ""} />
            <span>{submitting ? "Evaluating (15 Tests)..." : "Submit Solution"}</span>
          </button>
        </div>
      </div>

      {/* Main Workspace 2-Column Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 min-h-0">
        {/* Left Column: Problem Tabs (Description, Editorial, Submissions, AI Coach) */}
        <div className="lg:col-span-5 flex flex-col glass-panel border-[var(--border-color)] overflow-hidden shadow-sm">
          {/* Tab Header */}
          <div className="flex border-b border-[var(--border-color)] bg-[var(--bg-secondary)] px-2 pt-2 gap-1 shrink-0 overflow-x-auto">
            {[
              { id: "description", label: "Description", icon: BookOpen },
              { id: "editorial", label: "Editorial", icon: Lightbulb },
              { id: "submissions", label: `Submissions (${submissions.length})`, icon: History },
              { id: "aicoach", label: "AI Coach", icon: Sparkles, highlight: true }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setLeftTab(tab.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-t-xl text-xs font-bold transition-colors whitespace-nowrap ${
                  leftTab === tab.id
                    ? "bg-[var(--bg-card)] border-t border-x border-[var(--border-color)] pro-text-main font-black"
                    : "pro-text-muted hover:pro-text-main"
                } ${tab.highlight && leftTab === tab.id ? "text-[var(--accent-primary)]" : ""}`}
              >
                <tab.icon size={14} className={tab.highlight ? "text-[var(--accent-primary)]" : ""} />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-5 flex-1 overflow-y-auto custom-scrollbar space-y-6 text-sm pro-text-main bg-[var(--bg-card)]">
            {leftTab === "description" && (
              <div className="space-y-6">
                {/* Clean Professional Description */}
                <div className="space-y-4 text-xs leading-relaxed pro-text-main font-medium">
                  {problem.description
                    ?.replace(/###\s*Problem Statement/gi, "")
                    ?.replace(/###\s*Requirements/gi, "---GOAL---")
                    ?.replace(/###/g, "")
                    ?.split("---GOAL---")
                    ?.map((section, sIdx) => {
                      const cleanSection = section.trim();
                      if (!cleanSection) return null;
                      
                      const lines = cleanSection.split("\n").filter(l => l.trim().length > 0);
                      return (
                        <div key={sIdx} className="space-y-2">
                          {sIdx === 1 && (
                            <span className="text-[10px] font-black uppercase tracking-wider text-[var(--accent-primary)] block">
                              Algorithmic Goal
                            </span>
                          )}
                          {lines.map((line, lIdx) => (
                            <p key={lIdx} className="leading-relaxed">
                              {line.split(/`([^`]+)`/g).map((part, pIdx) => {
                                if (pIdx % 2 === 1) {
                                  return (
                                    <code 
                                      key={pIdx} 
                                      className="px-1.5 py-0.5 rounded-md bg-[var(--bg-secondary)] border border-[var(--border-color)] font-mono text-[var(--accent-primary)] font-bold text-[11px] mx-0.5 shadow-sm"
                                    >
                                      {part}
                                    </code>
                                  );
                                }
                                return part;
                              })}
                            </p>
                          ))}
                        </div>
                      );
                    })}
                </div>

                {/* Examples */}
                <div className="space-y-3">
                  <h4 className="text-xs font-black uppercase tracking-wider text-[var(--accent-primary)]">Examples</h4>
                  {problem.examples?.map((ex, i) => (
                    <div key={i} className="p-3.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl space-y-1.5 font-mono text-xs shadow-inner">
                      <div><span className="text-[var(--accent-primary)] font-bold">Input:</span> {ex.input}</div>
                      <div><span className="text-emerald-500 font-bold">Output:</span> {ex.output}</div>
                      {ex.explanation && (
                        <div className="pro-text-muted text-[11px] font-sans font-medium mt-1">
                          <span className="font-bold">Explanation:</span> {ex.explanation}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Constraints */}
                {problem.constraints?.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-black uppercase tracking-wider pro-text-muted">Constraints</h4>
                    <ul className="list-disc list-inside space-y-1 text-xs font-mono pro-text-muted">
                      {problem.constraints.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {leftTab === "editorial" && (
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent-glow)] text-[var(--accent-primary)] text-xs font-black uppercase">
                  <Brain size={14} /> Algorithmic Breakdown
                </div>
                <div className="p-4 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl text-xs font-medium leading-relaxed shadow-sm space-y-3">
                  {(problem.editorialSolution || "Optimal approach utilizes optimal hash tables and two pointers.")
                    ?.replace(/###\s*Editorial Solution/gi, "")
                    ?.replace(/####\s*/g, "")
                    ?.replace(/###\s*/g, "")
                    ?.split("\n\n")
                    ?.map((para, pi) => (
                      <p key={pi} className="leading-relaxed">
                        {para.split(/`([^`]+)`/g).map((part, pIdx) => (
                          pIdx % 2 === 1 ? (
                            <code key={pIdx} className="px-1.5 py-0.5 rounded bg-[var(--bg-card)] border border-[var(--border-color)] font-mono text-[var(--accent-primary)] font-bold text-[11px] mx-0.5">
                              {part}
                            </code>
                          ) : part
                        ))}
                      </p>
                    ))}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl">
                    <span className="text-[10px] font-black uppercase pro-text-muted">Time Complexity</span>
                    <p className="font-mono font-bold text-sm text-[var(--accent-primary)]">{problem.timeComplexity}</p>
                  </div>
                  <div className="p-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl">
                    <span className="text-[10px] font-black uppercase pro-text-muted">Space Complexity</span>
                    <p className="font-mono font-bold text-sm text-cyan-500">{problem.spaceComplexity}</p>
                  </div>
                </div>
              </div>
            )}

            {leftTab === "submissions" && (
              <div className="space-y-3">
                {submissions.length === 0 ? (
                  <p className="text-center py-8 pro-text-muted font-medium">No previous submissions found.</p>
                ) : (
                  submissions.map(sub => (
                    <div key={sub._id} className="p-3.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {sub.status === "Accepted" ? (
                          <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
                        ) : (
                          <XCircle size={18} className="text-rose-500 shrink-0" />
                        )}
                        <div>
                          <p className={`font-bold text-xs ${sub.status === "Accepted" ? "text-emerald-500" : "text-rose-500"}`}>
                            {sub.status}
                          </p>
                          <p className="text-[10px] pro-text-muted font-mono">
                            {new Date(sub.createdAt).toLocaleTimeString()} • {sub.language} • {sub.runtimeMs}ms
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-bold pro-text-muted">
                        {sub.passCount} / {sub.totalTestCases} Tests
                      </span>
                    </div>
                  ))
                )}
              </div>
            )}

            {leftTab === "aicoach" && (
              <div className="space-y-5">
                <div className="p-4 bg-[var(--accent-glow)] border border-[var(--border-color)] rounded-2xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="text-[var(--accent-primary)]" size={18} />
                    <h4 className="text-xs font-black uppercase tracking-wider text-[var(--accent-primary)]">Socratic AI Mentor</h4>
                  </div>
                  <p className="text-xs font-medium pro-text-muted">
                    Request tiered hints that nudge your problem-solving process without spoiling the solution.
                  </p>
                </div>

                <div className="flex gap-2">
                  {[1, 2, 3].map(lvl => (
                    <button
                      key={lvl}
                      onClick={() => requestAiHint(lvl)}
                      disabled={aiLoading}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase transition border shadow-sm ${
                        hintLevel === lvl && aiHint
                          ? "bg-[var(--accent-primary)] text-white border-transparent"
                          : "bg-[var(--bg-secondary)] border-[var(--border-color)] pro-text-muted hover:pro-text-main"
                      }`}
                    >
                      Hint Level {lvl}
                    </button>
                  ))}
                </div>

                {aiLoading ? (
                  <div className="p-6 text-center pro-text-muted text-xs font-bold animate-pulse">
                    AI Coach analyzing code vector...
                  </div>
                ) : aiHint ? (
                  <div className="p-4 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl text-xs font-medium leading-relaxed whitespace-pre-line shadow-inner">
                    {aiHint}
                  </div>
                ) : null}

                {aiDiagnosis && (
                  <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-xs font-medium leading-relaxed text-rose-400 whitespace-pre-line">
                    <div className="font-black mb-1 flex items-center gap-1.5 text-rose-500 uppercase">
                      <AlertTriangle size={14} /> Diagnostic Feedback
                    </div>
                    {aiDiagnosis}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Code Editor & Test Case Evaluation Panel */}
        <div className="lg:col-span-7 flex flex-col gap-4 min-h-0">
          {/* Code Editor Box */}
          <div className="flex-1 glass-panel border-[var(--border-color)] flex flex-col overflow-hidden shadow-sm min-h-[300px]">
            <div className="bg-[var(--bg-secondary)] px-4 py-2 border-b border-[var(--border-color)] flex justify-between items-center shrink-0">
              <span className="text-[10px] font-mono text-[var(--accent-primary)] uppercase font-bold tracking-widest">
                SOLUTION_BUFFER.{language}
              </span>
              <span className="text-[10px] font-mono pro-text-muted font-bold">
                {code.split("\n").length} Lines
              </span>
            </div>

            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="flex-1 w-full p-4 bg-[var(--bg-card)] font-mono text-xs leading-relaxed pro-text-main resize-none focus:outline-none custom-scrollbar"
              spellCheck="false"
              placeholder="// Write your algorithm here..."
            />
          </div>

          {/* Bottom 3-Tier Test Case Validation Panel */}
          <div className="h-56 glass-panel border-[var(--border-color)] flex flex-col overflow-hidden shadow-sm shrink-0">
            {/* Panel Tab Header */}
            <div className="flex border-b border-[var(--border-color)] bg-[var(--bg-secondary)] px-3 pt-2 gap-2 shrink-0">
              {[
                { id: "basic", label: "Basic (3 Tests)", pass: submitResult?.basicPassed ?? runResult?.results?.filter(r => r.passed).length, total: 3 },
                { id: "medium", label: "Medium (5 Hidden)", pass: submitResult?.mediumPassed, total: 5 },
                { id: "hard", label: "Hard (7 Stress)", pass: submitResult?.hardPassed, total: 7 }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setBottomTab(tab.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-t-xl text-xs font-bold transition-colors ${
                    bottomTab === tab.id
                      ? "bg-[var(--bg-card)] border-t border-x border-[var(--border-color)] pro-text-main font-black"
                      : "pro-text-muted hover:pro-text-main"
                  }`}
                >
                  <span>{tab.label}</span>
                  {tab.pass !== undefined && (
                    <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono font-black ${
                      tab.pass === tab.total ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"
                    }`}>
                      {tab.pass}/{tab.total}
                    </span>
                  )}
                </button>
              ))}

              {submitResult && (
                <div className="ml-auto flex items-center gap-3 pr-2">
                  <span className="text-[10px] font-mono pro-text-muted flex items-center gap-1">
                    <Clock size={12} /> {submitResult.runtimeMs}ms
                  </span>
                  <span className="text-[10px] font-mono pro-text-muted flex items-center gap-1">
                    <Cpu size={12} /> {submitResult.memoryMb}MB
                  </span>
                </div>
              )}
            </div>

            {/* Panel Content */}
            <div className="p-4 flex-1 overflow-y-auto custom-scrollbar bg-[var(--bg-card)]">
              {bottomTab === "basic" && (
                <div className="space-y-3">
                  {(submitResult?.basicResults || runResult?.results || problem.basicTestCases.map((tc, idx) => ({
                    testIndex: idx + 1,
                    input: tc.input,
                    expectedOutput: tc.expectedOutput,
                    actualOutput: "Not run yet",
                    passed: null
                  }))).map((tc, i) => (
                    <div key={i} className="p-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl flex items-center justify-between text-xs font-mono shadow-inner">
                      <div className="flex items-center gap-2.5">
                        {tc.passed === true && <CheckCircle2 size={16} className="text-emerald-500" />}
                        {tc.passed === false && <XCircle size={16} className="text-rose-500" />}
                        {tc.passed === null && <span className="w-4 h-4 rounded-full border border-[var(--border-color)] flex items-center justify-center text-[10px] pro-text-muted">{i+1}</span>}
                        <span className="font-bold">Test Case #{tc.testIndex || i + 1}</span>
                      </div>
                      <div className="text-[11px] pro-text-muted">
                        Input: <span className="pro-text-main font-bold">{tc.input}</span> | Expected: <span className="text-emerald-500 font-bold">{tc.expectedOutput}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {bottomTab === "medium" && (
                <div className="p-4 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl flex flex-col items-center justify-center text-center">
                  <h4 className="font-bold text-sm pro-text-main">Medium Edge Cases (5 Hidden Tests)</h4>
                  <p className="pro-text-muted text-xs mt-1">Tests negative values, boundary collisions, zero states, and duplicate elements.</p>
                  <p className="mt-3 text-2xl font-black font-mono text-[var(--accent-primary)]">
                    {submitResult ? `${submitResult.mediumPassed} / 5 Passed` : "Submit code to evaluate"}
                  </p>
                </div>
              )}

              {bottomTab === "hard" && (
                <div className="p-4 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl flex flex-col items-center justify-center text-center">
                  <h4 className="font-bold text-sm pro-text-main">Hard Performance Validation (7 Hidden Tests)</h4>
                  <p className="pro-text-muted text-xs mt-1">Evaluates asymptotic time complexity, memory footprint, and high-volume constraints.</p>
                  <p className="mt-3 text-2xl font-black font-mono text-cyan-500">
                    {submitResult ? `${submitResult.hardPassed} / 7 Passed` : "Submit code to evaluate"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal / Banner */}
      {submitResult && submitResult.status === "Accepted" && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-200">
          <div className="hud-panel max-w-md w-full p-8 text-center space-y-6 border-emerald-500/30 shadow-2xl">
            <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl mx-auto flex items-center justify-center text-emerald-500 animate-bounce">
              <Trophy size={32} />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Neural Sync Confirmed</span>
              <h3 className="text-2xl font-black pro-text-main mt-1">ACCEPTED • 15/15 TESTS PASSED</h3>
              <p className="pro-text-muted text-xs mt-2 font-medium">
                Runtime: {submitResult.runtimeMs}ms (Faster than 89%) | Memory: {submitResult.memoryMb}MB
              </p>
            </div>

            <div className="p-4 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl flex justify-around font-mono text-xs">
              <div>
                <span className="pro-text-muted text-[10px] uppercase block">XP Awarded</span>
                <span className="text-emerald-500 font-bold text-base">+{submitResult.xpEarned} XP</span>
              </div>
              {submitResult.streakBonus > 0 && (
                <div>
                  <span className="pro-text-muted text-[10px] uppercase block">Streak Bonus</span>
                  <span className="text-amber-500 font-bold text-base">+{submitResult.streakBonus} XP</span>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => setSubmitResult(null)}
                className="flex-1 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] pro-text-main text-xs font-bold uppercase tracking-wider shadow-sm"
              >
                Review Code
              </button>
              <button 
                onClick={() => navigate("/coding")}
                className="flex-1 btn-primary !py-3 text-xs font-black uppercase tracking-wider shadow-lg"
              >
                Next Problem
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
