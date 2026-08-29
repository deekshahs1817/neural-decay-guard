const LETTERS = ['A', 'B', 'C', 'D', 'E'];

export default function QuizCard({
  question,
  options,
  selected,
  onSelect,
  current,
  total,
  subject,
}) {
  const progress = total > 0 ? ((current) / total) * 100 : 0;

  return (
    <div className="quiz-card">
      <div className="quiz-progress-bar">
        <div className="quiz-progress-fill" style={{ width: `${progress}%` }} />
      </div>

      <div className="quiz-meta">
        <span className="quiz-counter">
          Question {current} of {total}
        </span>
        {subject && (
          <span className="quiz-subject-badge">{subject}</span>
        )}
      </div>

      <div className="quiz-question">{question}</div>

      <div className="quiz-options">
        {options.map((opt, i) => (
          <button
            key={i}
            className={`quiz-option${selected === opt ? ' selected' : ''}`}
            onClick={() => onSelect(opt)}
          >
            <span className="quiz-option-letter">{LETTERS[i]}</span>
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
