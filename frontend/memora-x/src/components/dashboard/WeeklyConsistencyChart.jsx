import React, { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Flame, Trophy } from "lucide-react";

const WeeklyConsistencyChart = ({ data }) => {
  const [currentMonthDate, setCurrentMonthDate] = useState(() => {
    const d = new Date();
    d.setDate(1); 
    d.setHours(0, 0, 0, 0);
    return d;
  });

  const nextMonth = () => {
    setCurrentMonthDate((prev) => {
      const d = new Date(prev);
      d.setMonth(d.getMonth() + 1);
      return d;
    });
  };

  const prevMonth = () => {
    setCurrentMonthDate((prev) => {
      const d = new Date(prev);
      d.setMonth(d.getMonth() - 1);
      return d;
    });
  };

  const { streaks, calendarDays, weeks } = useMemo(() => {
    const dailyStatsMap = {};

    (data || []).forEach((d) => {
      let q = 0;
      if (typeof d.quizQuestionsAttempted === "number") q = d.quizQuestionsAttempted;
      else if (d.quizzes && typeof d.quizzes.length === "number") q = d.quizzes.length;
      else if (typeof d.quizzes === "number") q = d.quizzes;
      else if (typeof d.sessions === "number") q = d.sessions;

      let f = 0;
      if (typeof d.flashcardsReviewed === "number") f = d.flashcardsReviewed;
      else if (typeof d.flashcardsReviewedCount === "number") f = d.flashcardsReviewedCount;
      else if (typeof d.flashcards === "number") f = d.flashcards;

      const total = q + f;

      let parsed = null;
      if (d.date) parsed = new Date(d.date);
      else if (d.timestamp || d.createdAt) parsed = new Date(d.timestamp || d.createdAt);
      else if (d.day) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const targetDay = daysOfWeek.indexOf(d.day);
        if (targetDay !== -1) {
          const currentDay = today.getDay();
          const diff = targetDay - currentDay;
          parsed = new Date(today);
          parsed.setDate(today.getDate() + diff);
        }
      }

      if (parsed && !isNaN(parsed.getTime())) {
        parsed.setHours(0, 0, 0, 0);
        const ms = parsed.getTime();
        if (!dailyStatsMap[ms]) {
          dailyStatsMap[ms] = { quizzes: 0, flashcards: 0, total: 0 };
        }
        dailyStatsMap[ms].quizzes += q;
        dailyStatsMap[ms].flashcards += f;
        dailyStatsMap[ms].total += total;
      }
    });

    const activeDatesMs = Object.keys(dailyStatsMap)
      .map(Number)
      .filter((ms) => dailyStatsMap[ms].total > 0)
      .sort((a, b) => a - b);

    let best = 1;
    let current = 1;
    for (let i = 1; i < activeDatesMs.length; i++) {
      const diffDays = Math.round((activeDatesMs[i] - activeDatesMs[i - 1]) / 86400000);
      if (diffDays === 1) {
        current++;
        if (current > best) best = current;
      } else if (diffDays > 1) {
        current = 1;
      }
    }
    if (activeDatesMs.length === 0) best = 0;

    let runningCurrent = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTime = today.getTime();

    if (activeDatesMs.length > 0) {
      const lastDate = activeDatesMs[activeDatesMs.length - 1];
      const daysDiffFromToday = Math.round((todayTime - lastDate) / 86400000);

      if (daysDiffFromToday === 0 || daysDiffFromToday === 1) {
        let streak = 1;
        for (let i = activeDatesMs.length - 1; i > 0; i--) {
          const diffDays = Math.round((activeDatesMs[i] - activeDatesMs[i - 1]) / 86400000);
          if (diffDays === 1) {
            streak++;
          } else if (diffDays > 1) {
            break;
          }
        }
        runningCurrent = streak;
      }
    }

    if (runningCurrent > best) best = runningCurrent;

    const year = currentMonthDate.getFullYear();
    const month = currentMonthDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - startDate.getDay());

    const endDate = new Date(lastDay);
    if (endDate.getDay() !== 6) {
      endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));
    }

    const days = [];
    let curr = new Date(startDate);
    while (curr <= endDate) {
      days.push(new Date(curr));
      curr.setDate(curr.getDate() + 1);
    }

    const mappedDays = days.map((dayTime) => {
      dayTime.setHours(0, 0, 0, 0);
      const ms = dayTime.getTime();
      return {
        date: new Date(ms),
        isCurrentMonth: dayTime.getMonth() === month,
        stats: dailyStatsMap[ms] || { quizzes: 0, flashcards: 0, total: 0 },
      };
    });

    const weeks = [];
    for (let i = 0; i < mappedDays.length; i += 7) {
      weeks.push(mappedDays.slice(i, i + 7));
    }

    return {
      streaks: { current: runningCurrent, best },
      calendarDays: mappedDays,
      weeks,
    };
  }, [data, currentMonthDate]);

  return (
    <div className="flex flex-col h-full w-full select-none overflow-visible">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center bg-neutral-800 rounded-lg p-0.5 border border-neutral-700/50">
          <button
            onClick={prevMonth}
            className="p-1 hover:bg-neutral-700 text-neutral-400 hover:text-white rounded-md transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm font-medium text-white px-3 min-w-[100px] text-center tracking-wide">
            {currentMonthDate.toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </span>
          <button
            onClick={nextMonth}
            className="p-1 hover:bg-neutral-700 text-neutral-400 hover:text-white rounded-md transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-2 text-xs">
            <span className="hidden sm:flex text-neutral-400 items-center gap-1 font-medium">
              <Flame className="w-3.5 h-3.5 text-orange-500" /> Current Streak
            </span>
            <span className="font-bold text-white tracking-wide">
              {streaks.current} <span className="text-neutral-500 font-medium text-[10px] sm:text-xs">days</span>
            </span>
          </div>

          <div className="hidden sm:block w-px h-6 bg-neutral-800"></div>

          <div className="flex items-center gap-2 text-xs">
            <span className="hidden sm:flex text-neutral-400 items-center gap-1 font-medium">
              <Trophy className="w-3.5 h-3.5 text-yellow-500" /> Best Streak
            </span>
            <span className="font-bold text-white tracking-wide">
              {streaks.best} <span className="text-neutral-500 font-medium text-[10px] sm:text-xs">days</span>
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center w-full py-2 overflow-visible">
        <div className="grid grid-cols-[1.5rem_1fr] sm:grid-cols-[2rem_1fr] gap-2 sm:gap-3 w-full h-full min-h-[160px] sm:min-h-[200px] items-stretch pb-2">
          <div className="flex flex-col justify-between text-[10px] sm:text-xs text-neutral-500 font-semibold text-right h-full">
            <div className="flex-1 flex items-center justify-end pr-1">Sun</div>
            <div className="flex-1 flex items-center justify-end pr-1">Mon</div>
            <div className="flex-1 flex items-center justify-end pr-1">Tue</div>
            <div className="flex-1 flex items-center justify-end pr-1">Wed</div>
            <div className="flex-1 flex items-center justify-end pr-1">Thu</div>
            <div className="flex-1 flex items-center justify-end pr-1">Fri</div>
            <div className="flex-1 flex items-center justify-end pr-1">Sat</div>
          </div>

          <div className="flex gap-1.5 sm:gap-2 justify-between w-full h-full">
            {weeks.map((week, wIndex) => (
              <div key={wIndex} className="flex flex-col gap-1.5 sm:gap-2 flex-1 h-full">
                {week.map((dayData, i) => {
                  const score = dayData.stats.total;
                  const isCurrentMonth = dayData.isCurrentMonth;
                  let bgClass = "bg-neutral-800/30";

                  if (isCurrentMonth) {
                    if (score === 0) bgClass = "bg-neutral-800";
                    else if (score < 2) bgClass = "bg-blue-500";
                    else if (score < 4) bgClass = "bg-blue-600";
                    else bgClass = "bg-blue-700";
                  }

                  return (
                    <div key={i} className="relative group flex-1 w-full h-full">
                      <div
                        className={`w-full h-full min-h-[16px] rounded-[3px] sm:rounded-md transition-all duration-200 cursor-crosshair
                          ${bgClass} 
                          ${isCurrentMonth && score > 0 ? "hover:scale-[1.08] hover:ring-2 hover:ring-white/20 hover:z-10 relative z-20" : ""} 
                          ${isCurrentMonth && score === 0 ? "hover:bg-neutral-700/50 relative z-20" : ""}`}
                      />

                      {isCurrentMonth && (
                        <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-200 bottom-full mb-2.5 left-1/2 -translate-x-1/2 p-3 bg-[#1f1f1f] border border-[#404040] rounded-xl w-max z-[999] pointer-events-none shadow-xl">
                          <div className="font-bold text-white mb-2 text-sm tracking-wide">
                            {dayData.date.toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </div>
                          <div className="space-y-1.5 text-xs">
                            <div className="flex justify-between items-center gap-6 text-neutral-400">
                              <span>Flashcards:</span>
                              <span className="text-white font-medium">{dayData.stats.flashcards}</span>
                            </div>
                            <div className="flex justify-between items-center gap-6 text-neutral-400">
                              <span>Quizzes:</span>
                              <span className="text-white font-medium">{dayData.stats.quizzes}</span>
                            </div>
                            <div className="border-t border-[#404040] mt-2 pt-2 flex justify-between items-center gap-6 text-neutral-300 font-bold">
                              <span>Total:</span>
                              <span className="text-white">{dayData.stats.total}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeeklyConsistencyChart;