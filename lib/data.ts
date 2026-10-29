export const personalInfo = {
  name: "Rishabh Rathod",
  role: "Staff Frontend Engineer",
  tagline:
    "Problem solver. I ship products people use, from food delivery apps to low-code platforms and AI agents.",
  email: "rishabhrathod2012@gmail.com",
  location: "Bengaluru, Karnataka, India",
  social: {
    github: "https://github.com/rishabhrathod01",
    linkedin: "https://www.linkedin.com/in/rishabhrathod01",
    twitter: "https://twitter.com/rishabhrathod01",
    instagram: "https://www.instagram.com/rishabh__ooo",
    youtube: "https://www.youtube.com/@rishabhrathod01",
  },
  about: {
    short:
      "I solve problems and ship the fix. Over 7 years that has meant mobile apps, a crypto trading platform, a low-code engine, and AI agents.",
    long: "I care about what gets shipped and whether it works, not which tool built it. In 7+ years (plus a year of internships) I have shipped a food delivery app, a crypto algo trading platform at Streak, enterprise features and a 200% faster evaluation engine at Appsmith, and now the agentic experience at Prophecy. Outside work I take solo bike trips and fly drones.",
  },
  resume:
    "https://drive.google.com/file/d/1mxMNR2o-UlQ5ycbg64doEkPC7vLpAtgc/view?usp=sharing",
};

export const experience = [
  {
    company: "Prophecy",
    position: "Staff Frontend Engineer",
    period: "December 2024 - Present",
    description:
      "Contributing to AI-powered data engineering platform features and innovations.",
    achievements: [
      "Shipped AI agent features for data exploration, comparison, and pipeline generation using AI",
      "Working on cutting-edge AI integration for enterprise data workflows",
    ],
  },
  {
    company: "Appsmith",
    position: "Senior Frontend Engineer",
    period: "June 2023 - December 2024",
    description:
      "Led enterprise feature development and performance optimization for the low-code platform.",
    achievements: [
      "Developed Packages feature, improving reusability of queries and logic across workspaces, driving increased enterprise sales",
      "Built Generate CRUD feature, enabling users to create fully functional apps in under 10 seconds",
      "Optimized JavaScript evaluation engine, boosting performance by over 200% and reducing initial app load time from 5s to under 1s",
      "Led developer-centric features like JS Object mutation and widget property setters, contributing to 30% improvement in user activation",
      "Conducted knowledge transfer sessions as code owner for JavaScript evaluation engine",
    ],
  },
  {
    company: "Appsmith",
    position: "Frontend Engineer",
    period: "June 2021 - June 2023",
    description:
      "Contributed to the development of low-code platform features and user experience improvements.",
    achievements: [
      "Built and shipped multiple features for the Appsmith platform",
      "Collaborated with cross-functional teams to deliver high-quality solutions",
    ],
  },
  {
    company: "Streak AI Technologies Pvt Ltd",
    position: "Frontend Developer",
    period: "July 2019 - June 2021",
    description:
      "Developed high-performance web and mobile solutions for fintech platform.",
    achievements: [
      "Reduced website bundle size by 65%, improving First Contentful Paint from 4.0s to 1.8s via code splitting and lazy-loading",
      "Shipped one charting experience across mobile and web",
      "Shipped the marketing website with a 90+ Lighthouse SEO score",
      "Led custom mobile components and shipped push notifications",
      "Shipped dark theme and built a CSS-to-JS conversion tool",
      "Built internal Android dialer app integrated with CRM API to automate customer support calls",
    ],
  },
  {
    company: "Blackboard Radio",
    position: "React Native Developer",
    period: "April 2019 - June 2019",
    description: "Developed mobile app features for audio content platform.",
    achievements: [
      "Developed Quiz module for the BBR app, enhancing user engagement",
      "Built in-app audio trimming and merging",
    ],
  },
  {
    company: "Shoptree",
    position: "Software Developer",
    period: "August 2018 - March 2019",
    description: "Built mobile application for online food ordering platform.",
    achievements: [
      "Shipped the mobile app for online food ordering",
    ],
  },
];

