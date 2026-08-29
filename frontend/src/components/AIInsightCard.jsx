import { Sparkles, Brain, Target, Zap } from 'lucide-react';

export default function AIInsightCard({ accuracy, streak, level }) {
  // Logic to generate dynamic insights based on props
  const getInsights = () => {
    if (accuracy < 70) return "Synaptic latency detected in Logic categories. Recommend switching to Socratic Guidance mode in your next session to strengthen foundational pathways.";
    if (streak > 5) return "Your neural consistency is exceptional. The Gemini Engine suggests initiating 'Brain Burn' challenge mode to push your cognitive ceiling.";
    if (level < 3) return "Initial neural mapping in progress. Continue daily sprints to complete your baseline cognitive index.";
    return "Cognitive performance is tracking optimal. Maintain current spacing repetition intervals for maximum memory retention.";
  };

  return (
    <div className="glass-panel p-6 border-l-4 border-l-[var(--accent-primary)] relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
        <Sparkles size={80} className="text-[var(--accent-primary)]" />
      </div>
      
      <div className="flex items-center space-x-2 mb-4">
        <div className="bg-[var(--accent-glow)] p-2 rounded-lg text-[var(--accent-primary)]">
          <Brain size={20} />
        </div>
        <h3 className="font-bold pro-text-main text-sm uppercase tracking-wider">AI Neural Insight</h3>
      </div>

      <p className="pro-text-main text-sm leading-relaxed italic relative z-10">
        "{getInsights()}"
      </p>

      <div className="mt-4 flex items-center justify-between pt-4 border-t border-[var(--border-color)]">
        <div className="flex items-center text-[10px] pro-text-muted font-bold uppercase tracking-tighter">
          <Zap size={12} className="mr-1 text-cyan-400" />
          Pulse Calibrated
        </div>
        <button className="text-[10px] text-[var(--accent-primary)] font-bold uppercase tracking-widest hover:underline">
          View Detailed Analysis
        </button>
      </div>
    </div>
  );
}
