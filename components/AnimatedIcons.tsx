// Icons that move while their link or button is hovered. Whole-icon motion is
// a Phosphor icon plus an `ic-*` class; part motion uses stroked redraws split
// into parts, like SocialIcons.tsx. The rules are the `.ic-*` block at the end
// of globals.css. components/icons.ts re-exports these under the site's names.
import type { Icon, IconProps } from "@phosphor-icons/react";
import {
  ArrowDown as PhArrowDown,
  ArrowLeft as PhArrowLeft,
  ArrowRight as PhArrowRight,
  ArrowUpRight as PhArrowUpRight,
  ArrowsClockwise,
  House,
  MapPin as PhMapPin,
  Moon as PhMoon,
  PaperPlaneTilt,
  Square as PhSquare,
  Sun as PhSun,
  X as PhX,
} from "@phosphor-icons/react/ssr";

function animated(Base: Icon, anim: string) {
  const AnimatedIcon = ({ className, ...props }: IconProps) => (
    <Base {...props} className={className ? `${anim} ${className}` : anim} />
  );
  return AnimatedIcon;
}

export const ArrowRight = animated(PhArrowRight, "ic-nudge-r");
export const ArrowLeft = animated(PhArrowLeft, "ic-nudge-l");
export const ArrowDown = animated(PhArrowDown, "ic-nudge-d");
export const ArrowUpRight = animated(PhArrowUpRight, "ic-out");
export const Home = animated(House, "ic-nudge-u");
export const MapPin = animated(PhMapPin, "ic-pin");
export const Plane = animated(PaperPlaneTilt, "ic-fly");
export const RefreshCw = animated(ArrowsClockwise, "ic-spin");
export const Moon = animated(PhMoon, "ic-rock");
export const Sun = animated(PhSun, "ic-turn ic-turn-45");
export const X = animated(PhX, "ic-turn");
export const Square = animated(PhSquare, "ic-press");

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

// Flap opens.
export function Mail({ className }: Props) {
  return (
    <svg {...svg} className={`ic ${className ?? ""}`}>
      <path d="M32 56h192v136a8 8 0 0 1-8 8H40a8 8 0 0 1-8-8Z" />
      <path className="ic-mail-flap" d="M224 56l-96 88-96-88" />
    </svg>
  );
}

// Lid lifts off its left end.
export function Trash2({ className }: Props) {
  return (
    <svg {...svg} className={`ic ${className ?? ""}`}>
      <g className="ic-trash-lid">
        <path d="M40 56h176" />
        <path d="M88 56V40a16 16 0 0 1 16-16h48a16 16 0 0 1 16 16v16" />
      </g>
      <path d="M200 56v152a8 8 0 0 1-8 8H64a8 8 0 0 1-8-8V56M104 104v64M152 104v64" />
    </svg>
  );
}

// Tick draws itself in.
export function Check({ className }: Props) {
  return (
    <svg {...svg} className={`ic ${className ?? ""}`}>
      <path className="ic-check" d="M40 144l56 56L224 72" pathLength={1} />
    </svg>
  );
}

// Front sheet slides off the one behind it.
export function Copy({ className }: Props) {
  return (
    <svg {...svg} className={`ic ${className ?? ""}`}>
      <path d="M168 168h48V40H88v48" />
      <rect className="ic-copy-front" x="40" y="88" width="128" height="128" />
    </svg>
  );
}

// The two links pull apart.
export function Link({ className }: Props) {
  return (
    <svg {...svg} className={`ic ${className ?? ""}`}>
      <path d="M96 160l64-64" />
      <path className="ic-link-a" d="M112 76l28.28-28.28a48 48 0 0 1 67.88 67.88L180 144" />
      <path className="ic-link-b" d="M144 180l-28.28 28.28a48 48 0 0 1-67.88-67.88L76 112" />
    </svg>
  );
}

// Nodes pulse one after another, like a message passing along.
export function Share2({ className }: Props) {
  return (
    <svg {...svg} className={`ic ${className ?? ""}`}>
      <path d="M149.09 73.3l-58.18 37.4M90.91 145.3l58.18 37.4" />
      <circle className="ic-share-node" cx="64" cy="128" r="32" />
      <circle className="ic-share-node" cx="176" cy="56" r="32" />
      <circle className="ic-share-node" cx="176" cy="200" r="32" />
    </svg>
  );
}

// Arrow steps out of the door.
export function LogOut({ className }: Props) {
  return (
    <svg {...svg} className={`ic ${className ?? ""}`}>
      <path d="M112 40H48v176h64" />
      <path className="ic-logout-arrow" d="M112 128h104m-40-40 40 40-40 40" />
    </svg>
  );
}

// Knobs slide along their tracks. Each track is one dashed line whose gap sits
// under the knob, so moving the dash offset moves the gap with it.
export function SlidersHorizontal({ className }: Props) {
  return (
    <svg {...svg} className={`ic ${className ?? ""}`}>
      <path className="ic-slider-a" d="M40 80h176" strokeDasharray="32 64 400" />
      <circle className="ic-slider-a" cx="104" cy="80" r="24" />
      <path className="ic-slider-b" d="M40 176h176" strokeDasharray="96 64 400" />
      <circle className="ic-slider-b" cx="168" cy="176" r="24" />
    </svg>
  );
}

// Bars shorten and spring back one after another.
export function Menu({ className }: Props) {
  return (
    <svg {...svg} className={`ic ${className ?? ""}`}>
      <path className="ic-menu-bar" d="M40 64h176" />
      <path className="ic-menu-bar" d="M40 128h176" />
      <path className="ic-menu-bar" d="M40 192h176" />
    </svg>
  );
}

// Lens snaps like a shutter.
export function Instagram({ className }: Props) {
  return (
    <svg {...svg} className={`ic ${className ?? ""}`}>
      <rect x="32" y="32" width="192" height="192" rx="48" />
      <circle className="ic-insta-lens" cx="128" cy="128" r="40" />
      <circle cx="180" cy="76" r="12" fill="currentColor" stroke="none" />
    </svg>
  );
}
