"use client";

import Link from "next/link";
import { Github, ExternalLink, Mail } from "lucide-react";
import { flight, saveSession, startRace, useDroneStore } from "../store";
import type { FlightContent } from "../types";
import { getFocusLink, getFocusLinkLabel } from "@/lib/drone/focus-links";
import { RACE_RINGS, RACE_TIME_LIMIT } from "@/lib/drone/layout";
import { engineAudio } from "@/lib/drone/audio";
import InstagramEmbed from "./InstagramEmbed";

// Focus mode: paragraphs never render in 3D
// — when the player opens a board,
// the full content slides in as a DOM glass card over the canvas.
export default function FocusPanel({
  content,
  onNavigate,
}: {
  content: FlightContent;
  onNavigate: (href: string) => void;
}) {
  const focus = useDroneStore((s) => s.focus);
  const setFocus = useDroneStore((s) => s.setFocus);
  const setPhase = useDroneStore((s) => s.setPhase);
  const raceStatus = useDroneStore((s) => s.raceStatus);
  if (!focus) return null;

  const isRaceBriefing = focus.id === "race-challenge";
  const openLink = isRaceBriefing ? null : getFocusLink(focus.id, content);
  const openLabel = isRaceBriefing ? null : getFocusLinkLabel(focus.id, content);
  const canStartRace = isRaceBriefing && raceStatus !== "running";

  const close = () => {
    setFocus(null);
    setPhase("flight");
  };

  const open = () => {
    if (!openLink) return;
    const st = useDroneStore.getState();
    saveSession({
      cells: st.cells,
      pos: [flight.pos.x, flight.pos.y, flight.pos.z],
      heading: flight.heading,
      inFlight: true,
    });
    onNavigate(openLink);
  };

  const startChallenge = () => {
    if (!canStartRace) return;
    startRace();
    engineAudio.playCollect();
    close();
  };

  return (
    <div className="absolute inset-y-0 right-0 flex items-center pr-6 md:pr-12 pointer-events-none">
      <div className="glass-card rounded-2xl p-8 w-[380px] md:w-[440px] max-h-[80vh] overflow-y-auto pointer-events-auto backdrop-blur-xl bg-surface/80 animate-in slide-in-from-right duration-300">
        <PanelBody id={focus.id} content={content} />
        <div className="mt-8 flex flex-col gap-3">
          {canStartRace && (
            <button
              onClick={startChallenge}
              className="w-full px-4 py-2.5 bg-gold text-surface rounded-xl font-jetbrains text-xs tracking-widest font-bold transition-opacity hover:opacity-90"
            >
              [ENTER] START CHALLENGE
            </button>
          )}
          {openLink && openLabel && (
            <button
              onClick={open}
              className="w-full px-4 py-2.5 bg-primary text-on-primary-dark rounded-xl font-jetbrains text-xs tracking-widest font-bold transition-opacity hover:opacity-90"
            >
              [ENTER] {openLabel}
            </button>
          )}
          <button
            onClick={close}
            className="w-full px-4 py-2.5 border border-white/10 hover:border-primary rounded-xl font-jetbrains text-xs tracking-widest text-on-surface transition-colors"
          >
            [E] RESUME FLIGHT
          </button>
        </div>
      </div>
    </div>
  );
}

function Micro({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-jetbrains text-[10px] tracking-widest uppercase text-primary mb-2">
      {children}
    </p>
  );
}

