export const runtime = 'edge';

import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import VideoPlayer from "@/components/VideoPlayer";
import PopunderAd from "@/components/PopunderAd";
import { fetchSchedule, findEventById, getVisibleStreams } from "@/lib/api";

export const revalidate = 30;

export async function generateMetadata({ params }) {
  const { schId } = await params;
  const schedule = await fetchSchedule();
  const event = findEventById(schedule, schId);
  if (!event) return { title: "Watch Live" };
  return {
    title: `${event.teams} — Live Stream`,
    description: `Watch ${event.teams} live. ${event.sch_league}`,
  };
}

export default async function WatchPage({ params }) {
  const { schId } = await params;
  const schedule = await fetchSchedule();
  const event = findEventById(schedule, schId);

  if (!event) notFound();

  const streams = getVisibleStreams(event);
  const isLive = event.live_status === 1;

  return (
    <div className="flex min-h-screen flex-col bg-[#0f172a] text-white font-sans">
      <PopunderAd />
      <SiteHeader />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6">
        <Link
          href="/"
          className="mb-6 inline-flex text-sm text-slate-400 transition-colors hover:text-white"
        >
          ← Back to schedule
        </Link>

        {/* Header Section */}
        <div className="mb-6 flex flex-col items-center justify-center text-center">
          <div className="mb-3 flex flex-wrap items-center justify-center gap-2">
            <span className="rounded bg-slate-800 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-slate-300">
              {event.league}
            </span>
            {isLive ? (
              <span className="inline-flex items-center gap-1.5 rounded bg-red-500/10 px-2 py-0.5 text-xs font-bold tracking-wider text-red-500">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
                LIVE
              </span>
            ) : (
              <span className="inline-flex items-center rounded bg-slate-800 px-2 py-0.5 text-xs font-bold tracking-wider text-slate-400">
                UPCOMING
              </span>
            )}
            <span className="text-xs font-medium text-slate-400">
              {event.dateLabel} · {event.event_time}
            </span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl lg:text-4xl">
            {event.teams}
          </h1>
          <p className="mt-2 text-sm font-medium uppercase tracking-wide text-slate-400">
            {event.sch_league}
          </p>
        </div>

        {/* Player Section */}
        <div className="mx-auto max-w-5xl">
          <VideoPlayer event={event} streams={streams} />

          {event.tv_guide && (
            <details className="mt-4 rounded-lg border border-slate-800 bg-slate-800/50 p-4">
              <summary className="cursor-pointer text-sm font-bold text-white">
                TV Guide
              </summary>
              <p className="mt-2 text-sm text-slate-400">{event.tv_guide}</p>
            </details>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
