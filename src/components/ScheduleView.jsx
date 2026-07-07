"use client";

import { useMemo, useState } from "react";
import SportFilter from "./SportFilter";
import EventCard from "./EventCard";

export default function ScheduleView({ sports, scheduleDays }) {
  const [activeSportId, setActiveSportId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDays = useMemo(() => {
    return scheduleDays
      .map((day) => ({
        ...day,
        schedule: (day.schedule || [])
          .filter((block) => activeSportId === null || block.sport_id === activeSportId)
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

  return (
    <div className="space-y-6">
      {/* Centered Searchbar under header */}
      <div className="mx-auto max-w-2xl">
        <div className="relative flex items-center">
          <svg
            className="absolute left-4 h-5 w-5 text-gray-400"
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
            placeholder="Search team, league, channel or event..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-[52px] w-full rounded-full border border-gray-300 bg-white pl-12 pr-4 text-[15px] shadow-sm outline-none transition-all focus:border-[#111827] focus:ring-2 focus:ring-[#111827]/20"
          />
        </div>
      </div>

      {/* All Sports Categories */}
      <div className="w-full">
        <SportFilter
          sports={sports}
          activeSportId={activeSportId}
          onSelect={setActiveSportId}
        />
      </div>

      <p className="text-sm text-zinc-500">
        {totalEvents} event{totalEvents !== 1 ? "s" : ""} scheduled
      </p>

      {filteredDays.length === 0 ? (
        <p className="rounded-xl border border-[#d9dde4] bg-white p-8 text-center text-[#667085]">
          No events for this sport right now.
        </p>
      ) : (
        filteredDays.map((day) => (
          <section key={day.date} className="mb-6 space-y-3">
            <div className="flex items-center justify-between gap-3 rounded-[5px] bg-[#111827] px-3.5 py-2.5 text-white">
              <h2 className="m-0 overflow-hidden text-ellipsis whitespace-nowrap text-[15px] uppercase tracking-[.04em]">
                {day.date}
              </h2>
            </div>
            <div className="flex flex-col gap-3">
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
