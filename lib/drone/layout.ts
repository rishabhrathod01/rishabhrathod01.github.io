// World coordinate table — single source of truth for everything placed on
// the island. All y values are derived from heightAt(x, z) at build/mount
// time; only x/z live here.

export const WORLD = {
  /** Playable radius: soft geofence pushback beyond this. */
  softRadius: 62,
  /** Hard clamp — unreachable in practice. */
  hardRadius: 70,
  maxAltitude: 26,
  /** Terrain plane size / segments. */
  terrainSize: 160,
  terrainSegments: 96,
} as const;

export const POND = { x: 30, z: -18, r: 12, rim: 6, depth: -0.6 } as const;
export const PAD = { x: 0, z: 20, r: 7, rim: 4, h: 0.4 } as const;
export const BLOG_HILL = { x: 18, z: -44, r: 16, rim: 10, h: 3 } as const;

export const SPAWN = { x: 0, z: 20, hover: 2.2 } as const;

/** Experience trail, chronological (oldest first) — flying it = career ascent. */
export const EXPERIENCE_TRAIL: [number, number][] = [
  [-18, 24], // Shoptree 2018
  [-30, 12], // Blackboard Radio 2019
  [-38, -2], // Streak 2019–21
  [-40, -16], // Appsmith FE 2021–23
  [-34, -30], // Appsmith Sr 2023–24
  [-24, -40], // Prophecy 2024–
];

export const ABOUT_BOARD = { x: 0, z: 14 } as const;

export const PROJECT_BILLBOARDS: [number, number][] = [
  [22, -8],
  [34, -2],
];

export const NAV_SIGNPOSTS = [
  { id: "nav-projects", href: "/projects", label: "PROJECTS", x: 27, z: 2 },
  { id: "nav-blog", href: "/blog", label: "BLOG", x: 18, z: -44 },
  { id: "nav-travel", href: "/travel", label: "TRAVEL", x: 30, z: 28 },
  { id: "nav-bookshelf", href: "/bookshelf", label: "BOOKSHELF", x: -20, z: 34 },
  { id: "nav-about", href: "/about", label: "ABOUT", x: -6, z: 14 },
] as const;

/** Battery cells: ring around the perimeter + two hidden ones. */
export const BATTERY_CELLS: { id: string; x: number; z: number; yOffset: number }[] = [
  { id: "cell-1", x: 48, z: 14, yOffset: 3 },
  { id: "cell-2", x: 40, z: -34, yOffset: 4 },
  { id: "cell-3", x: 2, z: -52, yOffset: 5 },
  { id: "cell-4", x: -40, z: -35, yOffset: 3.5 },
  { id: "cell-5", x: -52, z: 4, yOffset: 4.5 },
  { id: "cell-6", x: -36, z: 40, yOffset: 3 },
  { id: "cell-7", x: 0, z: 20, yOffset: 10 }, // high above the pad
  { id: "cell-8", x: 30, z: -18, yOffset: 2.5 }, // over the pond centre
];

export const HIDDEN_BOARD = { x: 36, z: -34 } as const;

/** Briefing board for the ring time trial — near ring 1, hidden start gate. */
export const RACE_CHALLENGE_BOARD = { x: 14, z: 8 } as const;

/** Themed set-pieces flanking the video boards — matched by proximity, not
 *  by id, since each is a decorative landmark rather than an interactable. */
export const MOUNTAIN = { x: 20, z: -58, r: 9 } as const; // Mandalpatti Peak — slender spire, "above the clouds"
export const WATERFALL = { x: 44, z: -16, r: 6 } as const; // Shivanasamudra Falls — cascades into the pond's edge
export const BEACH = { x: 46, z: 34, r: 16 } as const; // Vagator Beach — sand + palms, coincides with the board

/** Ring-flying time trial: rings stay hidden until the pilot reads the briefing
 *  board (E) and confirms with Enter. The route loops past the island's
 *  landmarks — bookshelf, experience trail, the mountain, the pond/waterfall,
 *  the beach — so finishing it doubles as a sightseeing tour. */
export const RACE_TIME_LIMIT = 90; // seconds (1:30)
export const RACE_CHECKPOINT_POINTS = 100;
export const RACE_FINISH_POINTS = 250;

export const RACE_RINGS: {
  id: string;
  x: number;
  z: number;
  alt: number;
  radius: number;
  finish?: boolean;
}[] = [
  { id: "ring-1", x: 8, z: 6, alt: 5, radius: 3.6 }, // start, by the pad
  { id: "ring-2", x: -2, z: 18, alt: 6, radius: 3.4 }, // past the About board
  { id: "ring-3", x: -14, z: 28, alt: 8, radius: 3.4 }, // toward Bookshelf
  { id: "ring-4", x: -26, z: 22, alt: 9, radius: 3.2 }, // Bookshelf vantage
  { id: "ring-5", x: -32, z: 8, alt: 10, radius: 3.2 }, // top of the experience trail
  { id: "ring-6", x: -36, z: -8, alt: 9, radius: 3.2 }, // mid experience trail
  { id: "ring-7", x: -32, z: -24, alt: 10, radius: 3.2 }, // lower experience trail
  { id: "ring-8", x: -18, z: -36, alt: 11, radius: 3.2 }, // toward Blog Hill
  { id: "ring-9", x: 0, z: -46, alt: 15, radius: 3.4 }, // climbing over Blog Hill
  { id: "ring-10", x: 12, z: -46, alt: 22, radius: 3.6 }, // high pass by Mandalpatti Peak
  { id: "ring-11", x: 30, z: -34, alt: 14, radius: 3.4 }, // descending toward the pond
  { id: "ring-12", x: 34, z: -10, alt: 11, radius: 3.2 }, // past the waterfall
  { id: "ring-13", x: 40, z: 6, alt: 9, radius: 3.2 }, // by the project billboards
  { id: "ring-14", x: 44, z: 22, alt: 8, radius: 3.2 }, // approaching Vagator Beach
  { id: "ring-finish", x: 30, z: 16, alt: 7, radius: 4.5, finish: true }, // loop back toward the pad
];

/** Drone-footage video boards, matched 1:1 with lib/data.ts droneVideos by
 *  index. Placed near existing landmarks that fit each clip's theme — no new
 *  set-piece geometry, per design. */
export const VIDEO_BOARDS: { id: string; x: number; z: number }[] = [
  { id: "video-mandalpatti", x: 8, z: -52 }, // atop BLOG_HILL — the highest point, "above the clouds"
  { id: "video-shivanasamudra", x: 48, z: -14 }, // just outside the pond rim, overlooking the water
  { id: "video-vagator", x: 46, z: 34 }, // NE coast, past the TRAVEL wind-sock cluster
];
