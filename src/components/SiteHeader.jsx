import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 bg-[#111827] border-b-[4px] border-[#d71920] text-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-3">
          <span className="text-[24px] font-black tracking-tight text-white">
            SportsHub<span className="text-[#d71920]">24</span>
          </span>
        </Link>

      </div>
    </header>
  );
}
