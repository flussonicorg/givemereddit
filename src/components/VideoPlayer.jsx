"use client";

import { useMemo, useState } from "react";
import { extractIframeSrc } from "@/lib/api";

export default function VideoPlayer({ event, streams }) {
  const defaultSrc = useMemo(() => {
    const firstStream = streams[0]?.stream_link;
    if (firstStream) return firstStream;
    return extractIframeSrc(event.sch_iframe);
  }, [event.sch_iframe, streams]);

  const [activeSrc, setActiveSrc] = useState(defaultSrc);

  if (!activeSrc) {
    return (
      <div className="flex aspect-video items-center justify-center rounded-lg bg-zinc-900 text-zinc-400">
        No stream available for this event.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative aspect-video w-full overflow-hidden rounded bg-black">
        <iframe
          src={activeSrc}
          title={event.teams}
          className="absolute inset-0 h-full w-full border-0"
          allowFullScreen
          allow="autoplay; encrypted-media; picture-in-picture"
        />
      </div>

      {streams.length > 1 && (
        <div className="rounded-lg bg-slate-900 p-4">
          <h3 className="mb-3 text-[14px] font-bold text-white uppercase tracking-wider">
            Available Streams
          </h3>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
            {streams.map((stream, i) => (
              <button
                key={`${stream.stream_link}-${i}`}
                type="button"
                onClick={() => setActiveSrc(stream.stream_link)}
                className={`flex h-[40px] w-full items-center justify-center rounded border px-3 text-[13px] font-bold transition-colors ${
                  activeSrc === stream.stream_link
                    ? "border-blue-500 bg-blue-600 text-white shadow-[0_0_10px_rgba(37,99,235,0.5)]"
                    : "border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
                }`}
              >
                <span className="truncate">{stream.stream_name}</span>
                {stream.stream_lang && (
                  <span className="ml-1 shrink-0 text-[11px] opacity-70">
                    ({stream.stream_lang})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
