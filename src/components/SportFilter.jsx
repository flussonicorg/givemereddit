"use client";

import Link from "next/link";

export default function SportFilter({
  sports,
  activeSportId,
  onSelect,
  openInNewTab = false,
}) {
  const totalEvents = sports.reduce(
    (acc, s) => acc + (Number(s.events) || 0),
    0
  );

  const PillWrapper = ({ isAll, id, isActive, children }) => {
    const className = `inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-black uppercase tracking-wider transition-all duration-200 ${
      isActive
        ? "border-cyan-500 bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-[0_0_15px_rgba(6,182,212,0.3)] scale-[1.02]"
        : "border-slate-800 bg-[#0f172a] text-slate-300 hover:border-cyan-500/50 hover:bg-[#152038] hover:text-white"
    }`;

    if (openInNewTab) {
      return (
        <Link
          href={isAll ? "/category/all" : `/category/${id}`}
          target="_blank"
          rel="noopener noreferrer"
          className={className}
        >
          {children}
        </Link>
      );
    }

    return (
      <button
        type="button"
        onClick={() => onSelect && onSelect(isAll ? null : id)}
        className={className}
      >
        {children}
      </button>
    );
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-black uppercase tracking-wider text-slate-400">
          SELECT SPORT CATEGORY {openInNewTab && "(OPENS IN NEW TAB)"}
        </h2>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        {/* All Sports Pill */}
        <PillWrapper isAll={true} isActive={activeSportId === null}>
          <span>ALL SPORTS</span>
          <span className="rounded bg-black/30 px-1.5 py-0.5 text-[10px] font-bold text-cyan-300">
            {totalEvents}
          </span>
        </PillWrapper>

        {/* Category Pills */}
        {sports.map((sport, index) => {
          const isActive = activeSportId === sport.sport_id;
          return (
            <PillWrapper
              key={sport.id ?? `${sport.sport_id}-${index}`}
              isAll={false}
              id={sport.sport_id}
              isActive={isActive}
            >
              <span>{sport.sport_league_name}</span>
              <span className="rounded bg-black/30 px-1.5 py-0.5 text-[10px] font-bold text-cyan-300">
                {sport.events}
              </span>
            </PillWrapper>
          );
        })}
      </div>
    </div>
  );
}
