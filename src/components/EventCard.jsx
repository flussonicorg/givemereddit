import Link from "next/link";

export default function EventCard({ event }) {
  const hasTeams = event.strHomeTeam && event.strAwayTeam;
  const isLive = event.live_status === 1;

  return (
    <div className="group flex flex-col rounded-xl border border-[#d9dde4] bg-white px-4 py-3 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md sm:flex-row sm:items-center sm:gap-4">
      {/* Time & Mobile League */}
      <div className="mb-2 flex w-full shrink-0 flex-row items-center justify-between border-[#d9dde4] sm:mb-0 sm:w-[86px] sm:flex-col sm:border-r sm:pr-3 sm:text-center">
        <div className="flex items-center gap-2">
          <b className="block text-[14px] font-bold text-[#15171a]">{event.event_time}</b>
          <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-black uppercase text-[#111827] sm:hidden">
            {event.sch_league}
          </span>
        </div>
        <span className="block text-[11px] uppercase text-[#667085] sm:mt-1">{event.category}</span>
      </div>

      {/* Desktop League */}
      <div className="hidden w-[80px] shrink-0 items-center justify-center border-r border-[#d9dde4] pr-3 sm:flex">
        <span className="text-center text-[11px] font-black uppercase text-[#111827]">
          {event.sch_league}
        </span>
      </div>

      {/* Matchup */}
      <div className="mb-3 flex-1 sm:mb-0">
        {hasTeams ? (
          <div className="flex flex-col gap-2 sm:grid sm:grid-cols-[1fr_40px_1fr] sm:items-center sm:gap-3">
            {/* Home */}
            <div className="flex items-center gap-2.5 sm:justify-end">
              <span className="truncate text-[15px] font-extrabold text-[#15171a] sm:text-right">{event.strHomeTeam}</span>
              {event.sch_home_logo && (
                <img
                  src={event.sch_home_logo}
                  alt={event.strHomeTeam}
                  className="h-6 w-6 shrink-0 object-contain transition-transform group-hover:scale-110"
                />
              )}
            </div>
            {/* VS */}
            <div className="hidden text-center text-[11px] font-black text-[#667085] sm:block">VS</div>
            {/* Away */}
            <div className="flex items-center gap-2.5">
              {event.sch_away_logo && (
                <img
                  src={event.sch_away_logo}
                  alt={event.strAwayTeam}
                  className="h-6 w-6 shrink-0 object-contain transition-transform group-hover:scale-110"
                />
              )}
              <span className="truncate text-[15px] font-extrabold text-[#15171a]">{event.strAwayTeam}</span>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2.5">
            {event.sch_home_logo && (
              <img
                src={event.sch_home_logo}
                alt=""
                className="h-6 w-6 shrink-0 object-contain transition-transform group-hover:scale-110"
              />
            )}
            <p className="text-[15px] font-extrabold text-[#15171a]">{event.teams}</p>
            {event.sch_away_logo && (
              <img
                src={event.sch_away_logo}
                alt=""
                className="h-6 w-6 shrink-0 object-contain transition-transform group-hover:scale-110"
              />
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex w-full shrink-0 items-center justify-between gap-2 sm:w-[120px] sm:justify-end">
        {isLive ? (
          <span className="inline-flex min-h-[28px] items-center justify-center gap-1.5 rounded border border-red-200 bg-red-50 px-2 text-[12px] font-black text-red-600">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-600" />
            LIVE
          </span>
        ) : (
          <span className="inline-flex min-h-[28px] items-center justify-center rounded border border-slate-200 bg-slate-100 px-2 text-[12px] font-black tracking-wide text-slate-500">
            UPCOMING
          </span>
        )}
        <Link
          href={`/watch/${event.sch_id}`}
          className="flex h-[32px] items-center justify-center rounded bg-[#d71920] px-4 text-[13px] font-black text-white transition-colors hover:bg-[#b9151b] sm:w-auto"
        >
          Watch
        </Link>
      </div>
    </div>
  );
}
