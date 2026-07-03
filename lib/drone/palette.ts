// Island palette. Terrain is a stylized daylight meadow; the sky and light
// rig animate from morning to sunset with flight time (see SkyDome/Lighting).
// P.bg stays the site surface colour — used for page-transition backdrops.
export const P = {
  bg: "#0c1324",
  lavender: "#c0c1ff",
  emerald: "#4edea3",
  videoAccent: "#ff6a5a",
  grassLo: "#2d4a42",
  grassHi: "#49795e",
  grassTip: "#74a884",
  rock: "#5f6a80",
  trunk: "#4a3830",
  canopy: "#2e5d45",
  water: "#33608a",
  ledGreen: "#00ff66",
  ledRed: "#ff2233",
  sand: "#d9c48f",
  snow: "#eef2f5",
  gold: "#ffd166",
} as const;

// Time-of-day keyframes, lerped by flight.dayT (0 = morning, 1 = sunset).
export const DAY_CYCLE = {
  morning: {
    zenith: "#4a90c8",
    mid: "#a3cbe8",
    horizon: "#ffe3b3",
    fog: "#b9d2e4",
    hemiSky: "#bcd9f0",
    hemiGround: "#55665c",
    hemiIntensity: 1.15,
    sun: "#fff3dc",
    sunIntensity: 2.0,
    sunPos: [50, 55, 25] as [number, number, number],
  },
  sunset: {
    zenith: "#35316e",
    mid: "#a4547a",
    horizon: "#ff8a50",
    fog: "#7a5468",
    hemiSky: "#8a5f86",
    hemiGround: "#33303e",
    hemiIntensity: 0.75,
    sun: "#ff9a5c",
    sunIntensity: 1.5,
    sunPos: [-45, 14, 30] as [number, number, number],
  },
} as const;
