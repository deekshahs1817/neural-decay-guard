import { useEffect, useState } from "react";
import API from "../services/api";
import { Brain, CheckCircle, ArrowRight, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function DailyQuiz() {
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [personalizedTopics, setPersonalizedTopics] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [score, setScore] = useState(null);

  useEffect(() => {
    API.get(`/daily-random`, { params: { userId } })
      .then(res => {
        setQuestions(res.data.questions || []);
        setPersonalizedTopics(res.data.personalizedTopics || []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load quiz", err);
        setLoading(false);
      });
  }, [userId]);

  const select = (qid, opt) => {
    setAnswers({ ...answers, [qid]: opt });
  };

  const submit = async () => {
    setSubmitting(true);
    try {
      const res = await API.post('/submitQuiz', { userId, answers });
      setScore(res.data.score);
    } catch (err) {
      alert("Failed to submit quiz");
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

  if (score !== null) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-in fade-in zoom-in duration-500">
        <div className="w-32 h-32 bg-[var(--accent-glow)] rounded-full flex items-center justify-center mb-6 shadow-xl border border-[var(--border-color)]">
          <CheckCircle className="text-emerald-500" size={64} />
        </div>
        <h2 className="text-3xl font-black pro-text-main mb-2">Quiz Complete!</h2>
        <p className="pro-text-muted text-lg mb-8">You scored <span className="text-[var(--accent-primary)] font-bold text-3xl">{score}</span> points.</p>
        <button onClick={() => navigate('/dashboard')} className="btn-primary flex items-center shadow-xl">
          Return to Dashboard <ArrowRight className="ml-2" size={20} />
        </button>
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