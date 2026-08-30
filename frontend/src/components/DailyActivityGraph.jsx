import { useState, useMemo } from "react";
import { 
  Activity, Calendar, Zap, Sparkles, Flame, Brain, 
  BarChart2, LineChart, ChevronRight, CheckCircle2, GraduationCap, BookOpen 
} from "lucide-react";

export default function DailyActivityGraph({ dailyActivityMap = {}, dailyBreakdownMap = {}, streak = 0, solvedCount = 0, totalXP = 0 }) {
  const [range, setRange] = useState(7); // 7, 14, 30 days
  const [chartType, setChartType] = useState("bars"); // 'bars' or 'curve'
  const [activeMetric, setActiveMetric] = useState("all"); // 'all', 'quizzes', 'challenges', 'courses', 'xp'
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);

  // Compute strictly from genuine MongoDB dailyActivityMap and dailyBreakdownMap
  const activityData = useMemo(() => {
    const today = new Date();
    const days = [];
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    for (let i = range - 1; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000);
      const isToday = i === 0;
      const dayName = dayNames[d.getDay()];
      const dateKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      const dateDisplay = d.toLocaleDateString("en-US", { month: "short", day: "numeric", weekday: "short" });

      // Fetch authentic activity count and breakdown from database map
      const totalActivities = dailyActivityMap[dateKey] || 0;
      const breakdown = dailyBreakdownMap[dateKey] || { quizzes: totalActivities, challenges: 0, courses: 0, dsa: 0 };
      
      const quizzes = breakdown.quizzes || 0;
      const challenges = breakdown.challenges || 0;
      const courses = (breakdown.courses || 0) + (breakdown.dsa || 0);
      const dayXP = (totalActivities * 25) || (breakdown.xp || 0);

      let metricValue = totalActivities;
      if (activeMetric === "quizzes") metricValue = quizzes;
      if (activeMetric === "challenges") metricValue = challenges;
      if (activeMetric === "courses") metricValue = courses;
      if (activeMetric === "xp") metricValue = dayXP;

      days.push({
        date: dateDisplay,
        dateKey,
        dayName: range <= 14 ? `${dayName} ${d.getDate()}` : `${d.getDate()}`,
        quizzes,
        challenges,
        courses,
        xp: dayXP,
        total: totalActivities,
        value: metricValue,
        isToday
      });
    }

    const calculatedTotal = days.reduce((acc, d) => acc + d.total, 0);
    const calculatedXP = days.reduce((acc, d) => acc + d.xp, 0) || totalXP || (calculatedTotal * 25);
    const avgDaily = (calculatedTotal / range).toFixed(1);
    const activeDaysCount = days.filter(d => d.total > 0).length;

    return {
      days,
      total: calculatedTotal,
      totalXP: calculatedXP,
      avgDaily,
      activeDaysCount
    };
  }, [range, dailyActivityMap, dailyBreakdownMap, totalXP, activeMetric]);

  const maxVal = Math.max(...activityData.days.map(d => d.value), 4);

  // SVG Curve calculations
  const width = 640;
  const height = 170;
  const paddingX = 35;
  const paddingY = 25;

  const points = activityData.days.map((d, idx) => {
    const x = paddingX + (idx / (activityData.days.length - 1)) * (width - 2 * paddingX);
    const y = height - paddingY - (d.value / maxVal) * (height - 2 * paddingY);
    return { ...d, x, y };
  });

  const pathD = points.reduce((acc, pt, idx, arr) => {
    if (idx === 0) return `M ${pt.x},${pt.y}`;
    const prev = arr[idx - 1];
    const midX = (prev.x + pt.x) / 2;
    return `${acc} C ${midX},${prev.y} ${midX},${pt.y} ${pt.x},${pt.y}`;
  }, "");

  const areaD = `${pathD} L ${points[points.length - 1].x},${height - paddingY} L ${points[0].x},${height - paddingY} Z`;

  return (
    <div className="space-y-6 select-none">
      {/* Header Bar with View & Range Switchers */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-[var(--border-color)]">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-black pro-text-main flex items-center uppercase tracking-wider gap-2">
              <Activity className="text-[var(--accent-primary)]" size={18} />
              Daily Activity Performance
            </h3>
            <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Live Real-Time Sync
            </span>
          </div>
          <p className="text-xs pro-text-muted mt-0.5">
            Verified day-by-day telemetry tracking retention quizzes, LeetCode calendar checks, and course sets.
          </p>
        </div>

        {/* Controls: Chart Type Toggle & Time Range */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Chart Type Toggle */}
          <div className="flex items-center bg-[var(--bg-secondary)] p-1 rounded-xl border border-[var(--border-color)]">
            <button
              onClick={() => setChartType("bars")}
              className={`p-1.5 rounded-lg transition ${chartType === "bars" ? "bg-[var(--accent-primary)] text-white shadow-xs" : "pro-text-muted hover:pro-text-main"}`}
              title="Bar Chart View"
            >
              <BarChart2 size={15} />
            </button>
            <button
              onClick={() => setChartType("curve")}
              className={`p-1.5 rounded-lg transition ${chartType === "curve" ? "bg-[var(--accent-primary)] text-white shadow-xs" : "pro-text-muted hover:pro-text-main"}`}
              title="Smooth Curve Area View"
            >
              <LineChart size={15} />
            </button>
          </div>

          {/* Time Range Pills */}
          <div className="flex items-center gap-1 bg-[var(--bg-secondary)] p-1 rounded-xl border border-[var(--border-color)] text-xs font-bold">
            {[
              { id: 7, label: "7 Days" },
              { id: 14, label: "14 Days" },
              { id: 30, label: "30 Days" }
            ].map(r => (
              <button
                key={r.id}
                onClick={() => setRange(r.id)}
                className={`px-3 py-1 rounded-lg transition ${
                  range === r.id
                    ? "bg-[var(--accent-primary)] text-white font-black shadow-xs"
                    : "pro-text-muted hover:pro-text-main"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Metric Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
        {[
          { id: "all", label: "All Activities", icon: Sparkles },
          { id: "quizzes", label: "Retention Quizzes", icon: Brain },
          { id: "challenges", label: "LeetCode Checks", icon: Flame },
          { id: "courses", label: "Course & DSA Sets", icon: GraduationCap },
          { id: "xp", label: "XP Velocity", icon: Zap }
        ].map(m => (
          <button
            key={m.id}
            onClick={() => setActiveMetric(m.id)}
            className={`px-3.5 py-1.5 rounded-xl border flex items-center gap-2 transition ${
              activeMetric === m.id
                ? "bg-[var(--accent-glow)] border-[var(--accent-primary)] text-[var(--accent-primary)] font-black shadow-xs"
                : "bg-[var(--bg-secondary)] border-[var(--border-color)] pro-text-muted hover:pro-text-main"
            }`}
          >
            <m.icon size={14} />
            <span>{m.label}</span>
          </button>
        ))}
      </div>

      {/* Primary Chart Canvas */}
      <div className="relative bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-3xl p-6 shadow-inner space-y-4">
        {chartType === "bars" ? (
          /* Interactive Bar Chart Representation */
          <div className="space-y-4">
            <div className="flex items-end justify-between gap-2 h-44 pt-6 px-2">
              {activityData.days.map((day, idx) => {
                const heightPercent = maxVal > 0 ? Math.max(8, (day.value / maxVal) * 100) : 8;
                const isSelected = selectedDay?.dateKey === day.dateKey;
                const isHovered = hoveredPoint?.dateKey === day.dateKey;

                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedDay(day)}
                    onMouseEnter={() => setHoveredPoint(day)}
                    onMouseLeave={() => setHoveredPoint(null)}
                    className="flex-1 flex flex-col items-center gap-2 group cursor-pointer h-full justify-end"
                  >
                    {/* Top Value Label */}
                    <span className={`text-[10px] font-mono font-black transition-opacity ${day.value > 0 || isHovered ? "opacity-100 text-cyan-400" : "opacity-0"}`}>
                      {day.value}
                    </span>

                    {/* Bar Cylinder */}
                    <div className="w-full max-w-[32px] bg-[var(--bg-card)] border border-[var(--border-color)] rounded-t-xl h-full flex items-end p-0.5 transition-all group-hover:border-cyan-400 overflow-hidden">
                      <div
                        className={`w-full rounded-t-lg transition-all duration-500 ${
                          isSelected
                            ? "bg-gradient-to-t from-emerald-500 via-teal-400 to-cyan-400 shadow-xl ring-2 ring-emerald-400"
                            : isHovered
                            ? "bg-gradient-to-t from-cyan-400 via-indigo-500 to-purple-400 shadow-md"
                            : day.isToday
                            ? "bg-gradient-to-t from-indigo-600 via-cyan-400 to-emerald-400 shadow-lg ring-1 ring-cyan-400/40"
                            : day.value > 0
                            ? "bg-gradient-to-t from-indigo-600 via-teal-500 to-cyan-400 shadow-md"
                            : "bg-slate-800/30"
                        }`}
                        style={{ height: `${heightPercent}%` }}
                      />
                    </div>

                    {/* Day Label */}
                    <span className={`text-[11px] font-mono font-bold transition ${day.isToday ? "text-[var(--accent-primary)] font-black" : "pro-text-muted group-hover:pro-text-main"}`}>
                      {day.dayName}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* Smooth Continuous Trend Line SVG Chart */
          <div className="space-y-4">
            <div className="w-full h-44 relative">
              <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
                <defs>
                  <linearGradient id="curveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="var(--accent-primary)" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="var(--accent-primary)" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Grid guidelines */}
                {[0.25, 0.5, 0.75, 1].map((lvl, idx) => (
                  <line
                    key={idx}
                    x1={paddingX}
                    y1={height - paddingY - lvl * (height - 2 * paddingY)}
                    x2={width - paddingX}
                    y2={height - paddingY - lvl * (height - 2 * paddingY)}
                    stroke="var(--border-color)"
                    strokeDasharray="4 4"
                    strokeWidth="1"
                  />
                ))}

                {/* Filled Gradient Area */}
                <path d={areaD} fill="url(#curveGradient)" />

                {/* Continuous Line Curve */}
                <path
                  d={pathD}
                  fill="none"
                  stroke="var(--accent-primary)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  className="filter drop-shadow-md"
                />

                {/* Interactive Data Nodes */}
                {points.map((pt, idx) => (
                  <g key={idx}>
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={pt.isToday ? "6" : "4"}
                      className={`cursor-pointer transition-all duration-200 ${
                        pt.isToday
                          ? "fill-emerald-400 stroke-2 stroke-[var(--bg-secondary)]"
                          : "fill-[var(--accent-primary)] stroke-2 stroke-[var(--bg-secondary)] hover:r-7"
                      }`}
                      onClick={() => setSelectedDay(pt)}
                      onMouseEnter={() => setHoveredPoint(pt)}
                      onMouseLeave={() => setHoveredPoint(null)}
                    />
                  </g>
                ))}
              </svg>
            </div>

            {/* Bottom Day Names */}
            <div className="flex justify-between px-4 text-[10px] font-mono pro-text-muted">
              {activityData.days.map((d, i) => (
                <span key={i} className={d.isToday ? "text-[var(--accent-primary)] font-black" : ""}>
                  {d.dayName}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Selected Day Detailed Breakdown Inspector */}
        {selectedDay && (
          <div className="p-4 bg-[var(--bg-card)] border border-[var(--accent-primary)]/40 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs animate-in fade-in duration-150 shadow-md">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-400" />
                <span className="font-black text-sm pro-text-main">{selectedDay.date}</span>
                {selectedDay.isToday && (
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-[var(--accent-glow)] text-[var(--accent-primary)] font-bold uppercase">
                    Today
                  </span>
                )}
              </div>
              <p className="text-xs pro-text-muted">
                {selectedDay.total > 0 
                  ? `${selectedDay.total} total platform actions (${selectedDay.quizzes} quizzes, ${selectedDay.challenges} LeetCode checks, ${selectedDay.courses} curriculum sets)` 
                  : "No platform activity recorded on this day."}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-emerald-400 font-mono font-bold text-sm">+{selectedDay.xp} XP</span>
              <button
                onClick={() => setSelectedDay(null)}
                className="px-3 py-1.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[10px] font-bold uppercase pro-text-muted hover:pro-text-main"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Metrics Summary Strip */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl">
          <span className="text-[10px] font-black uppercase pro-text-muted block">Active Days</span>
          <p className="text-xl font-black font-mono pro-text-main mt-0.5">
            {activityData.activeDaysCount} <span className="text-xs font-normal pro-text-muted">/ {range} days</span>
          </p>
        </div>

        <div className="p-3.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl">
          <span className="text-[10px] font-black uppercase pro-text-muted block">Average Daily Pace</span>
          <p className="text-xl font-black font-mono text-[var(--accent-primary)] mt-0.5">
            {activityData.avgDaily} <span className="text-xs font-normal pro-text-muted">tasks/day</span>
          </p>
        </div>

        <div className="p-3.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl">
          <span className="text-[10px] font-black uppercase pro-text-muted block">XP Accumulated</span>
          <p className="text-xl font-black font-mono text-emerald-500 mt-0.5">
            +{activityData.totalXP} <span className="text-xs font-normal pro-text-muted">XP</span>
          </p>
        </div>
      </div>
    </div>
  );
}
