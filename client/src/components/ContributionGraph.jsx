import React from 'react';

// Color scale mapping for 5 contribution levels using brown and yellow
const LEVEL_COLORS = {
  0: 'bg-stone-800 border border-stone-700/50', // Empty day
  1: 'bg-amber-900',                             // Low contribution
  2: 'bg-amber-700',                             // Medium-low
  3: 'bg-amber-600',                             // Medium-high
  4: 'bg-amber-500 shadow-sm shadow-amber-500/50' // High contribution
};

const MONTHS = [
  { name: 'Aug', colStart: 1 },
  { name: 'Sep', colStart: 5 },
  { name: 'Oct', colStart: 9 },
  { name: 'Nov', colStart: 14 },
  { name: 'Dec', colStart: 18 },
  { name: 'Jan', colStart: 23 },
  { name: 'Feb', colStart: 27 },
  { name: 'Mar', colStart: 31 },
  { name: 'Apr', colStart: 36 },
  { name: 'May', colStart: 40 },
  { name: 'Jun', colStart: 44 },
  { name: 'Jul', colStart: 48 },
  { name: 'Aug', colStart: 52 },
];

export default function ContributionGraph({ data = [] }) {
  // Generate sample 53 weeks x 7 days grid if no data passed
  const gridData = React.useMemo(() => {
    if (data.length > 0) return data;
    return Array.from({ length: 53 * 7 }, (_, i) => {
      // Dummy distribution pattern
      const rand = Math.random();
      let level = 0;
      if (rand > 0.85) level = 4;
      else if (rand > 0.70) level = 3;
      else if (rand > 0.55) level = 2;
      else if (rand > 0.40) level = 1;
      return { id: i, level };
    });
  }, [data]);

  return (
    <div className="w-full bg-stone-900/90 text-stone-200 p-6 rounded-xl border border-stone-800 shadow-xl">
      {/* Header Stats */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm text-stone-400 font-medium">Monthly Restocked Supply</p>
          <p className="text-lg font-bold text-amber-400">142.5 kg</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-stone-400">Goal: 180 kg</p>
        </div>
      </div>

      {/* Goal Progress Bar */}
      <div className="w-full bg-stone-800 h-2 rounded-full mb-6 overflow-hidden">
        <div 
          className="bg-amber-500 h-full rounded-full transition-all duration-500" 
          style={{ width: `${(142.5 / 180) * 100}%` }}
        />
      </div>

      {/* Main Heatmap Area */}
      <div className="flex gap-3 items-start overflow-x-auto pb-2">
        {/* Day Labels Column */}
        <div className="flex flex-col justify-between h-[84px] pt-5 text-[11px] font-medium text-stone-400 select-none">
          <span>Mon</span>
          <span>Wed</span>
          <span>Fri</span>
        </div>

        {/* Calendar Grid Container */}
        <div className="flex flex-col gap-2 min-w-max">
          {/* Aligned Month Labels */}
          <div className="grid grid-cols-[repeat(53,minmax(10px,1fr))] gap-[3px] h-4 text-[11px] text-stone-400 font-medium">
            {MONTHS.map((m, index) => (
              <span
                key={index}
                className="col-span-4 text-left"
                style={{ gridColumnStart: m.colStart }}
              >
                {m.name}
              </span>
            ))}
          </div>

          {/* 7 Rows x 53 Columns Days Grid */}
          <div className="grid grid-rows-7 grid-flow-col gap-[3px]">
            {gridData.map((day, idx) => (
              <div
                key={day.id || idx}
                className={`w-[10px] h-[10px] rounded-[2px] transition-colors ${LEVEL_COLORS[day.level] || LEVEL_COLORS[0]}`}
                title={`Level ${day.level}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Footer Legend */}
      <div className="flex items-center justify-between mt-4 text-xs text-stone-400 pt-3 border-t border-stone-800">
        <span className="hover:underline cursor-pointer text-stone-400">
          Learn how restock telemetry is tracked
        </span>
        <div className="flex items-center gap-1.5">
          <span>Less</span>
          {[0, 1, 2, 3, 4].map((level) => (
            <div
              key={level}
              className={`w-[10px] h-[10px] rounded-[2px] ${LEVEL_COLORS[level]}`}
            />
          ))}
          <span>More</span>
        </div>
      </div>
    </div>
  );
}