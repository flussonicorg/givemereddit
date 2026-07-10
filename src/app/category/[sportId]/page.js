export const runtime = 'edge';

import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ScheduleView from "@/components/ScheduleView";
import { fetchSports, fetchSchedule } from "@/lib/api";

export const revalidate = 30;

export default async function CategoryPage({ params }) {
  const resolvedParams = await params;
  const rawSportId = resolvedParams?.sportId;
  const initialSportId =
    rawSportId && rawSportId !== "all" ? Number(rawSportId) : null;

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
        {error ? (
          <p className="rounded-xl border border-red-900/50 bg-red-950/30 p-6 text-red-300">
            Could not load schedule: {error}
          </p>
        ) : (
          <ScheduleView
            sports={sports}
            scheduleDays={scheduleDays}
            initialSportId={initialSportId}
          />
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
