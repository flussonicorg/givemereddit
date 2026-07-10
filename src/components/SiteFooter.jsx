export default function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-slate-800/80 bg-[#04070f] py-8 text-center text-sm text-slate-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <p className="mb-2 text-lg font-black tracking-tight text-white">
          GIVEME<span className="text-cyan-400">REDDIT</span>
        </p>
        <p className="mx-auto max-w-2xl text-xs text-slate-500">
          <strong>Disclaimer:</strong> We do not host any of the streams, videos, or content on this website. All links and streams are provided by third parties. We are not responsible for any copyright or legal issues.
        </p>
        <p className="mt-4 text-xs text-slate-600">
          &copy; {new Date().getFullYear()} GiveMeReddit. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
