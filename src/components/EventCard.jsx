"use client";

import { useState } from "react";

export default function EventCard({ event }) {
  const [copiedTitle, setCopiedTitle] = useState(false);
  const [copiedEmbed, setCopiedEmbed] = useState(false);

  const hasTeams = event.strHomeTeam && event.strAwayTeam;
  const isLive = event.live_status === 1;

  const titleText =
    event.teams ||
    (hasTeams ? `${event.strHomeTeam} vs ${event.strAwayTeam}` : "Live Event");

  const primaryEmbedUrl =
    event.sch_iframe ||
    event.streams?.[0]?.stream_link ||
    (event.channel_id
      ? `https://embed.sportspatrika.com/live/embed.php?ch=${event.channel_id}`
      : "");

  const getIframeCode = (url) =>
    `<iframe src="${url}" width="100%" height="500" frameborder="0" allowfullscreen scrolling="no"></iframe>`;

  const copyTitle = () => {
    navigator.clipboard.writeText(titleText);
    setCopiedTitle(true);
  };

  const copyEmbed = (url = primaryEmbedUrl) => {
    if (!url) return;
    navigator.clipboard.writeText(getIframeCode(url));
    setCopiedEmbed(true);
  };

  return (
    <div className="group flex flex-col rounded-2xl border border-slate-800/90 bg-gradient-to-r from-[#0d1322] via-[#11182c] to-[#0d1322] p-4.5 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/50 hover:shadow-[0_0_25px_rgba(6,182,212,0.15)] sm:flex-row sm:items-center sm:gap-5 text-slate-100">
      {/* Time & Category Column */}
      <div className="mb-2.5 flex w-full shrink-0 flex-row items-center justify-between border-slate-800 sm:mb-0 sm:w-[105px] sm:flex-col sm:border-r sm:pr-4 sm:text-center">
        <div className="flex items-center gap-2">
          <b className="block text-[15px] font-black text-white tracking-tight">{event.event_time}</b>
          <span className="rounded-md bg-slate-800/90 px-1.5 py-0.5 text-[10px] font-black uppercase text-cyan-400 sm:hidden">
            {event.sch_league}
          </span>
        </div>
        <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 sm:mt-1.5">{event.category}</span>
      </div>

      {/* Desktop League */}
      <div className="hidden w-[110px] shrink-0 items-center justify-center border-r border-slate-800 pr-4 sm:flex">
        <span className="text-center text-[11px] font-black uppercase tracking-wider text-cyan-300/90">
          {event.sch_league}
        </span>
      </div>

      {/* Matchup Teams */}
      <div className="mb-3 flex-1 sm:mb-0">
        {hasTeams ? (
          <div className="flex flex-col gap-2 sm:grid sm:grid-cols-[1fr_36px_1fr] sm:items-center sm:gap-3">
            {/* Home Team */}
            <div className="flex items-center gap-3 sm:justify-end">
              <span className="truncate text-[15px] font-extrabold text-white sm:text-right">{event.strHomeTeam}</span>
              {event.sch_home_logo && (
                <img
                  src={event.sch_home_logo}
                  alt={event.strHomeTeam}
                  className="h-7 w-7 shrink-0 object-contain transition-transform group-hover:scale-110"
                />
              )}
            </div>
            {/* VS Badge */}
            <div className="hidden text-center text-[11px] font-black text-slate-500 sm:block">VS</div>
            {/* Away Team */}
            <div className="flex items-center gap-3">
              {event.sch_away_logo && (
                <img
                  src={event.sch_away_logo}
                  alt={event.strAwayTeam}
                  className="h-7 w-7 shrink-0 object-contain transition-transform group-hover:scale-110"
                />
              )}
              <span className="truncate text-[15px] font-extrabold text-white">{event.strAwayTeam}</span>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            {event.sch_home_logo && (
              <img
                src={event.sch_home_logo}
                alt=""
                className="h-7 w-7 shrink-0 object-contain transition-transform group-hover:scale-110"
              />
            )}
            <p className="text-[15px] font-extrabold text-white">{event.teams}</p>
            {event.sch_away_logo && (
              <img
                src={event.sch_away_logo}
                alt=""
                className="h-7 w-7 shrink-0 object-contain transition-transform group-hover:scale-110"
              />
            )}
          </div>
        )}
      </div>

      {/* Actions / Copy Buttons */}
      <div className="flex w-full shrink-0 flex-wrap items-center justify-between gap-2.5 sm:w-auto sm:justify-end">
        {isLive ? (
          <span className="inline-flex min-h-[30px] items-center justify-center gap-1.5 rounded-lg border border-red-500/40 bg-red-500/15 px-3 text-[11px] font-black uppercase tracking-wider text-red-400 shadow-[0_0_12px_rgba(239,68,68,0.25)]">
            <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
            LIVE NOW
          </span>
        ) : (
          <span className="inline-flex min-h-[30px] items-center justify-center rounded-lg border border-slate-700/80 bg-slate-800/90 px-3 text-[11px] font-black uppercase tracking-wider text-slate-400">
            UPCOMING
          </span>
        )}

        <div className="relative flex items-center gap-2">
          {/* Copy Title Button */}
          <button
            type="button"
            onClick={copyTitle}
            title="Copy Match Title"
            className={`flex h-[34px] items-center justify-center gap-1.5 rounded-xl border px-3.5 text-xs font-black uppercase tracking-wider transition-all duration-200 ${
              copiedTitle
                ? "border-emerald-500 bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.35)] scale-[1.02]"
                : "border-slate-700/90 bg-slate-800/90 text-slate-200 hover:border-cyan-500/60 hover:bg-slate-700 hover:text-white"
            }`}
          >
            {copiedTitle ? (
              <>
                <span className="text-sm">✓</span>
                <span>TITLE COPIED</span>
              </>
            ) : (
              <>
                <span>📋</span>
                <span>COPY TITLE</span>
              </>
            )}
          </button>

          {/* Copy Embed Button */}
          {primaryEmbedUrl && (
            <button
              type="button"
              onClick={() => copyEmbed(primaryEmbedUrl)}
              title="Copy Iframe Embed Code"
              className={`flex h-[34px] items-center justify-center gap-1.5 rounded-xl px-3.5 text-xs font-black uppercase tracking-wider transition-all duration-200 ${
                copiedEmbed
                  ? "border border-emerald-500 bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.35)] scale-[1.02]"
                  : "bg-gradient-to-r from-red-600 to-rose-600 text-white hover:from-red-500 hover:to-rose-500 shadow-md"
              }`}
            >
              {copiedEmbed ? (
                <>
                  <span className="text-sm">✓</span>
                  <span>EMBED COPIED</span>
                </>
              ) : (
                <>
                  <span>&lt;/&gt;</span>
                  <span>COPY EMBED</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
