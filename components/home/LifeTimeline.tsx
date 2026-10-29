"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "framer-motion";
import {
  Backpack,
  ChartLineUp,
  Cloud,
  Code,
  GraduationCap,
  House,
  Motorcycle,
  Mountains,
  Plant,
  Play,
  Radio,
  ShoppingCart,
  Sparkle,
  Tree,
} from "@phosphor-icons/react/ssr";
import { lifeEvents, reels, reelUrl, type LifeEvent, type LifeIcon } from "@/lib/data";
import { ArrowRight } from "@/components/icons";
import { ReelLink } from "@/components/ReelLink";

const MON = "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" ");

// Months since year 0. "present" is this month.
function months(d: string) {
  if (d === "present") {
    const now = new Date();
    return now.getFullYear() * 12 + now.getMonth();
  }
  const [y, m = 1] = d.split("-").map(Number);
  return y * 12 + m - 1;
}

function fmt(d: string) {
  if (d === "present") return "Present";
  const [y, m, day] = d.split("-");
  if (!m) return y;
  return `${MON[+m - 1]}${day ? ` ${+day}` : ""} ${y}`;
}

const year = (d: string) => (d === "present" ? "now" : d.slice(0, 4));

// Short date for the label on the road: years for a range, month for a point.
function shortDate({ start, end }: LifeEvent) {
  if (!start) return "";
  if (!end) return fmt(start);
  return year(start) === year(end) ? year(start) : `${year(start)} – ${year(end)}`;
}

const fullDate = ({ start, end }: LifeEvent) =>
  start ? (end ? `${fmt(start)} – ${fmt(end)}` : fmt(start)) : "";

const LW = 180; // label width
const LH = 56; // room for a label: date plus up to two lines of title
const GAP = 10; // gap between labels
// Desktop: the road sweeps back and forth across the page like a river.
// Each stretch's lean pulls its sweeps left or right.
const YEAR = 0.4; // road per year, as a share of the width
const EARLY = 2015; // years before this get a shorter scale
const EARLY_SCALE = 0.3; // that scale, as a share of the normal one
const TOP = 90; // room above the first dot
const SWING = 0.34; // share of the width a lean of 1 shifts the sweeps
const EDGE = 16; // closest the road gets to either side
const DS = 2; // sample step along the road
// Phones: the road sways down the left, years on its left, labels on its right.
const CX = 62;
const LEFT = 108;
const SWAY = 26; // how far a lean of 1 moves the phone road
const AFTER = 52; // room added after each event so phone dots never stack

type Pt = { x: number; y: number };
// `s` is the distance along the road; `nx`/`ny` the normal to it there.
type Spot = Pt & { s: number; nx: number; ny: number };
// Where an event's label sits. `lx`/`ly` is where its leader line meets it.
type Label = { left: number; top?: number; bottom?: number; lx: number; ly: number; lead: boolean };
// `band` is the road between start and end, for hovering a range.
type Placed = { e: LifeEvent; at: Spot; end?: Spot; band?: string; side: 1 | -1; label: Label };
type Tick = Spot & { year?: number };
type Box = { l: number; t: number; r: number; b: number };

// Repeatable "random" in [0, 1) so the road is uneven but the same every load.
const rnd = (k: number) => {
  const v = Math.sin(k * 12.9898) * 43758.5453;
  return v - Math.floor(v);
};

