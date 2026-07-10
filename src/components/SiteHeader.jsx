import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-[#060b17]/90 backdrop-blur-xl text-white shadow-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-3">
          <span className="text-2xl font-black tracking-tight text-white">
            GIVEME<span className="text-cyan-400">REDDIT</span>
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.2)]">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400" />
            LIVE ARENA
          </span>
        </div>
      </div>
    </header>
  );
}
