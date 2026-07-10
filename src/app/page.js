export const runtime = 'edge';

import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ScheduleView from "@/components/ScheduleView";
import { fetchSports, fetchSchedule } from "@/lib/api";

export const revalidate = 30;

export default async function HomePage() {
  let sports = [];
  let scheduleDays = [];
  let error = null;

  try {
    [sports, scheduleDays] = await Promise.all([
      fetchSports(),
      fetchSchedule(),
    ]);
  } catch (e) {
    error = e.message;
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#050914] text-slate-100 selection:bg-cyan-500 selection:text-black">
      <SiteHeader />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6">
        <div className="mb-8 relative overflow-hidden rounded-3xl border border-slate-800/90 bg-gradient-to-r from-[#0d162c] via-[#0f1d3a] to-[#0a1122] p-6 shadow-2xl sm:p-8">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-cyan-500/10 blur-3xl" />
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/40 bg-cyan-500/10 px-3.5 py-1 text-xs font-black tracking-widest text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
            <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" />
            LIVE SPORTS ARENA
          </div>
          <h1 className="mt-3.5 text-2xl font-black tracking-tight text-white sm:text-4xl">
            GIVEME<span className="text-cyan-400">REDDIT</span> MATCH SCHEDULE
          </h1>
          <p className="mt-2 text-sm text-slate-300 max-w-2xl">
            Select any sport category below to instantly filter live and scheduled matches right here on this page. Instant one-click persistent copying for match titles and iframe embed codes.
          </p>
        </div>

        {error ? (
          <p className="rounded-xl border border-red-900/50 bg-red-950/30 p-6 text-red-300">
            Could not load match schedule: {error}
          </p>
        ) : (
          <ScheduleView sports={sports} scheduleDays={scheduleDays} />
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
