"use client";

export default function SportFilter({ sports, activeSportId, onSelect }) {
  return (
    <div className="relative">
      <div className="flex items-center gap-2.5 overflow-x-auto py-2 px-1 scrollbar-none snap-x">
        {/* All Sports Button */}
        <button
          type="button"
          onClick={() => onSelect(null)}
          className={`group flex h-[48px] shrink-0 items-center justify-center gap-2 rounded-2xl border px-5 text-[15px] font-extrabold whitespace-nowrap transition-all duration-200 snap-start ${
            activeSportId === null
              ? "border-transparent bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-md shadow-slate-900/20 scale-[1.02]"
              : "border-slate-200/80 bg-white text-slate-700 shadow-sm hover:border-slate-300 hover:bg-slate-50 hover:shadow hover:-translate-y-0.5"
          }`}
        >
          <span className="uppercase tracking-wide">ALL SPORTS</span>
        </button>

        {/* Category Buttons */}
        {sports.map((sport, index) => {
          const isActive = activeSportId === sport.sport_id;
          return (
            <button
              key={sport.id ?? `${sport.sport_id}-${index}`}
              type="button"
              onClick={() => onSelect(sport.sport_id)}
              className={`group flex h-[48px] shrink-0 items-center justify-center gap-2 rounded-2xl border px-4.5 text-[15px] font-extrabold whitespace-nowrap transition-all duration-200 snap-start ${
                isActive
                  ? "border-transparent bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-md shadow-slate-900/20 scale-[1.02]"
                  : "border-slate-200/80 bg-white text-slate-700 shadow-sm hover:border-slate-300 hover:bg-slate-50 hover:shadow hover:-translate-y-0.5"
              }`}
            >
              <span className="uppercase tracking-wide">{sport.sport_league_name}</span>
              {sport.events > 0 && (
                <span
                  className={`ml-0.5 flex items-center justify-center rounded-full px-2 py-0.5 text-[11px] font-black transition-colors ${
                    isActive
                      ? "bg-red-500 text-white shadow-sm"
                      : "bg-slate-100 text-slate-800 group-hover:bg-red-50 group-hover:text-red-600"
                  }`}
                >
                  {sport.events}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