export const projects = [
  {
    title: "JSON Diff",
    description:
      "A browser-based JSON diff tool with side-by-side and unified views. Supports recursive key-exclusion filters with named configs, shareable filter links via URL params, and sorts keys before comparison to cut through noise.",
    image: "/projects/json-diff.png",
    tags: ["Developer tool", "Free to use", "Open source"],
    liveUrl: "https://rishabhrathod01.github.io/tools/json-diff",
    githubUrl: "https://github.com/rishabhrathod01/rishabhrathod01.github.io",
    featured: true,
  },
  {
    title: "DiffyCurl",
    description:
      "A powerful developer tool for comparing API responses. Helps developers identify differences between multiple API endpoints, track API changes, and debug response variations efficiently.",
    image:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80",
    tags: ["Developer tool", "API debugging", "Open source"],
    liveUrl: "",
    githubUrl: "https://github.com/rishabhrathod01/DiffyCurl",
    // Built before agentic AI coding tools; shown as a badge.
    preAI: true,
    featured: false,
  },
  {
    title: "CSS to JS - VS Code Extension",
    description:
      "A VS Code extension that converts CSS styles to JavaScript objects instantly. Streamlines the workflow for developers working with CSS-in-JS libraries like styled-components and emotion. Published on VS Code Marketplace.",
    image:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80",
    tags: ["Developer tool", "VS Code Marketplace", "Open source"],
    liveUrl:
      "https://marketplace.visualstudio.com/items?itemName=rishabh-rathod.css-to-js",
    githubUrl: "https://github.com/rishabhrathod01/css-to-js",
    // Built before agentic AI coding tools; shown as a badge.
    preAI: true,
    featured: true,
  },
];

export const droneVideos = [
  {
    id: "video-mandalpatti",
    title: "Mandalpatti Peak",
    caption: "Above the clouds — DJI Mini 4 Pro cinematic drone flight",
    videoTitle:
      "Mandalpatti Peak, Coorg — Above the Clouds | DJI Mini 4 Pro Cinematic Drone",
    platform: "youtube" as const,
    youtubeId: "NV87I6aqU18",
    url: "https://youtu.be/NV87I6aqU18",
    thumbnail: "https://i.ytimg.com/vi/NV87I6aqU18/hqdefault.jpg",
  },
  {
    id: "video-shivanasamudra",
    title: "Shivanasamudra Falls",
    caption: "A waterfall in Karnataka, seen from above",
    videoTitle: "Shivanasamudra Falls, Karnataka",
    platform: "youtube" as const,
    youtubeId: "_k0lbo-z7IY",
    url: "https://youtu.be/_k0lbo-z7IY",
    thumbnail: "https://i.ytimg.com/vi/_k0lbo-z7IY/hqdefault.jpg",
  },
  {
    id: "video-vagator",
    title: "Vagator Beach",
    caption: "My first-ever drone shot, over the Goa coastline",
    videoTitle: "Vagator Beach Drone Shot - My First Drone Shot",
    platform: "youtube" as const,
    youtubeId: "WhWniSMK5bY",
    url: "https://youtu.be/WhWniSMK5bY",
    thumbnail: "https://i.ytimg.com/vi/WhWniSMK5bY/hqdefault.jpg",
  },
];

// Instagram reels from trips, keyed by place. `id` is the reel shortcode.
export const reels = {
  mandalpatti: { place: "Mandalpatti Peak, Coorg", id: "DRknx-Bk8gP" },
  colaBeach: { place: "Cola Beach, Goa", id: "DY0HQggTBpC" },
  arambol: { place: "Arambol Beach, Goa", id: "DY0HI-jzsUr" },
  kaup: { place: "Kaup Beach lighthouse, Mulki", id: "DY0GdBpzFLO" },
  marvanthe: { place: "Marvanthe Beach", id: "DY0Ete-z-wm" },
  rohtang: { place: "Rohtang, Himachal", id: "DRStcZbDtOB" },
  poombarai: { place: "Poombarai, near Kodaikanal", id: "DCKMkZhOeyd" },
};

export type Reel = (typeof reels)[keyof typeof reels];

export const reelUrl = (r: Reel) => `https://www.instagram.com/reel/${r.id}/`;

export const education = [
  {
    institution: "SJB Institute of Technology",
    degree: "Bachelor of Engineering",
    field: "Computer Science and Engineering",
    period: "2015 - 2019",
    location: "Bengaluru, Karnataka, India",
  },
  {
    institution: "Lions English School",
    degree: "SSC, HSC",
    field: "Secondary Education",
    period: "2013 - 2015",
    location: "India",
  },
];

// The life story on the home page, drawn as one winding road. Add an event by
// adding an object here; the timeline sorts by `start` and places it by date.
// Dates are "YYYY", "YYYY-MM" or "YYYY-MM-DD"; `end` may also be "present".
export type LifeIcon =
  | "home" | "school" | "college" | "cart" | "radio" | "chart"
  | "code" | "sparkle" | "bike" | "plant" | "cloud" | "mountain" | "tree";

