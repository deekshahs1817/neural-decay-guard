import { useState, useMemo, useRef, useEffect } from "react";
import { Info, ChevronDown, Check, Sparkles, Calendar } from "lucide-react";

export default function LeetCodeHeatmap({ dailyActivityMap = {}, streak = 0 }) {
  const [selectedYear, setSelectedYear] = useState("Current");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [hoveredDay, setHoveredDay] = useState(null);
  const [selectedDayDetail, setSelectedDayDetail] = useState(null);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const availableYears = ["Current", "2026", "2025", "2024"];

  // Heatmap generation based on selectedYear
  const heatmapData = useMemo(() => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonthIdx = today.getMonth();
    const monthNames = ["Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"];
    const allMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const months = [];
    let calculatedTotalSubmissions = 0;
    let calculatedActiveDays = 0;

    const calculateRangeMaxStreak = (activeDateSet) => {
      if (activeDateSet.size === 0) return 0;
      const sortedDates = Array.from(activeDateSet).sort();
      let maxS = 1;
      let currentS = 1;

      for (let i = 1; i < sortedDates.length; i++) {
        const prev = new Date(sortedDates[i - 1]);
        const curr = new Date(sortedDates[i]);
        const diffDays = Math.round((curr - prev) / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          currentS += 1;
          if (currentS > maxS) maxS = currentS;
        } else if (diffDays > 1) {
          currentS = 1;
        }
      }
      return maxS;
    };

    const activeDatesInScope = new Set();

    if (selectedYear === "Current") {
      // Rolling 12 months going backwards from current month
      for (let m = 11; m >= 0; m--) {
        const monthDate = new Date(currentYear, currentMonthIdx - m, 1);
        const mIdx = monthDate.getMonth();
        const yr = monthDate.getFullYear();
        const mName = allMonths[mIdx];

        const daysInMonth = new Date(yr, mIdx + 1, 0).getDate();
        const firstDayOfWeek = new Date(yr, mIdx, 1).getDay(); // 0 = Sun

        const monthDays = [];
        for (let p = 0; p < firstDayOfWeek; p++) {
          monthDays.push({ isPad: true });
        }

        for (let d = 1; d <= daysInMonth; d++) {
          const dateObj = new Date(yr, mIdx, d);
          const dateStr = `${yr}-${String(mIdx + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
          const isFuture = dateObj > today;

          const count = !isFuture ? (dailyActivityMap[dateStr] || 0) : 0;
          if (count > 0) {
            calculatedTotalSubmissions += count;
            calculatedActiveDays += 1;
            activeDatesInScope.add(dateStr);
          }

          monthDays.push({
            date: dateStr,
            day: d,
            monthName: mName,
            year: yr,
            count,
            isFuture,
            isPad: false
          });
        }

        const weeks = [];
        for (let i = 0; i < monthDays.length; i += 7) {
          weeks.push(monthDays.slice(i, i + 7));
        }

        months.push({ monthName: mName, year: yr, weeks });
      }
    } else {
      const yr = parseInt(selectedYear, 10);
      for (let mIdx = 0; mIdx < 12; mIdx++) {
        const mName = allMonths[mIdx];
        const daysInMonth = new Date(yr, mIdx + 1, 0).getDate();
        const firstDayOfWeek = new Date(yr, mIdx, 1).getDay();

        const monthDays = [];
        for (let p = 0; p < firstDayOfWeek; p++) {
          monthDays.push({ isPad: true });
        }

        for (let d = 1; d <= daysInMonth; d++) {
          const dateObj = new Date(yr, mIdx, d);
          const dateStr = `${yr}-${String(mIdx + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
          const isFuture = dateObj > today;

          const count = !isFuture ? (dailyActivityMap[dateStr] || 0) : 0;
          if (count > 0) {
            calculatedTotalSubmissions += count;
            calculatedActiveDays += 1;
            activeDatesInScope.add(dateStr);
          }

          monthDays.push({
            date: dateStr,
            day: d,
            monthName: mName,
            year: yr,
            count,
            isFuture,
            isPad: false
          });
        }

        const weeks = [];
        for (let i = 0; i < monthDays.length; i += 7) {
          weeks.push(monthDays.slice(i, i + 7));
        }

        months.push({ monthName: mName, year: yr, weeks });
      }
    }

    const calculatedMaxStreak = calculateRangeMaxStreak(activeDatesInScope);

    return {
      months,
      totalSubmissions: calculatedTotalSubmissions,
      activeDays: calculatedActiveDays,
      maxStreak: calculatedMaxStreak || (calculatedActiveDays > 0 ? 1 : 0)
    };
  }, [dailyActivityMap, selectedYear]);

  // Professional theme-adaptive cell color grading
  const getCellColor = (count, isFuture, isPad) => {
    if (isPad) return "opacity-0 pointer-events-none";
    if (isFuture) return "bg-slate-100 dark:bg-neutral-800/30 opacity-20 cursor-not-allowed";
    if (count === 0) {
      return "bg-slate-200/70 hover:bg-slate-300 dark:bg-[#242424] dark:hover:bg-[#333333] border border-slate-300/40 dark:border-transparent";
    }
    if (count <= 2) {
      return "bg-emerald-600/60 dark:bg-[#0e4429] hover:bg-emerald-600 border border-emerald-600/30";
    }
    if (count <= 4) {
      return "bg-emerald-600 dark:bg-[#006d32] hover:bg-emerald-500 border border-emerald-500/40";
    }
    if (count <= 6) {
      return "bg-emerald-500 dark:bg-[#26a641] hover:bg-emerald-400 border border-emerald-400/50 shadow-xs";
    }
    return "bg-emerald-400 dark:bg-[#39d353] shadow-[0_0_8px_rgba(52,211,153,0.6)] border border-emerald-300";
  };

  return (
    <div className="glass-panel p-6 border-[var(--border-color)] bg-[var(--bg-card)] rounded-3xl shadow-sm space-y-6 relative select-none">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-4">
        {/* Left: Total Submissions & Info */}
        <div className="flex items-center gap-2.5 relative">
          <span className="text-2xl md:text-3xl font-black pro-text-main font-mono">
            {heatmapData.totalSubmissions}
          </span>
          <span className="text-xs sm:text-sm font-semibold pro-text-muted">
            {selectedYear === "Current" ? "submissions in the past one year" : `submissions in ${selectedYear}`}
          </span>
          
          <div className="relative">
            <button
              onClick={() => setShowInfo(!showInfo)}
              className="p-1 pro-text-muted hover:pro-text-main transition rounded-full"
              title="Click for telemetry calculation info"
            >
              <Info size={15} />
            </button>

            {showInfo && (
              <div className="absolute left-0 mt-2 w-72 p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150 space-y-2">
                <div className="flex justify-between items-center pb-1.5 border-b border-[var(--border-color)]">
                  <span className="font-black pro-text-main uppercase text-[10px] tracking-wider flex items-center gap-1.5">
                    <Sparkles size={12} className="text-emerald-500" /> Activity Verification
                  </span>
                  <button 
                    onClick={() => setShowInfo(false)}
                    className="text-[10px] pro-text-muted hover:pro-text-main font-bold"
                  >
                    ✕
                  </button>
                </div>
                <p className="leading-relaxed text-xs pro-text-muted font-medium">
                  Aggregates all algorithmic solutions, daily challenges, spaced repetition quizzes, and CSE Core Academy set completions synced with your MongoDB identity.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Stats & Functional Year Selector Dropdown */}
        <div className="flex flex-wrap items-center gap-5 text-xs font-mono">
          <div className="flex items-center gap-1.5 pro-text-muted font-medium">
            <span>Total active days:</span>
            <span className="pro-text-main font-black font-mono text-sm">{heatmapData.activeDays}</span>
          </div>

          <div className="flex items-center gap-1.5 pro-text-muted font-medium">
            <span>Max streak:</span>
            <span className="pro-text-main font-black font-mono text-sm">{heatmapData.maxStreak}</span>
          </div>

          {/* Year Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[var(--bg-secondary)] hover:bg-[var(--bg-card)] border border-[var(--border-color)] pro-text-main text-xs font-bold transition shadow-xs cursor-pointer active:scale-95"
            >
              <span>{selectedYear}</span>
              <ChevronDown size={14} className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-36 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl shadow-2xl z-50 p-1.5 animate-in fade-in zoom-in-95 duration-100 space-y-1">
                {availableYears.map(yr => (
                  <button
                    key={yr}
                    onClick={() => {
                      setSelectedYear(yr);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition ${
                      selectedYear === yr
                        ? "bg-emerald-500/10 text-emerald-500 font-black"
                        : "pro-text-muted hover:bg-[var(--bg-secondary)] hover:pro-text-main"
                    }`}
                  >
                    <span>{yr}</span>
                    {selectedYear === yr && <Check size={13} className="text-emerald-500 stroke-[3]" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 12-Month Matrix Container */}
      <div className="overflow-x-auto custom-scrollbar pb-3">
        <div className="flex gap-3.5 min-w-[850px] justify-between">
          {heatmapData.months.map((mObj, mIdx) => (
            <div key={mIdx} className="flex flex-col items-center gap-2 flex-1">
              {/* Weeks Grid for this month */}
              <div className="flex gap-1">
                {mObj.weeks.map((week, wIdx) => (
                  <div key={wIdx} className="flex flex-col gap-1">
                    {week.map((cell, cIdx) => (
                      <div
                        key={cIdx}
                        onClick={() => {
                          if (!cell.isPad && !cell.isFuture) {
                            setSelectedDayDetail(cell);
                          }
                        }}
                        onMouseEnter={(e) => {
                          if (!cell.isPad && !cell.isFuture) {
                            setHoveredDay({
                              date: cell.date,
                              count: cell.count,
                              x: e.clientX,
                              y: e.clientY
                            });
                          }
                        }}
                        onMouseLeave={() => setHoveredDay(null)}
                        className={`w-3.5 h-3.5 rounded-[3px] transition-all cursor-pointer ${getCellColor(
                          cell.count,
                          cell.isFuture,
                          cell.isPad
                        )} ${selectedDayDetail?.date === cell.date ? 'ring-2 ring-emerald-500' : ''}`}
                      />
                    ))}
                  </div>
                ))}
              </div>

              {/* Month Label */}
              <span className="text-[11px] font-mono pro-text-muted font-bold tracking-tight">
                {mObj.monthName}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Hover Floating Tooltip */}
      {hoveredDay && !selectedDayDetail && (
        <div 
          className="fixed z-50 px-3.5 py-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] pro-text-main text-xs font-mono pointer-events-none shadow-2xl animate-in fade-in zoom-in-95 duration-100"
          style={{ 
            left: `${hoveredDay.x - 60}px`, 
            top: `${hoveredDay.y - 50}px` 
          }}
        >
          <span className="font-bold text-emerald-500">{hoveredDay.count} submissions</span> on {hoveredDay.date}
        </div>
      )}

      {/* Selected Day Detail Box */}
      {selectedDayDetail && (
        <div className="p-4 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl flex items-center justify-between text-xs animate-in fade-in duration-150">
          <div className="flex items-center gap-3">
            <Calendar size={18} className="text-emerald-500" />
            <div>
              <span className="font-black pro-text-main">{selectedDayDetail.date}</span>
              <p className="pro-text-muted text-[11px] font-medium">
                {selectedDayDetail.count > 0 ? `${selectedDayDetail.count} verified submissions recorded` : "No activity recorded on this date."}
              </p>
            </div>
          </div>
          <button 
            onClick={() => setSelectedDayDetail(null)}
            className="pro-text-muted hover:pro-text-main text-[11px] font-bold uppercase"
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
}