// The desktop road: sweeps that turn at uneven points on alternating sides,
// each a cubic that leaves and arrives heading down, so every turn is round.
// `leanAt(u)` (-1..1) shifts where the sweeps turn; where `quietAt(u)` (no
// events nearby) the sweeps run flatter and use the full width. Returned as samples every
// DS px of road, so a sample's index times DS is its distance along it.
function sweeps(
  w: number,
  length: number,
  leanAt: (u: number) => number,
  quietAt: (u: number) => boolean
): Pt[] {
  const dense: Pt[] = [{ x: EDGE + 12, y: TOP }];
  let run = 0;
  let side = 1; // which way the next sweep heads
  for (let k = 0; run < length + 4 * DS; k++) {
    const p = dense[dense.length - 1];
    const quiet = quietAt(run + w / 2);
    const jitter = quiet ? 0.9 + 0.1 * rnd(k + 1) : 0.6 + 0.4 * rnd(k + 1);
    // Strong leans make tighter, shallower sweeps inside their lane.
    const m0 = Math.abs(leanAt(run));
    const drop = (quiet ? 130 + 40 * rnd(k + 7) : 230 + 160 * rnd(k + 7)) * (1 - 0.35 * m0);
    const t = drop * 0.9;
    const at = (x: number, f: number) => {
      const g = 1 - f;
      return {
        x: (g * g * g + 3 * g * g * f) * p.x + (3 * g * f * f + f * f * f) * x,
        y: g * g * g * p.y + 3 * g * g * f * (p.y + t) + 3 * g * f * f * (p.y + drop - t) + f * f * f * (p.y + drop),
      };
    };
    // Each lean has a lane across the page: strong ones narrow and on their
    // side, none the full width.
    // The sweep turns at the edge of the lane it is in when it turns. Its
    // length depends on where it turns, so try every turn point and keep the
    // one closest to its own lane's edge.
    let x = p.x;
    let miss = Infinity;
    for (let cx = EDGE; cx <= w - EDGE; cx += 8) {
      let len = 0;
      for (let i = 1; i <= 24; i++) {
        const a = at(cx, (i - 1) / 24);
        const b = at(cx, i / 24);
        len += Math.hypot(b.x - a.x, b.y - a.y);
      }
      const lean = leanAt(run + len);
      const c = w / 2 + w * SWING * lean;
      const half = (w / 2 - EDGE) * jitter * (1 - 0.7 * Math.abs(lean));
      const want = Math.min(Math.max(c + side * half, EDGE), w - EDGE);
      if (Math.abs(cx - want) < miss) {
        miss = Math.abs(cx - want);
        x = cx;
      }
    }
    side = x > p.x ? -1 : 1;
    for (let i = 1; i <= 160; i++) {
      const q = at(x, i / 160);
      const prev = dense[dense.length - 1];
      run += Math.hypot(q.x - prev.x, q.y - prev.y);
      dense.push(q);
    }
  }
  // Resample evenly along the road.
  const pts: Pt[] = [dense[0]];
  let need = DS;
  for (let i = 1; i < dense.length; i++) {
    const a = dense[i - 1];
    const b = dense[i];
    const len = Math.hypot(b.x - a.x, b.y - a.y);
    let at = 0;
    while (len - at >= need) {
      at += need;
      pts.push({ x: a.x + ((b.x - a.x) * at) / len, y: a.y + ((b.y - a.y) * at) / len });
      need = DS;
    }
    need -= len - at;
  }
  return pts;
}

// The phone road: down the left, leaning a little with each stretch (eased
// so it flows), plus a slight sway of its own.
function phoneRoad(n: number, leanAt: (u: number) => number): Pt[] {
  let v = Array.from({ length: n }, (_, i) => leanAt(i * DS));
  const win = 30;
  for (let pass = 0; pass < 2; pass++)
    v = v.map((_, i) => {
      let sum = 0;
      for (let k = -win; k <= win; k++) sum += v[Math.min(Math.max(i + k, 0), n - 1)];
      return sum / (2 * win + 1);
    });
  return v.map((l, i) => ({
    x: CX + SWAY * l + 4 * Math.sin((2 * Math.PI * i * DS) / 300),
    y: 14 + i * DS,
  }));
}

const hit = (a: Box, b: Box, pad = 0) =>
  a.l < b.r + pad && b.l < a.r + pad && a.t < b.b + pad && b.t < a.b + pad;

