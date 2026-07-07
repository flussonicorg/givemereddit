export const runtime = 'edge';

import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-zinc-950">
      <SiteHeader />
      <main className="mx-auto max-w-lg px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-white">Event not found</h1>
        <p className="mt-2 text-zinc-400">
          This game may have ended or the link is invalid.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-lg bg-emerald-600 px-6 py-2 text-sm font-medium text-white hover:bg-emerald-500"
        >
          Back to schedule
        </Link>
      </main>
    </div>
  );
}