export type LifeEvent = {
  start?: string; // omit only for the origin (birth)
  end?: string; // omit for one-day events
  kind: "life" | "education" | "work" | "trip";
  icon: LifeIcon; // drawn on the road at the event's dot
  // Where the road leans during this stretch, from -1 (left) to 1 (right).
  // Leave it out and the road stays where it is. For a lean that changed,
  // list each change with the date it started.
  lean?: number | { from: string; lean: number }[];
  title: string;
  summary: string;
  href?: string;
  reels?: (keyof typeof reels)[]; // the first plays in the card unless there is a video
  video?: string; // YouTube id, shown in the card
  links?: { label: string; href: string; note?: string; image?: string }[];
};

const projectImage = (title: string) =>
  projects.find((p) => p.title === title)?.image;

export const lifeEvents: LifeEvent[] = [
  {
    start: "1998",
    kind: "life",
    icon: "home",
    title: "Born in Silvassa",
    summary: "This is where it starts.",
  },
  {
    start: "2002",
    end: "2015",
    kind: "education",
    icon: "school",
    title: "Lions English School",
    summary: "I studied here from the age of 4 until I finished my SSC and HSC.",
  },
  {
    start: "2015",
    end: "2019",
    kind: "education",
    icon: "college",
    lean: -0.5,
    title: "SJB Institute of Technology",
    summary: "I moved to Bengaluru for college and studied Computer Science.",
  },
  {
    start: "2018-08",
    end: "2019-03",
    kind: "work",
    icon: "cart",
    lean: 0.5,
    title: "Shoptree",
    summary:
      "An 8-month internship in my final year. I shipped the mobile app for online food ordering.",
  },
  {
    start: "2019-04",
    end: "2019-06",
    kind: "work",
    icon: "radio",
    lean: 0,
    title: "Blackboard Radio",
    summary:
      "A 3-month internship where I built the quiz module. These internships helped me land the Streak job.",
  },
  {
    start: "2019-07",
    end: "2021-06",
    kind: "work",
    icon: "chart",
    lean: -1,
    title: "Streak",
    summary:
      "I worked on Streak's global no-code algo trading product and built its website.",
    links: [
      {
        label: "CSS to JS",
        href: "https://marketplace.visualstudio.com/items?itemName=rishabh-rathod.css-to-js",
        note: "a VS Code extension to move CSS to CSS-in-JS so theming stays consistent",
        image: projectImage("CSS to JS - VS Code Extension"),
      },
      {
        label: "DiffyCurl",
        href: "https://github.com/rishabhrathod01/DiffyCurl",
        note: "to see what changed between two API requests",
        image: projectImage("DiffyCurl"),
      },
    ],
  },
  {
    start: "2021-06",
    end: "2024-12",
    kind: "work",
    icon: "code",
    lean: [
      { from: "2021-06", lean: 1 },
      { from: "2023-06", lean: -0.6 },
    ],
    title: "Appsmith",
    summary:
      "Almost 4 years. I worked on the engine that runs users' JavaScript in the browser, and built the Packages feature.",
  },
  {
    start: "2024-02",
    kind: "trip",
    icon: "bike",
    title: "Solo bike trip, Bengaluru to Goa",
    summary: "I rode solo from Bengaluru to Goa.",
    href: "/travel/mulki-goa-bike-trip",
    reels: ["arambol", "colaBeach", "kaup", "marvanthe"],
    video: "WhWniSMK5bY", // Vagator, my first drone shot
  },
  {
    start: "2024-08",
    kind: "trip",
    icon: "plant",
    title: "Poombarai",
    summary: "A village near Kodaikanal.",
    reels: ["poombarai"],
  },
  {
    start: "2024-09",
    kind: "trip",
    icon: "cloud",
    title: "Coorg",
    summary: "Above the clouds at Mandalpatti Peak.",
    reels: ["mandalpatti"],
    video: "NV87I6aqU18",
  },
  {
    start: "2024-12",
    end: "present",
    kind: "work",
    icon: "sparkle",
    lean: 0,
    title: "Prophecy",
    summary:
      "I built AI features first. Now I am the sole contributor to the agentic experience.",
  },
  {
    start: "2025-11",
    kind: "trip",
    icon: "mountain",
    title: "Himachal",
    summary: "A bike ride through Sissu, and a drone shot at Rohtang.",
    reels: ["rohtang"],
    video: "qVIHJk79q9c",
  },
  {
    start: "2026-09",
    kind: "trip",
    icon: "tree",
    title: "Wayanad",
    summary: "Shots from the trip are on Instagram.",
    links: [{ label: "Shots on Instagram", href: personalInfo.social.instagram }],
  },
];
