const SPORTS_API_URL = "https://spanelv2.andrhino.com/api/v2/appsportsapi";
const SCHEDULE_API_URL = "https://spanelv2.andrhino.com/api/v2/appscheduleapi";

const REVALIDATE_SECONDS = 30;

export async function fetchSports() {
  const res = await fetch(SPORTS_API_URL, { next: { revalidate: REVALIDATE_SECONDS } });
  if (!res.ok) throw new Error("Failed to fetch sports");
  const data = await res.json();

  if (!Array.isArray(data)) return [];

  return data
    .filter((item) => item && (item.show_on_web === 1 || item.show_on_web === undefined))
    .map((item) => ({
      ...item,
      id: item.sport_id ?? item.id,
      events: Number(item.events || 0),
    }));
}

export async function fetchSchedule() {
  const res = await fetch(SCHEDULE_API_URL, { next: { revalidate: REVALIDATE_SECONDS } });
  if (!res.ok) throw new Error("Failed to fetch schedule");
  const data = await res.json();
  const days = Array.isArray(data) ? data : [];

  return days.map((day) => {
    const schedule = (Array.isArray(day.schedule) ? day.schedule : []).map((sportBlock) => {
      const league_schedule = (Array.isArray(sportBlock.league_schedule) ? sportBlock.league_schedule : []).map((e) => {
        let strHomeTeam = e.strHomeTeam || null;
        let strAwayTeam = e.strAwayTeam || null;
        if (!strHomeTeam || !strAwayTeam) {
          if (e.teams) {
            const parts = e.teams.split(/\s+(?:vs|at|VS|AT)\s+/i);
            if (parts.length === 2) {
              strHomeTeam = parts[0].trim();
              strAwayTeam = parts[1].trim();
            }
          }
        }

        return {
          ...e,
          strHomeTeam,
          strAwayTeam,
          status: e.status ?? 1,
          live_status: e.live_status === 1 || e.event_status === "LIVE" ? 1 : 0,
          category: e.category || e.league || e.sch_sport || sportBlock.sport || "Other",
          sch_league: e.sch_league || e.league || sportBlock.sport || "",
        };
      });

      return {
        ...sportBlock,
        league_schedule,
      };
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
  for (const day of (Array.isArray(scheduleDays) ? scheduleDays : [])) {
    for (const sportBlock of (day?.schedule || [])) {
      for (const event of (sportBlock?.league_schedule || [])) {
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
  for (const day of (Array.isArray(scheduleDays) ? scheduleDays : [])) {
    for (const sportBlock of (day?.schedule || [])) {
      for (const event of (sportBlock?.league_schedule || [])) {
        if (Number(event.sch_id) === id || String(event.sch_id) === String(schId)) {
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
  return (event?.streams || []).filter((s) => s && (s.show_on === 1 || s.show_on === undefined) && s.stream_link);
}

export function extractIframeSrc(schIframe) {
  if (!schIframe) return null;
  if (typeof schIframe !== "string") return null;
  const trimmed = schIframe.trim();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.startsWith("//")) {
    return trimmed;
  }
  const match = trimmed.match(/src=['"]([^'"]+)['"]/i);
  return match ? match[1] : trimmed || null;
}
