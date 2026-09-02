import React, { useState, useMemo } from 'react';

const LEVEL_COLORS = {
  0: 'bg-stone-800 border border-stone-700/50',
  1: 'bg-amber-900',
  2: 'bg-amber-700',
  3: 'bg-amber-600',
  4: 'bg-amber-500 shadow-sm shadow-amber-500/50'
};

export default function ContributionGraph({ data = [] }) {
  const [selectedDay, setSelectedDay] = useState(null);

  // Generate sequential days starting from 53 weeks ago up to today
  const gridData = useMemo(() => {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - (53 * 7));
    
    // Align start date to Monday
    const dayOfWeek = startDate.getDay();
    const diffToMonday = startDate.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    startDate.setDate(diffToMonday);

    let days = [];
    let curr = new Date(startDate);

    for (let i = 0; i < 53 * 7; i++) {
      const dateString = curr.toISOString().split('T')[0];
      const matchedData = data.find(d => d.date === dateString);
      
      let level = matchedData ? matchedData.level : 0;
      let amount = matchedData ? matchedData.amount : 0;

      if (!matchedData && data.length === 0) {
        const rand = Math.random();
        if (rand > 0.88) level = 4;
        else if (rand > 0.75) level = 3;
        else if (rand > 0.60) level = 2;
        else if (rand > 0.45) level = 1;
        amount = level * 1.2;
      }

      days.push({
        id: i,
        date: new Date(curr),
        dateString,
        level,
        amount,
        formattedDate: curr.toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })
      });

      curr.setDate(curr.getDate() + 1);
    }
    return days;
  }, [data]);

  return (
    <div className="w-full bg-stone-900/90 text-stone-200 p-6 rounded-xl border border-stone-800 shadow-xl relative">
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
      <div className="flex flex-col gap-2">
        {/* Day of week headers */}
        <div className="grid grid-cols-7 gap-1 text-xs text-stone-400 font-medium pb-1 border-b border-stone-800 text-center">
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
          <span>Sun</span>
        </div>

        {/* Sequential 7-Column Grid (Flows row-by-row: Sep 1, Sep 2, Sep 3...) */}
        <div className="grid grid-cols-7 gap-1.5 max-h-[350px] overflow-y-auto pr-1">
          {gridData.map((day) => (
            <div
              key={day.id}
              onClick={() => setSelectedDay(day)}
              className={`h-8 rounded-[4px] flex items-center justify-center text-[10px] font-semibold transition-colors cursor-pointer hover:ring-1 hover:ring-amber-400 ${LEVEL_COLORS[day.level] || LEVEL_COLORS[0]}`}
              title={`${day.formattedDate}: ${day.amount} kg`}
            >
              {day.date.getDate()}
            </div>
          ))}
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
              className={`w-3 h-3 rounded-[2px] ${LEVEL_COLORS[level]}`}
            />
          ))}
          <span>More</span>
        </div>
      </div>

      {/* Modal Popup on Day Click */}
      {selectedDay && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 rounded-xl">
          <div className="bg-stone-900 border border-stone-700 p-5 rounded-xl shadow-2xl max-w-sm w-full text-stone-200">
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="text-xs text-amber-400 font-semibold uppercase tracking-wider">Restock Details</p>
                <p className="text-sm font-medium text-stone-300">{selectedDay.formattedDate}</p>
              </div>
              <button 
                onClick={() => setSelectedDay(null)}
                className="text-stone-400 hover:text-white bg-stone-800 rounded-full p-1 h-6 w-6 flex items-center justify-center"
              >
                ✕
              </button>
            </div>
            <div className="bg-stone-800/50 p-3 rounded-lg border border-stone-700/50 mb-4">
              <p className="text-xs text-stone-400">AMOUNT RESTOCKED</p>
              <p className="text-xl font-bold text-amber-400">{selectedDay.amount} kg</p>
            </div>
            <p className="text-xs text-stone-400">
              {selectedDay.level > 0 
                ? `Community volunteers replenished ${selectedDay.amount} kg of dry food on this date.` 
                : 'No community food restock was recorded on this date.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}