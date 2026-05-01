"use client";
import { useMemo } from "react";

/**
 * GitHub-style contribution heatmap.
 * Expects `activity` as an array of { date: "YYYY-MM-DD", count: number }.
 */
export default function ContributionMap({ activity = [] }) {
  const { weeks, monthLabels, maxCount, totalContributions } = useMemo(() => {
    // Build a map of date -> count
    const activityMap = {};
    let max = 0;
    let total = 0;
    activity.forEach(({ date, count }) => {
      activityMap[date] = (activityMap[date] || 0) + count;
      if (activityMap[date] > max) max = activityMap[date];
      total += count;
    });

    // Generate last 52 weeks (364 days) of cells
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0=Sun
    // Start from the Sunday 52 weeks ago
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - (52 * 7 + dayOfWeek));

    const weeksArr = [];
    const months = [];
    let currentDate = new Date(startDate);
    let lastMonth = -1;

    for (let w = 0; w < 53; w++) {
      const week = [];
      for (let d = 0; d < 7; d++) {
        const dateStr = currentDate.toISOString().split("T")[0];
        const isFuture = currentDate > today;
        week.push({
          date: dateStr,
          count: isFuture ? -1 : (activityMap[dateStr] || 0),
          isFuture,
        });

        // Track month labels on first row
        if (d === 0) {
          const month = currentDate.getMonth();
          if (month !== lastMonth) {
            months.push({ week: w, month: currentDate.toLocaleString("en-US", { month: "short" }) });
            lastMonth = month;
          }
        }

        currentDate.setDate(currentDate.getDate() + 1);
      }
      weeksArr.push(week);
    }

    return { weeks: weeksArr, monthLabels: months, maxCount: max, totalContributions: total };
  }, [activity]);

  const getColor = (count) => {
    if (count < 0) return "bg-transparent";
    if (count === 0) return "bg-white/[0.04] dark:bg-white/[0.04]";
    const ratio = maxCount > 0 ? count / maxCount : 0;
    if (ratio <= 0.25) return "bg-violet-900/60";
    if (ratio <= 0.5) return "bg-violet-700/70";
    if (ratio <= 0.75) return "bg-violet-500/80";
    return "bg-violet-400";
  };

  const dayLabels = ["", "Mon", "", "Wed", "", "Fri", ""];

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground">
          <span className="font-mono font-bold text-foreground">{totalContributions}</span> contributions in the last year
        </p>
      </div>

      {/* Grid */}
      <div className="overflow-x-auto">
        <div className="inline-flex flex-col gap-0">
          {/* Month labels */}
          <div className="flex ml-8 mb-1">
            {monthLabels.map((m, i) => (
              <div
                key={i}
                className="text-[10px] text-muted-foreground font-mono"
                style={{ position: "relative", left: `${m.week * 14}px` }}
              >
                {i === 0 || (monthLabels[i - 1] && m.week - monthLabels[i - 1].week >= 3)
                  ? m.month
                  : ""}
              </div>
            ))}
          </div>

          <div className="flex gap-0">
            {/* Day labels */}
            <div className="flex flex-col gap-[2px] mr-1 justify-start">
              {dayLabels.map((label, i) => (
                <div key={i} className="w-6 h-[11px] flex items-center justify-end pr-1">
                  <span className="text-[9px] text-muted-foreground font-mono">{label}</span>
                </div>
              ))}
            </div>

            {/* Week columns */}
            <div className="flex gap-[2px]">
              {weeks.map((week, wi) => (
                <div key={wi} className="flex flex-col gap-[2px]">
                  {week.map((day, di) => (
                    <div
                      key={di}
                      className={`w-[11px] h-[11px] rounded-[2px] ${getColor(day.count)} ${
                        !day.isFuture && day.count > 0 ? "ring-1 ring-violet-400/20" : ""
                      } transition-colors`}
                      title={day.isFuture ? "" : `${day.date}: ${day.count} contribution${day.count !== 1 ? "s" : ""}`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-end gap-1.5 mt-2">
            <span className="text-[10px] text-muted-foreground font-mono">Less</span>
            <div className="w-[11px] h-[11px] rounded-[2px] bg-white/[0.04]" />
            <div className="w-[11px] h-[11px] rounded-[2px] bg-violet-900/60" />
            <div className="w-[11px] h-[11px] rounded-[2px] bg-violet-700/70" />
            <div className="w-[11px] h-[11px] rounded-[2px] bg-violet-500/80" />
            <div className="w-[11px] h-[11px] rounded-[2px] bg-violet-400" />
            <span className="text-[10px] text-muted-foreground font-mono">More</span>
          </div>
        </div>
      </div>
    </div>
  );
}
