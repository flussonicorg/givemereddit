"use client";

import { useMemo, useState } from "react";
import SportFilter from "./SportFilter";
import EventCard from "./EventCard";

export default function ScheduleView({
  sports,
  scheduleDays,
  initialSportId = null,
}) {
  const [activeSportId, setActiveSportId] = useState(initialSportId);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDays = useMemo(() => {
    return scheduleDays
      .map((day) => ({
        ...day,
        schedule: (day.schedule || [])
          .filter(
            (block) =>
              activeSportId === null ||
              Number(block.sport_id) === Number(activeSportId) ||
              String(block.sport_id) === String(activeSportId)
          )
          .map((block) => ({
            ...block,
            league_schedule: (block.league_schedule || []).filter((e) => {
              if (e.status !== 1) return false;
              if (!searchQuery.trim()) return true;

              const query = searchQuery.toLowerCase();
              const teams = (e.teams || "").toLowerCase();
              const home = (e.strHomeTeam || "").toLowerCase();
              const away = (e.strAwayTeam || "").toLowerCase();
              const league = (e.league || "").toLowerCase();
              const schLeague = (e.sch_league || "").toLowerCase();

              return (
                teams.includes(query) ||
                home.includes(query) ||
                away.includes(query) ||
                league.includes(query) ||
                schLeague.includes(query)
              );
            }),
          }))
          .filter((block) => block.league_schedule.length > 0),
      }))
      .filter((day) => day.schedule.length > 0);
  }, [scheduleDays, activeSportId, searchQuery]);

  const totalEvents = useMemo(() => {
    let count = 0;
    for (const day of filteredDays) {
      for (const block of day.schedule || []) {
        count += (block.league_schedule || []).length;
      }
    }
    return count;
  }, [filteredDays]);

  const activeCategoryName = useMemo(() => {
    if (activeSportId === null) return "ALL SPORTS";
    const found = sports.find((s) => s.sport_id === activeSportId);
    return found ? found.sport_league_name.toUpperCase() : "SELECTED SPORT";
  }, [activeSportId, sports]);

  return (
    <div className="space-y-8">
      {/* Category Boxes Section */}
      <div className="w-full">
        <SportFilter
          sports={sports}
          activeSportId={activeSportId}
          onSelect={setActiveSportId}
        />
      </div>

      {/* Events Row List Header & Search */}
      <div className="rounded-2xl border border-slate-800/90 bg-[#111724] p-5 shadow-lg">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-black uppercase tracking-wide text-white">
              {activeCategoryName} MATCH SCHEDULE
            </h3>
            <p className="text-xs text-slate-400">
              Showing {totalEvents} event{totalEvents !== 1 ? "s" : ""} in list row format
            </p>
          </div>

          <div className="w-full sm:w-80">
            <div className="relative flex items-center">
              <svg
                className="absolute left-3.5 h-4 w-4 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search team or league..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 w-full rounded-xl border border-slate-700 bg-slate-900 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none transition-all focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Events List Rows */}
      {filteredDays.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-[#0c1222] p-10 text-center text-slate-400">
          No scheduled events found for {activeCategoryName}.
        </div>
      ) : (
        filteredDays.map((day) => (
          <section key={day.date} className="space-y-3">
            <div className="flex items-center justify-between rounded-xl border border-slate-800/80 bg-gradient-to-r from-[#0e172d] to-[#0a1122] px-4 py-3 text-white shadow">
              <h2 className="text-sm font-black uppercase tracking-wider text-cyan-400">
                📅 {day.date}
              </h2>
            </div>
            <div className="flex flex-col gap-2.5">
              {day.schedule.map((sportBlock) => (
                <div key={`${day.date}-${sportBlock.sport_id}`} className="contents">
                  {sportBlock.league_schedule.map((event) => (
                    <EventCard key={event.sch_id} event={event} />
                  ))}
                </div>
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
