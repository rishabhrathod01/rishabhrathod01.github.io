// Stroked redraws of Phosphor's GitHub / LinkedIn / X / YouTube logos (regular weight),
// split into parts so globals.css can animate them while the parent link is
// hovered or focused. See the `.si-*` rules there.

type Props = { className?: string };

const svg = {
  viewBox: "0 0 256 256",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 16,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  overflow: "visible",
  "aria-hidden": true,
};

// Octocat walks: legs step in turn, tail-arm swings, head bobs.
export function GithubIcon({ className }: Props) {
  return (
    <svg {...svg} className={className}>
      <path
        className="si-gh-head"
        d="M112 160a48 48 0 0 1-48-48v-8a50 50 0 0 1 7.5-25.5A52 52 0 0 1 75 32a52 52 0 0 1 41 24h40a52 52 0 0 1 41-24 52 52 0 0 1 3.5 46.5A50 50 0 0 1 208 104v8a48 48 0 0 1-48 48Z"
      />
      <path className="si-gh-tail" d="M104 208H72a32 32 0 0 1-32-32 32 32 0 0 0-32-32" />
      <path className="si-gh-leg-l" d="M108 164q-4 10-4 28v40" />
      <path className="si-gh-leg-r" d="M164 164q4 10 4 28v40" />
    </svg>
  );
}

// Box border runs around the "in" with an orbiting gap.
export function LinkedinIcon({ className }: Props) {
  return (
    <svg {...svg} className={className}>
      <rect className="si-li-box" x="32" y="32" width="192" height="192" rx="8" pathLength={100} />
      <path d="M88 112v64M128 176v-64m0 36a24 24 0 0 1 48 0v28" />
      <circle cx="88" cy="84" r="12" fill="currentColor" stroke="none" />
    </svg>
  );
}

// The two strokes swing apart and clash back like crossed swords.
export function XIcon({ className }: Props) {
  return (
    <svg {...svg} className={className}>
      <path className="si-x-a" d="M55 40h39l107 176h-39Z" />
      <path className="si-x-b" d="M48 216l60-66M148 106l60-66" />
    </svg>
  );
}

// The play button presses in and the frame flickers like a screen.
export function YoutubeIcon({ className }: Props) {
  return (
    <svg {...svg} className={className}>
      <path
        className="si-yt-frame"
        d="M234 69.2a24 24 0 0 0-14.5-16.3C185.6 39.8 128 40 128 40s-57.6-.2-91.5 12.9A24 24 0 0 0 22 69.2C19.4 89.2 16 115.6 16 128s3.4 38.8 6 58.8a24 24 0 0 0 14.5 16.3C70.4 216.2 128 216 128 216s57.6.2 91.5-12.9a24 24 0 0 0 14.5-16.3c2.6-20 6-46.4 6-58.8s-3.4-38.8-6-58.8Z"
      />
      <path className="si-yt-play" d="m160 128-48-32v64Z" />
    </svg>
  );
}