// Time runs along the road at a fixed px per year (less before EARLY).
// Dots are never moved; each label takes the nearest free spot that does not
// cover the road or another label, with a thin leader line back to its dot.
function layout(w: number, vertical: boolean) {
  const sorted = [...lifeEvents].sort(
    (a, b) => (a.start ? months(a.start) : -1) - (b.start ? months(b.start) : -1)
  );
  const dated = sorted.filter((e) => e.start).map((e) => months(e.start!));
  const m0 = sorted[0].start ? dated[0] : dated[0] - 12; // undated origin: a year early
  const mEnd = Math.max(...sorted.flatMap((e) => [e.start, e.end].filter(Boolean).map((d) => months(d!))));
  const ppm = (vertical ? 64 : YEAR * w) / 12;
  // Linear in time, except the early years run at a shorter scale.
  const mB = Math.max(m0, EARLY * 12);
  const ep = ppm * EARLY_SCALE;
  const uB = (mB - m0) * ep;
  const uLin = (m: number) => (m < mB ? (m - m0) * ep : uB + (m - mB) * ppm);
  // Phones: each event also adds a little room after it.
  const starts = sorted.filter((e) => e.start).map((e) => months(e.start!));
  const uOf = vertical
    ? (m: number) => uLin(m) + AFTER * starts.filter((st) => st < m).length
    : uLin;
  const mOf = (u: number) => {
    if (!vertical) return u < uB ? m0 + u / ep : mB + (u - uB) / ppm;
    let lo = m0;
    let hi = mEnd + 12;
    for (let k = 0; k < 30; k++) {
      const mid = (lo + hi) / 2;
      if (uOf(mid) < u) lo = mid;
      else hi = mid;
    }
    return lo;
  };
  const lastU = uOf(mEnd);

  // Lean spans: each period's lean, or each change within it, until the next
  // change or the period's end.
  const spans = lifeEvents.flatMap((e) => {
    if (e.lean === undefined || !e.start) return [];
    const stop = e.end ? months(e.end) : months(e.start) + 1;
    const steps = typeof e.lean === "number" ? [{ from: e.start, lean: e.lean }] : e.lean;
    return steps.map((st, i) => ({
      a: months(st.from),
      b: steps[i + 1] ? months(steps[i + 1].from) : stop,
      lean: st.lean,
    }));
  });
  // The lean of the latest span that covers the moment u along the road.
  const leanAt = (u: number) => {
    const m = mOf(u);
    let lean = 0;
    let from = -Infinity;
    for (const sp of spans)
      if (sp.a <= m && m < sp.b && sp.a > from) {
        lean = sp.lean;
        from = sp.a;
      }
    return lean;
  };
  // Quiet: no event starts or ends within a year of the moment u.
  const marks = lifeEvents.flatMap((e) => [e.start, e.end].filter(Boolean).map((d) => months(d!)));
  const quietAt = (u: number) => marks.every((m) => Math.abs(m - mOf(u)) > 12);
  // Samples of the road every DS px of time, with the length of road so far.
  const raw: Pt[] = vertical ? phoneRoad(Math.ceil(lastU / DS) + 2, leanAt) : sweeps(w, lastU, leanAt, quietAt);
  const n = raw.length;
  const pts: (Pt & { s: number })[] = [];
  for (const p of raw) {
    const q = pts[pts.length - 1];
    pts.push({ ...p, s: q ? q.s + Math.hypot(p.x - q.x, p.y - q.y) : 0 });
  }
  const spot = (u: number): Spot => {
    const i = Math.min(Math.floor(u / DS), n - 2);
    const f = u / DS - i;
    const a = pts[i];
    const b = pts[i + 1];
    const len = Math.hypot(b.x - a.x, b.y - a.y) || 1;
    return {
      x: a.x + (b.x - a.x) * f,
      y: a.y + (b.y - a.y) * f,
      s: a.s + (b.s - a.s) * f,
      nx: (b.y - a.y) / len,
      ny: -(b.x - a.x) / len,
    };
  };
  const end = spot(lastU);
  const last = Math.floor(lastU / DS);
  const d =
    pts.slice(0, last + 1).map((p, i) => `${i ? "L" : "M"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join("") +
    `L${end.x.toFixed(1)},${end.y.toFixed(1)}`;

  // Year ticks; every fifth year gets a number.
  const ticks: Tick[] = [];
  for (let y = Math.ceil(m0 / 12); y * 12 <= mEnd; y++) {
    const u = uOf(y * 12);
    if (u >= 0) ticks.push({ ...spot(u), year: y % 5 ? undefined : y });
  }

  let side: 1 | -1 = 1;
  let stackBottom = -Infinity;
  // Desktop obstacles: the road itself, year numbers, then each placed label.
  const road = pts.slice(0, last + 1).filter((_, i) => i % 2 === 0);
  const taken: Box[] = vertical
    ? []
    : ticks
        .filter((t) => t.year)
        .map((t) => {
          const x = t.x + t.nx * 14;
          const y = t.y + t.ny * 14;
          const l = Math.abs(t.nx) < 0.5 ? x - 15 : t.nx > 0 ? x : x - 30;
          return { l, t: y - 8, r: l + 30, b: y + 8 };
        });
  const onRoad = (bx: Box, pad: number) =>
    road.some((p) => p.x > bx.l - pad && p.x < bx.r + pad && p.y > bx.t - pad && p.y < bx.b + pad);
  // Does the segment from the dot to (x, y) run along or across the road?
  const crosses = (at: Pt, x: number, y: number) => {
    const n = Math.ceil(Math.hypot(x - at.x, y - at.y) / 4);
    for (let k = 0; k <= n; k++) {
      const px = at.x + ((x - at.x) * k) / n;
      const py = at.y + ((y - at.y) * k) / n;
      if (Math.hypot(px - at.x, py - at.y) < 16) continue;
      if (road.some((p) => Math.abs(p.x - px) < 3 && Math.abs(p.y - py) < 3)) return true;
    }
    return false;
  };

  const between = (a: number, b: number) =>
    [spot(a), ...pts.slice(Math.ceil(a / DS), Math.floor(b / DS) + 1), spot(b)]
      .map((p, i) => `${i ? "L" : "M"}${p.x.toFixed(1)},${p.y.toFixed(1)}`)
      .join("");

  const placed: Placed[] = sorted.map((e) => {
    const at = spot(uOf(e.start ? months(e.start) : m0));
    const endSpot = e.end ? spot(uOf(months(e.end))) : undefined;
    const band = e.end ? between(uOf(months(e.start!)), uOf(months(e.end))) : undefined;
    if (vertical) {
      // One column: a label never starts above the one before it ends.
      const top = Math.max(at.y - 9, stackBottom + 8);
      stackBottom = top + 40;
      return {
        e,
        at,
        end: endSpot,
        band,
        side: 1,
        label: { left: LEFT, top, lx: LEFT - 4, ly: top + 9, lead: top > at.y - 8 },
      };
    }
    let best: { cost: number; bx: Box; lx: number; ly: number; s: 1 | -1 } | null = null;
    for (let dx = -280; dx <= 280; dx += 20)
      for (let dy = -170; dy <= 170; dy += 10) {
        const s: 1 | -1 = dy < 0 ? -1 : 1;
        // The label's edge nearest the dot sits dy away from it.
        const t = s === 1 ? at.y + dy : at.y + dy - LH;
        const bx = { l: at.x + dx - LW / 2, t, r: at.x + dx + LW / 2, b: t + LH };
        if (Math.abs(dy) < 16 || bx.l < 0 || bx.r > w || bx.t < 0) continue;
        if (taken.some((o) => hit(o, bx, GAP)) || onRoad(bx, 6)) continue;
        const lx = Math.min(Math.max(at.x, bx.l + 12), bx.r - 12);
        const ly = s === 1 ? bx.t : bx.b;
        const cost =
          Math.hypot(lx - at.x, (ly - at.y) * 1.5) +
          (crosses(at, lx, ly) ? 400 : 0) +
          (s === side ? 0 : 1);
        if (!best || cost < best.cost) best = { cost, bx, lx, ly, s };
      }
    // ponytail: no free spot within reach drops the label under the dot; widen
    // the search if a future crowd of events overflows.
    const b = best ?? {
      bx: { l: at.x - LW / 2, t: at.y + 16, r: at.x + LW / 2, b: at.y + 16 + LH },
      lx: at.x,
      ly: at.y + 16,
      s: 1 as const,
    };
    taken.push(b.bx);
    side = b.s;
    return {
      e,
      at,
      end: endSpot,
      band,
      side: b.s,
      label: {
        left: b.bx.l,
        ...(b.s === 1 ? { top: b.bx.t } : { bottom: b.bx.b }),
        lx: b.lx,
        ly: b.ly,
        lead: Math.hypot(b.lx - at.x, b.ly - at.y) > 20,
      },
    };
  });

  const h = vertical
    ? Math.max(end.y, stackBottom) + 60
    : Math.max(end.y, ...taken.map((o) => o.b)) + 40;
  return { placed, ticks, d, total: end.s, h };
}

const link =
  "text-on-surface underline decoration-line underline-offset-4 transition-colors hover:decoration-on-surface";

const ICONS: Record<LifeIcon, typeof House> = {
  home: House,
  school: Backpack,
  college: GraduationCap,
  cart: ShoppingCart,
  radio: Radio,
  chart: ChartLineUp,
  code: Code,
  sparkle: Sparkle,
  bike: Motorcycle,
  plant: Plant,
  cloud: Cloud,
  mountain: Mountains,
  tree: Tree,
};

// The event's icon in a disc on the road. Work is filled.
function Dot({ e, x, y }: { e: LifeEvent; x: number; y: number }) {
  const fg = "rgb(var(--fg))";
  const bg = "rgb(var(--bg))";
  const Icon = ICONS[e.icon];
  const work = e.kind === "work";
  return (
    <g>
      <circle cx={x} cy={y} r={12} fill={work ? fg : bg} stroke={fg} strokeWidth={1.5} />
      <Icon x={x - 7} y={y - 7} size={14} weight="bold" color={work ? bg : fg} />
    </g>
  );
}

const hasImages = (e: LifeEvent) => !!e.links?.some((l) => l.image);
const cardWidth = (e: LifeEvent) =>
  e.video || hasImages(e) ? 340 : e.reels ? 280 : 300;

// Sits behind an embed so the card is never blank while it loads or if the
// embed is blocked.
function Fallback({ href, label }: { href: string; label: string }) {
  return (
    <span className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-sm text-slate-muted">
      Loading…
      <a href={href} target="_blank" rel="noopener noreferrer" className={link}>
        {label}
      </a>
    </span>
  );
}

// A YouTube video as its thumbnail; the player loads only on click.
function Video({ id, title }: { id: string; title: string }) {
  const [play, setPlay] = useState(false);
  if (play)
    return (
      <div className="relative mb-3 aspect-video w-full overflow-hidden rounded-lg bg-surface-container">
        <Fallback href={`https://youtu.be/${id}`} label="Watch on YouTube" />
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1`}
          title={title}
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          className="relative h-full w-full border-0"
        />
      </div>
    );
  return (
    <button
      type="button"
      onClick={() => setPlay(true)}
      aria-label={`Play video: ${title}`}
      className="group relative mb-3 block aspect-video w-full overflow-hidden rounded-lg bg-surface-container"
    >
      <Image
        src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
        alt=""
        fill
        sizes="340px"
        className="object-cover"
      />
      <span className="absolute inset-0 m-auto flex h-11 w-11 items-center justify-center rounded-full bg-black/70 text-white transition-transform group-hover:scale-110">
        <Play weight="fill" className="h-5 w-5" />
      </span>
    </button>
  );
}

// The card's content. Media is only rendered while the card is open.
function Card({ e, open }: { e: LifeEvent; open: boolean }) {
  const inlineReel = !e.video && e.reels?.[0];
  const reelLinks = (inlineReel ? e.reels?.slice(1) : e.reels) ?? [];
  return (
    <div className="rounded-2xl border border-line bg-surface p-4 text-left shadow-xl">
      {open && e.video && <Video id={e.video} title={e.title} />}
      {open && inlineReel && (
        <div className="relative mx-auto mb-3 h-[400px] w-[240px] overflow-hidden rounded-lg bg-surface-container">
          <Fallback href={reelUrl(reels[inlineReel])} label="Open on Instagram" />
          <iframe
            src={`${reelUrl(reels[inlineReel])}embed/`}
            title={`Instagram reel: ${reels[inlineReel].place}`}
            allow="autoplay; encrypted-media; picture-in-picture"
            className="relative block h-full w-full border-0"
          />
        </div>
      )}
      {e.start && <p className="eyebrow text-xs">{fullDate(e)}</p>}
      <h3 className="mt-1 text-base font-semibold text-on-surface">{e.title}</h3>
      <p className="mt-1 text-sm text-slate-muted">{e.summary}</p>
      {e.links && hasImages(e) && (
        <ul className="mt-3 grid grid-cols-2 gap-3 text-xs text-slate-muted">
          {e.links.map((l) => (
            <li key={l.href}>
              <a href={l.href} target="_blank" rel="noopener noreferrer" className="group block">
                <span className="relative mb-1.5 block aspect-[16/10] overflow-hidden rounded-lg bg-surface-container">
                  {open && l.image && (
                    <Image
                      src={l.image}
                      alt={l.label}
                      fill
                      sizes="160px"
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  )}
                </span>
                <span className={`text-sm ${link}`}>{l.label}</span>
              </a>
              {l.note && <span className="mt-0.5 block">{l.note}</span>}
            </li>
          ))}
        </ul>
      )}
      {e.links && !hasImages(e) && (
        <ul className="mt-3 space-y-1.5 text-sm text-slate-muted">
          {e.links.map((l) => (
            <li key={l.href}>
              <a href={l.href} target="_blank" rel="noopener noreferrer" className={link}>
                {l.label}
              </a>
              {l.note && `, ${l.note}`}
            </li>
          ))}
        </ul>
      )}
      {reelLinks.length > 0 && (
        <p className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-sm">
          {reelLinks.map((r) => (
            <ReelLink key={r} reel={reels[r]} className={link}>
              {reels[r].place}
            </ReelLink>
          ))}
        </p>
      )}
      {e.href && (
        <Link
          href={e.href}
          className={`mt-3 inline-flex items-center gap-1 text-sm font-medium ${link}`}
        >
          Read more <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      )}
    </div>
  );
}

// The life story as one road, to scale: the same length of road for every
// year. It draws itself as you scroll; events appear as the road reaches them.
// Hover, focus or tap an event (its label or its dot) for its card, which also
// lights up exactly the stretch of road it covers.
export function LifeTimeline() {
  const ref = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState({ w: 0, vertical: false });
  const [active, setActive] = useState<number | null>(null);
  // Where the open card sits, relative to its label.
  const [cardAt, setCardAt] = useState<{ left: number; top: number } | null>(null);
  const [reached, setReached] = useState(0);
  const reduce = useReducedMotion();
  const uid = useId();
  const hide = useRef<ReturnType<typeof setTimeout>>(undefined);
  const tap = useRef<{ type: string; wasOpen: boolean } | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 85%", "end 85%"],
  });

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () =>
      setBox({ w: el.clientWidth, vertical: window.innerWidth < 640 });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const lay = useMemo(
    () => (box.w ? layout(box.w, box.vertical) : null),
    [box.w, box.vertical]
  );

  const update = (v: number) => {
    if (!lay) return;
    const drawn = v * lay.total + 1;
    setReached(lay.placed.filter((pl) => pl.at.s <= drawn).length);
  };
  useMotionValueEvent(scrollYProgress, "change", update);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => update(scrollYProgress.get()), [lay]);

  // Open the card where it covers the least of the other labels and dots:
  // try spots around its label, stay on screen and inside the timeline, and
  // prefer spots close to the label.
  useLayoutEffect(() => {
    if (active === null || !lay || !ref.current) return;
    const li = document.getElementById(`${uid}-li-${active}`);
    const card = document.getElementById(`${uid}-${active}`);
    if (!li || !card) return;
    const r = li.getBoundingClientRect();
    const box = ref.current.getBoundingClientRect();
    const cw = card.offsetWidth;
    const ch = card.offsetHeight;
    const busy = [
      ...[...ref.current.querySelectorAll("li > button")].map((el) => el.getBoundingClientRect()),
      ...[...ref.current.querySelectorAll("[data-dot] circle")].map((el) => el.getBoundingClientRect()),
    ];
    const G = 8;
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    // Every spot on a 24px grid around the label, not overlapping it.
    const spots: { left: number; top: number }[] = [];
    for (let left = box.left; left <= box.right - cw; left += 24)
      for (let top = r.top - ch - 400; top <= r.bottom + 400; top += 24)
        if (left > r.right + G || left + cw < r.left - G || top > r.bottom + G || top + ch < r.top - G)
          spots.push({ left, top });
    let best = spots[0] ?? { left: r.left, top: r.bottom + G };
    let bestCost = Infinity;
    for (const sp of spots) {
      const left = Math.min(Math.max(sp.left, box.left), box.right - cw);
      const { top } = sp;
      let cost = 0;
      for (const o of busy) {
        const ox = Math.min(left + cw, o.right) - Math.max(left, o.left);
        const oy = Math.min(top + ch, o.bottom) - Math.max(top, o.top);
        if (ox > 0 && oy > 0) cost += 1000 + ox * oy;
      }
      const off = Math.max(0, 8 - top) + Math.max(0, top + ch - (window.innerHeight - 8));
      cost += off * 400 + Math.hypot(left + cw / 2 - cx, top + ch / 2 - cy);
      if (cost < bestCost) {
        bestCost = cost;
        best = { left, top };
      }
    }
    setCardAt({ left: best.left - r.left, top: best.top - r.top });
  }, [active, lay, uid, box.vertical]);

  // A tap anywhere else closes the open card.
  useEffect(() => {
    if (active === null) return;
    const close = (ev: PointerEvent) => {
      if (!(ev.target as Element).closest?.("[data-life-event]")) setActive(null);
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [active]);

  // While a card is open, another event takes over only if the pointer rests
  // on it, so crossing a dot or a stretch of road on the way into the card
  // does not swap it.
  const activeRef = useRef(active);
  activeRef.current = active;
  const pend = useRef<ReturnType<typeof setTimeout>>(undefined);
  const enter = (i: number) => (ev: React.PointerEvent) => {
    if (ev.pointerType !== "mouse") return;
    clearTimeout(pend.current);
    const swap = () => {
      clearTimeout(hide.current);
      setActive(i);
    };
    if (activeRef.current === null || activeRef.current === i) swap();
    else pend.current = setTimeout(swap, 200);
  };
  const leave = (i: number) => (ev: React.PointerEvent) => {
    if (ev.pointerType !== "mouse") return;
    clearTimeout(pend.current);
    if (activeRef.current === i)
      hide.current = setTimeout(() => setActive((a) => (a === i ? null : a)), 300);
  };

  // Touch: tapping a dot or a range toggles its card.
  const tapToggle = (i: number) => (ev: React.PointerEvent) => {
    if (ev.pointerType !== "mouse") setActive((a) => (a === i ? null : i));
  };

  const shown = (i: number) => reduce || i < reached || active === i;
  const dim = (i: number) => (active === null || active === i ? 1 : 0.35);
  const w = box.w;
  const vertical = box.vertical;
  const fg = "rgb(var(--fg))";

  return (
    <div ref={ref} className="relative" style={{ height: lay?.h ?? 1600 }}>
      {lay && (
        <svg
          aria-hidden
          width={w}
          height={lay.h}
          viewBox={`0 0 ${w} ${lay.h}`}
          className="pointer-events-none absolute inset-0 overflow-visible"
          fill="none"
          strokeLinecap="round"
        >
          <path d={lay.d} stroke="rgb(var(--line))" strokeWidth={2.5} />
          <motion.path
            d={lay.d}
            stroke="rgb(var(--fg-3))"
            strokeWidth={2.5}
            style={{ pathLength: reduce ? 1 : scrollYProgress }}
          />
          {/* The scale: a tick every year, a number every five. */}
          <g stroke="rgb(var(--fg-3))" strokeWidth={1}>
            {lay.ticks.map((t, i) => (
              <path
                key={i}
                d={
                  vertical
                    ? `M${t.x - 14},${t.y}h-5`
                    : `M${t.x + t.nx * 5},${t.y + t.ny * 5}l${t.nx * (t.year ? 6 : 4)},${t.ny * (t.year ? 6 : 4)}`
                }
              />
            ))}
          </g>
          <g
            fill="rgb(var(--fg-3))"
            className="font-jetbrains"
            fontSize={10}
          >
            {lay.ticks.map((t) =>
              t.year ? (
                <text
                  key={t.year}
                  textAnchor={
                    vertical || t.nx <= -0.5 ? "end" : t.nx < 0.5 ? "middle" : "start"
                  }
                  x={vertical ? t.x - 22 : t.x + t.nx * 14}
                  y={vertical ? t.y + 3.5 : t.y + t.ny * 14 + 3.5}
                >
                  {t.year}
                </text>
              ) : null
            )}
          </g>
          {lay.placed.map(({ at, end }, i) =>
            end ? (
              <g
                key={i}
                className="transition-opacity duration-500"
                opacity={!shown(i) ? 0 : active === null ? 0.3 : active === i ? 1 : 0.08}
              >
                <path
                  d={lay.d}
                  stroke={fg}
                  strokeWidth={6}
                  strokeDasharray={`${end.s - at.s} ${lay.total + 10}`}
                  strokeDashoffset={-at.s}
                />
                <path
                  d={`M${end.x - end.nx * 14},${end.y - end.ny * 14}l${end.nx * 28},${end.ny * 28}`}
                  stroke={fg}
                  strokeWidth={1.75}
                />
              </g>
            ) : null
          )}
          {/* Wide invisible strokes so a range answers anywhere along it. */}
          {lay.placed.map(({ band }, i) =>
            band && shown(i) ? (
              <path
                key={i}
                d={band}
                data-life-event
                stroke="transparent"
                strokeWidth={18}
                style={{ pointerEvents: "stroke", cursor: "pointer" }}
                onPointerEnter={enter(i)}
                onPointerLeave={leave(i)}
                onPointerUp={tapToggle(i)}
              />
            ) : null
          )}
          {lay.placed.map(({ e, at, side, label }, i) => (
            <g
              key={i}
              data-life-event
              data-dot
              className="pointer-events-auto cursor-pointer transition-opacity duration-500"
              opacity={shown(i) ? dim(i) : 0}
              onPointerEnter={enter(i)}
              onPointerLeave={leave(i)}
              onPointerUp={tapToggle(i)}
            >
              {label.lead && (
                <path
                  d={
                    vertical
                      ? `M${at.x + 12},${at.y}L${label.lx},${label.ly}`
                      : `M${at.x},${at.y + side * 12}L${label.lx},${label.ly}`
                  }
                  stroke="rgb(var(--fg-3))"
                  strokeWidth={1}
                  opacity={0.6}
                />
              )}
              <Dot e={e} x={at.x} y={at.y} />
            </g>
          ))}
        </svg>
      )}
      <ol className={lay ? "" : "invisible"}>
        {lay?.placed.map(({ e, label }, i) => {
          const open = active === i;
          const above = label.bottom !== undefined;
          const pos: React.CSSProperties = vertical
            ? { left: LEFT, top: label.top, width: w - LEFT }
            : {
                left: label.left,
                width: LW,
                ...(above ? { bottom: lay.h - label.bottom! } : { top: label.top }),
              };
          const cw = Math.min(cardWidth(e), w - (vertical ? LEFT : 0));
          return (
            <li
              key={i}
              id={`${uid}-li-${i}`}
              data-life-event
              style={pos}
              className={`absolute transition-opacity duration-700 ${
                shown(i) ? "opacity-100" : "pointer-events-none opacity-0"
              } ${open ? "z-20" : "z-10"}`}
              onPointerEnter={enter(i)}
              onPointerLeave={leave(i)}
              onFocus={() => setActive(i)}
              onBlur={(ev) => {
                if (!ev.currentTarget.contains(ev.relatedTarget))
                  setActive((a) => (a === i ? null : a));
              }}
              onKeyDown={(ev) => ev.key === "Escape" && setActive(null)}
            >
              <button
                type="button"
                aria-expanded={open}
                aria-controls={`${uid}-${i}`}
                onPointerDown={(ev) => {
                  tap.current = { type: ev.pointerType, wasOpen: open };
                }}
                onClick={() => {
                  const t = tap.current;
                  tap.current = null;
                  if (t?.type === "mouse") return;
                  if (t) setActive(t.wasOpen ? null : i);
                  else setActive((a) => (a === i ? null : i));
                }}
                className={`block w-full rounded-md px-1 ${
                  vertical ? "text-left" : "text-center"
                } focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-on-surface`}
              >
                {e.start && (
                  <span className="block font-jetbrains text-xs text-fg-3">
                    {shortDate(e)}
                  </span>
                )}
                <span className="block text-sm font-semibold leading-snug text-on-surface">
                  {e.title}
                </span>
              </button>
              <div
                id={`${uid}-${i}`}
                hidden={!open}
                style={{ left: cardAt?.left ?? 0, top: cardAt?.top ?? 0, width: cw }}
                className="absolute"
              >
                <Card e={e} open={open} />
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
