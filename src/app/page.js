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
    <div className="flex min-h-screen flex-col bg-[#f2f3f5] text-[#15171a]">
      <SiteHeader />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6">
        <div className="mb-8">
          <h1 className="text-2xl font-black text-[#111827] sm:text-3xl">
            SportsHub24 Match Schedule & Live Events
          </h1>
          <p className="mt-2 text-[#667085]">
            Stay updated with today&apos;s live match schedule across football, cricket, NBA, NHL, MLB, UFC, boxing, motorsports, and other major sporting events.
          </p>
        </div>

        {error ? (
          <p className="rounded-xl border border-red-900/50 bg-red-950/30 p-6 text-red-300">
            Could not load schedule: {error}
          </p>
        ) : (
          <ScheduleView sports={sports} scheduleDays={scheduleDays} />
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
