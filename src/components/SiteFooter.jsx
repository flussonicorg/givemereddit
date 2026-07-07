export default function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-slate-200/10 bg-[#0f172a] py-8 text-center text-sm text-slate-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <p className="mb-2 font-black text-white text-lg">
          SportsHub<span className="text-[#d71920]">24</span>
        </p>
        <p className="mx-auto max-w-2xl">
          <strong>Disclaimer:</strong> We do not host any of the streams, videos, or content on this website. All links and streams are provided by third parties. We are not responsible for any copyright or legal issues.
        </p>
        <p className="mt-4 text-xs opacity-60">
          &copy; {new Date().getFullYear()} SportsHub24. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
