// Client-safe types shared between the server-side content builder and the
// drone experience components. Nothing here may import from lib/mdx.ts (fs).

export interface FlightPersonal {
  name: string;
  role: string;
  tagline: string;
  location: string;
  email: string;
  aboutShort: string;
  aboutLong: string;
  resume: string;
  social: {
    github: string;
    linkedin: string;
    twitter: string;
    instagram: string;
  };
}

export interface FlightExperience {
  company: string;
  position: string;
  period: string;
  description: string;
  achievements: string[];
}

export interface FlightProject {
  title: string;
  description: string;
  tags: string[];
  liveUrl: string;
  githubUrl: string;
}

export interface FlightBlogPost {
  slug: string;
  title: string;
  date: string;
  readingTime: string;
  tags: string[];
}

export interface FlightTravelStory {
  slug: string;
  title: string;
  date: string;
  location: string;
  country: string;
}

export interface FlightVideo {
  id: string;
  /** Short, board-friendly display name. */
  title: string;
  /** One-line description shown on the board and in the focus panel. */
  caption: string;
  /** Full original title from the source platform (iframe title attr, a11y). */
  videoTitle: string;
  platform: "youtube" | "instagram";
  /** Required when platform === "youtube". */
  youtubeId?: string;
  /** Canonical share URL (opened via the "watch on..." out-link). */
  url: string;
  thumbnail: string;
}

export interface FlightContent {
  personal: FlightPersonal;
  experience: FlightExperience[];
  projects: FlightProject[];
  blogs: FlightBlogPost[];
  travel: FlightTravelStory[];
  videos: FlightVideo[];
}

export type FlightPhase =
  | "idle"
  | "charging"
  | "launching"
  | "flight"
  | "focus"
  | "landing";

export type InteractableKind = "focus" | "nav" | "collect";

export interface Interactable {
  id: string;
  kind: InteractableKind;
  position: [number, number, number];
  radius: number;
  /** Prompt label, e.g. "READ — Streak (2019–2021)" or "FLY TO /projects" */
  label: string;
  /** Route for kind === "nav" */
  href?: string;
  /** Camera pose for focus mode (kind === "focus"). */
  camPos?: [number, number, number];
  camLook?: [number, number, number];
}