function PanelBody({ id, content }: { id: string; content: FlightContent }) {
  const { personal, experience, projects, blogs, travel, videos } = content;

  if (id.startsWith("video-")) {
    const video = videos.find((v) => v.id === id);
    if (!video) return null;
    return (
      <div>
        <Micro>DRONE FOOTAGE / {video.platform.toUpperCase()}</Micro>
        <h3 className="font-geist text-2xl font-semibold text-on-surface mb-1">
          {video.title}
        </h3>
        <p className="text-slate-muted text-sm mb-4">{video.caption}</p>
        {video.platform === "youtube" && video.youtubeId ? (
          <div className="aspect-video rounded-xl overflow-hidden mb-4 bg-black">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&rel=0`}
              title={video.videoTitle}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        ) : (
          <InstagramEmbed url={video.url} />
        )}
        <a
          href={video.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-on-surface hover:text-primary flex items-center gap-1.5 font-jetbrains text-xs"
        >
          <ExternalLink className="h-3.5 w-3.5" />{" "}
          {video.platform === "youtube" ? "Watch on YouTube" : "View on Instagram"}
        </a>
      </div>
    );
  }

  if (id === "race-challenge") {
    const timeLabel = `${Math.floor(RACE_TIME_LIMIT / 60)}:${String(RACE_TIME_LIMIT % 60).padStart(2, "0")}`;
    return (
      <div>
        <Micro>ISLAND TIME TRIAL</Micro>
        <h3 className="font-geist text-2xl font-semibold text-on-surface mb-3">
          Ring Challenge
        </h3>
        <p className="text-slate-muted text-sm leading-relaxed mb-4">
          Fly through all {RACE_RINGS.length} gold rings before the timer hits{" "}
          {timeLabel}. The route tours the island — bookshelf grove, experience
          trail, Blog Hill, Mandalpatti Peak, the pond waterfall, project
          billboards, and Vagator Beach — before looping back to the finish
          ring near the helipad.
        </p>
        <ul className="space-y-2 text-sm text-on-surface-variant">
          <li className="flex gap-2">
            <span className="text-gold shrink-0">▸</span>
            Rings stay hidden until you confirm with Enter
          </li>
          <li className="flex gap-2">
            <span className="text-gold shrink-0">▸</span>
            Pass each ring in order for checkpoint points
          </li>
          <li className="flex gap-2">
            <span className="text-gold shrink-0">▸</span>
            Finish under time for a speed bonus
          </li>
        </ul>
      </div>
    );
  }

  if (id === "about") {
    return (
      <div>
        <Micro>PILOT PROFILE</Micro>
        <h3 className="font-geist text-2xl font-semibold text-on-surface mb-1">
          {personal.name}
        </h3>
        <p className="text-primary font-geist mb-4">{personal.role}</p>
        <p className="text-slate-muted text-sm leading-relaxed mb-4">
          {personal.aboutLong}
        </p>
        <p className="font-jetbrains text-xs text-slate-muted mb-4">
          📍 {personal.location}
        </p>
        <div className="flex gap-4 font-jetbrains text-xs">
          <a href={personal.social.github} target="_blank" rel="noopener noreferrer" className="text-on-surface hover:text-primary flex items-center gap-1.5">
            <Github className="h-3.5 w-3.5" /> GitHub
          </a>
          <a href={`mailto:${personal.email}`} className="text-on-surface hover:text-primary flex items-center gap-1.5">
            <Mail className="h-3.5 w-3.5" /> Email
          </a>
        </div>
      </div>
    );
  }

  if (id.startsWith("exp-")) {
    const exp = experience[Number(id.slice(4))];
    if (!exp) return null;
    return (
      <div>
        <Micro>{exp.period}</Micro>
        <h3 className="font-geist text-2xl font-semibold text-on-surface mb-1">
          {exp.position}
        </h3>
        <p className="text-primary font-geist mb-4">{exp.company}</p>
        <p className="text-slate-muted text-sm leading-relaxed mb-4">
          {exp.description}
        </p>
        <ul className="space-y-2.5">
          {exp.achievements.map((a, i) => (
            <li key={i} className="text-sm text-on-surface-variant leading-relaxed flex gap-2">
              <span className="text-emerald shrink-0 mt-0.5">▸</span> {a}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (id.startsWith("proj-")) {
    const proj = projects[Number(id.slice(5))];
    if (!proj) return null;
    return (
      <div>
        <Micro>FEATURED PROJECT</Micro>
        <h3 className="font-geist text-2xl font-semibold text-on-surface mb-3">
          {proj.title}
        </h3>
        <p className="text-slate-muted text-sm leading-relaxed mb-4">
          {proj.description}
        </p>
        <div className="flex flex-wrap gap-2 mb-5">
          {proj.tags.map((tag) => (
            <span key={tag} className="px-2 py-1 bg-surface-container rounded font-jetbrains text-[10px] text-emerald uppercase tracking-widest border border-white/10">
              {tag}
            </span>
          ))}
        </div>
        <div className="flex gap-3 font-jetbrains text-xs">
          {proj.githubUrl && (
            <a href={proj.githubUrl} target="_blank" rel="noopener noreferrer" className="px-3 py-2 border border-white/10 hover:border-primary rounded-lg text-on-surface flex items-center gap-2">
              <Github className="h-3.5 w-3.5" /> CODE
            </a>
          )}
          {proj.liveUrl && (
            <a href={proj.liveUrl} target="_blank" rel="noopener noreferrer" className="px-3 py-2 border border-white/10 hover:border-primary rounded-lg text-on-surface flex items-center gap-2">
              <ExternalLink className="h-3.5 w-3.5" /> DEMO
            </a>
          )}
        </div>
      </div>
    );
  }

  if (id === "blogs") {
    return (
      <div>
        <Micro>RECENT WRITING</Micro>
        <h3 className="font-geist text-2xl font-semibold text-on-surface mb-4">
          From the Blog
        </h3>
        <ul className="space-y-4">
          {blogs.map((b) => (
            <li key={b.slug}>
              <Link href={`/blog/${b.slug}`} className="group block">
                <p className="text-on-surface group-hover:text-primary text-sm font-medium transition-colors">
                  {b.title}
                </p>
                <p className="font-jetbrains text-[10px] text-slate-muted mt-1">
                  {b.date} · {b.readingTime}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (id === "travel") {
    return (
      <div>
        <Micro>TRAVEL LOG</Micro>
        <h3 className="font-geist text-2xl font-semibold text-on-surface mb-4">
          Stories from the Road
        </h3>
        <ul className="space-y-4">
          {travel.map((s) => (
            <li key={s.slug}>
              <Link href={`/travel/${s.slug}`} className="group block">
                <p className="text-on-surface group-hover:text-primary text-sm font-medium transition-colors">
                  {s.title}
                </p>
                <p className="font-jetbrains text-[10px] text-slate-muted mt-1">
                  {s.location}, {s.country} · {s.date}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (id === "hidden") {
    return (
      <div>
        <Micro>ALL CELLS COLLECTED</Micro>
        <h3 className="font-geist text-2xl font-semibold text-on-surface mb-3">
          Batteries full — let&apos;s build something.
        </h3>
        <p className="text-slate-muted text-sm leading-relaxed mb-5">
          You explored the whole island. That&apos;s the kind of curiosity I
          love working with. Get in touch — I&apos;m always open to new
          projects and ideas.
        </p>
        <a
          href={`mailto:${personal.email}`}
          className="inline-flex items-center gap-2 px-5 py-3 bg-primary text-on-primary-dark rounded-xl font-geist font-bold text-sm"
        >
          Get in Touch <Mail className="h-4 w-4" />
        </a>
      </div>
    );
  }

  return null;
}
