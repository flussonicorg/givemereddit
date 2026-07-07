const PARTIES_API_URL = "https://backend.streamcenter.live/api/Parties?pageNumber=1&pageSize=500";
const CATEGORIES_API_URL = "https://backend.streamcenter.live/api/Categories";

const REVALIDATE_SECONDS = 30;

export async function fetchSports() {
  const [categoriesRes, partiesRes] = await Promise.all([
    fetch(CATEGORIES_API_URL, { next: { revalidate: REVALIDATE_SECONDS } }),
    fetch(PARTIES_API_URL, { next: { revalidate: REVALIDATE_SECONDS } }),
  ]);

  if (!categoriesRes.ok) throw new Error("Failed to fetch sports");
  const data = await categoriesRes.json();

  const eventCounts = new Map();
  if (partiesRes.ok) {
    const parties = await partiesRes.json();
    (Array.isArray(parties) ? parties : []).forEach((p) => {
      if (p && p.categoryId != null) {
        const cid = String(p.categoryId);
        eventCounts.set(cid, (eventCounts.get(cid) || 0) + 1);
      }
    });
  }

  const seen = new Set();
  const sports = [];

  for (const item of (Array.isArray(data) ? data : [])) {
    const sport_id = String(item.id || "");
    if (!sport_id || seen.has(sport_id)) continue;
    seen.add(sport_id);
    sports.push({
      sport_id,
      sport_league_name: item.name,
      game_logo: item.imagePath || null,
      events: eventCounts.get(sport_id) || 0,
      show_on_web: 1,
      reverse: item.reverse || false,
      id: item.id,
    });
  }

  return sports;
}

export async function fetchSchedule() {
  const [partiesRes, categoriesRes] = await Promise.all([
    fetch(PARTIES_API_URL, { next: { revalidate: REVALIDATE_SECONDS } }),
    fetch(CATEGORIES_API_URL, { next: { revalidate: REVALIDATE_SECONDS } }),
  ]);

  const categoriesMap = new Map();
  if (categoriesRes.ok) {
    const categoriesData = await categoriesRes.json();
    (Array.isArray(categoriesData) ? categoriesData : []).forEach((cat) => {
      if (cat && cat.id != null) {
        categoriesMap.set(String(cat.id), {
          name: cat.name,
          logo: cat.imagePath || null,
          code: cat.sportCode || cat.name,
        });
      }
    });
  }

  if (!partiesRes.ok) throw new Error("Failed to fetch schedule");
  const partiesData = await partiesRes.json();
  const parties = Array.isArray(partiesData) ? partiesData : [];

  const daysMap = new Map();

  parties.forEach((p) => {
    if (!p) return;
    const rawDate = p.beginPartie || "";
    const isoDate = rawDate
      ? rawDate.endsWith("Z") || rawDate.includes("+")
        ? rawDate
        : rawDate + "Z"
      : null;
    const date = isoDate ? new Date(isoDate) : new Date();

    const dayKey = isNaN(date.getTime())
      ? "UPCOMING"
      : date
          .toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            timeZone: "UTC",
          })
          .toUpperCase();

    const timeStr = isNaN(date.getTime())
      ? "TBD"
      : date.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          timeZone: "UTC",
        }) + " GMT";

    const cid = p.categoryId != null ? String(p.categoryId) : "other";
    const catInfo = categoriesMap.get(cid) || {
      name: p.category || "Other Sports",
      logo: null,
      code: p.category || "other",
    };

    if (!daysMap.has(dayKey)) {
      daysMap.set(dayKey, {
        date: dayKey,
        sortTime: isNaN(date.getTime())
          ? 0
          : Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
        sportBlocks: new Map(),
      });
    }

    const dayObj = daysMap.get(dayKey);
    if (!dayObj.sportBlocks.has(cid)) {
      dayObj.sportBlocks.set(cid, {
        sport_id: cid,
        sport: catInfo.name,
        game_logo: catInfo.logo,
        league_schedule: [],
      });
    }

    let strHomeTeam = null;
    let strAwayTeam = null;
    if (p.name) {
      const parts = p.name.split(/\s+(?:vs|at|VS|AT)\s+/i);
      if (parts.length === 2) {
        strHomeTeam = parts[0].trim();
        strAwayTeam = parts[1].trim();
      }
    }

    const now = new Date();
    const endDate = p.endPartie
      ? new Date(
          p.endPartie.endsWith("Z") || p.endPartie.includes("+")
            ? p.endPartie
            : p.endPartie + "Z"
        )
      : null;
    const isTimeLive =
      !isNaN(date.getTime()) &&
      endDate &&
      !isNaN(endDate.getTime()) &&
      now >= date &&
      now <= endDate;
    const isLive = p.popularLive || p.status === "LIVE" || isTimeLive ? 1 : 0;

    const streams = (p.videoUrl || "")
      .split(";")
      .map((s) => s.trim())
      .filter(Boolean)
      .map((s, idx) => {
        const parts = s.split("<");
        const link = parts[0]?.trim();
        const lang = parts[1]?.trim() || "";
        return {
          stream_link: link,
          stream_name: lang ? `Stream (${lang})` : `Stream ${idx + 1}`,
          stream_lang: lang,
          show_on: 1,
        };
      })
      .filter((s) => s.stream_link);

    dayObj.sportBlocks.get(cid).league_schedule.push({
      sch_id: p.id,
      status: 1,
      league: catInfo.name,
      event_time: timeStr,
      live_status: isLive,
      strHomeTeam,
      strAwayTeam,
      teams: p.name || p.gameName || p.description || "Live Event",
      sch_home_logo: p.logoTeam1 || null,
      sch_away_logo: p.logoTeam2 || null,
      sch_league: catInfo.name,
      strThumb: null,
      category: catInfo.name,
      streams,
      sch_iframe: null,
      raw_time: date.getTime(),
    });
  });

  const sortedDays = Array.from(daysMap.values()).sort((a, b) => a.sortTime - b.sortTime);

  return sortedDays.map((day) => {
    const schedule = Array.from(day.sportBlocks.values()).map((block) => {
      block.league_schedule.sort((a, b) => (a.raw_time || 0) - (b.raw_time || 0));
      return block;
    });
    return {
      date: day.date,
      schedule,
    };
  });
}

/** Flatten schedule into events with date context */
export function flattenSchedule(scheduleDays) {
  const events = [];
  for (const day of scheduleDays) {
    for (const sportBlock of day.schedule || []) {
      for (const event of sportBlock.league_schedule || []) {
        if (event.status !== 1) continue;
        events.push({
          ...event,
          dateLabel: day.date,
          sportName: sportBlock.sport,
          sportLogo: sportBlock.game_logo,
          sportId: sportBlock.sport_id,
        });
      }
    }
  }
  return events;
}

export function findEventById(scheduleDays, schId) {
  const id = Number(schId);
  for (const day of scheduleDays) {
    for (const sportBlock of day.schedule || []) {
      for (const event of sportBlock.league_schedule || []) {
        if (event.sch_id === id) {
          return {
            ...event,
            dateLabel: day.date,
            sportName: sportBlock.sport,
            sportLogo: sportBlock.game_logo,
            sportId: sportBlock.sport_id,
          };
        }
      }
    }
  }
  return null;
}

export function getVisibleStreams(event) {
  return (event?.streams || []).filter((s) => s.show_on === 1);
}

export function extractIframeSrc(schIframe) {
  if (!schIframe) return null;
  const match = schIframe.match(/src=['"]([^'"]+)['"]/i);
  return match ? match[1] : null;
}
