"use client";

import { GoodreadsBook, GoodreadsData } from "@/lib/goodreads";
import BookSpine from "./BookSpine";
import { RefreshCw, LogOut, Share2 } from "lucide-react";

interface VirtualRoomProps {
  data: GoodreadsData;
  onBookClick: (book: GoodreadsBook) => void;
  onSync: () => void;
  onDisconnect: () => void;
  syncing: boolean;
  readOnly?: boolean;
  onShare?: () => void;
}

const BOOKS_PER_ROW = 22;

function splitIntoRows<T>(arr: T[], size: number): T[][] {
  const rows: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    rows.push(arr.slice(i, i + size));
  }
  return rows;
}

// ─── Shelf plank (the horizontal wood divider between rows) ───────────────────
const ShelfPlank = ({ rounded = "" }: { rounded?: string }) => (
  <div
    style={{
      height: 14,
      background: "linear-gradient(180deg, #D4A86A 0%, #C4955A 30%, #A07240 75%, #C4955A 100%)",
      boxShadow: "0 4px 10px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.15)",
      flexShrink: 0,
      borderRadius: rounded,
    }}
  />
);

// ─── Section label pill + arrow (shown to the left of a shelf row) ───────────
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-1.5" style={{ whiteSpace: "nowrap" }}>
      <span
        style={{
          background: "rgba(255,255,255,0.88)",
          border: "1px solid rgba(0,0,0,0.1)",
          borderRadius: 20,
          padding: "3px 10px",
          backdropFilter: "blur(4px)",
          color: "#5C3D28",
          fontSize: 11,
          fontWeight: 600,
          boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
        }}
      >
        {children}
      </span>
      {/* Arrow → shelf */}
      <svg width="20" height="10" viewBox="0 0 20 10" fill="none">
        <line x1="0" y1="5" x2="14" y2="5" stroke="rgba(92,61,40,0.4)" strokeWidth="1" />
        <polyline points="10,1 15,5 10,9" stroke="rgba(92,61,40,0.4)" strokeWidth="1" fill="none" />
      </svg>
    </div>
  );
}

// ─── A single row of book spines sitting on a shelf ──────────────────────────
interface ShelfRowProps {
  books: GoodreadsBook[];
  onBookClick: (book: GoodreadsBook) => void;
  minHeight?: number;
  dimmed?: boolean;
}

function ShelfRow({ books, onBookClick, minHeight = 170, dimmed }: ShelfRowProps) {
  return (
    <div
      style={{
        minHeight,
        background: "#3A2214",
        display: "flex",
        alignItems: "flex-end",
        padding: "6px 8px 0",
        gap: 2,
        opacity: dimmed ? 0.72 : 1,
        overflowX: "auto",
      }}
    >
      {books.map((book) => (
        <BookSpine key={book.id} book={book} onClick={onBookClick} />
      ))}
      {books.length === 0 && (
        <span
          style={{
            fontSize: 11,
            color: "rgba(255,255,255,0.18)",
            margin: "auto",
            paddingBottom: 12,
          }}
        >
          no books here
        </span>
      )}
    </div>
  );
}

// ─── Decorative knick-knacks on top of the bookshelf ─────────────────────────
function DecorativeTop() {
  return (
    <div
      className="flex items-end gap-4 px-6 py-2"
      style={{
        height: 58,
        // top corners match the outer frame's 8 px radius so no clipping needed
        borderRadius: "7px 7px 0 0",
        background: "linear-gradient(180deg, #5C3D28 0%, #4A2C1A 100%)",
      }}
    >
      {/* Pencil cup */}
      <div className="flex items-end gap-0.5" style={{ height: 40 }}>
        {[
          { h: 30, c: "#E74C3C" },
          { h: 38, c: "#3498DB" },
          { h: 25, c: "#F39C12" },
        ].map((p, i) => (
          <div key={i} style={{ width: 5, height: p.h, background: p.c, borderRadius: "2px 2px 0 0" }} />
        ))}
        <div style={{ width: 14, height: 22, background: "#7D9B6A", borderRadius: 2, marginLeft: 2 }} />
      </div>

      {/* Small plant */}
      <div className="flex flex-col items-center">
        <div style={{ width: 22, height: 18, background: "#2D6A4F", borderRadius: "50% 50% 20% 20%", marginBottom: -4 }} />
        <div style={{ width: 10, height: 14, background: "#7A5235", borderRadius: "0 0 2px 2px" }} />
      </div>

      {/* Cactus */}
      <div className="relative" style={{ width: 18, height: 40, marginBottom: 0 }}>
        <div style={{ position: "absolute", left: 5, top: 0, width: 8, height: 30, background: "#4A7C59", borderRadius: 4 }} />
        <div style={{ position: "absolute", left: -1, top: 10, width: 7, height: 12, background: "#4A7C59", borderRadius: 4 }} />
        <div style={{ position: "absolute", right: -1, top: 14, width: 7, height: 10, background: "#4A7C59", borderRadius: 4 }} />
        <div style={{ position: "absolute", bottom: 0, left: 2, width: 14, height: 10, background: "#8B6245", borderRadius: 2 }} />
      </div>

      {/* Robot figurine */}
      <div className="flex flex-col items-center" style={{ gap: 1 }}>
        <div style={{ width: 22, height: 16, background: "#E74C3C", borderRadius: 3, display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
          <div style={{ width: 5, height: 5, background: "#fff", borderRadius: "50%" }} />
          <div style={{ width: 5, height: 5, background: "#fff", borderRadius: "50%" }} />
        </div>
        <div style={{ width: 24, height: 18, background: "#C0392B", borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: 10, height: 4, background: "#E74C3C", borderRadius: 1 }} />
        </div>
      </div>

      {/* Framed heart picture */}
      <div style={{ width: 28, height: 36, background: "#F4D03F", borderRadius: 2, padding: 3, boxShadow: "0 2px 4px rgba(0,0,0,0.3)" }}>
        <div style={{ width: "100%", height: "100%", background: "#F8C8D0", borderRadius: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: 12, height: 10, background: "#E91E63", clipPath: "polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)" }} />
        </div>
      </div>

      <div className="flex-1" />

      {/* Stacked books on the right */}
      <div className="flex flex-col-reverse items-start" style={{ gap: 1 }}>
        {[{ w: 36, c: "#1B4F72" }, { w: 32, c: "#6C3483" }, { w: 40, c: "#A0522D" }].map((b, i) => (
          <div key={i} style={{ width: b.w, height: 10, background: b.c, borderRadius: 1, boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1)" }} />
        ))}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function VirtualRoom({ data, onBookClick, onSync, onDisconnect, syncing, readOnly = false, onShare }: VirtualRoomProps) {
  const currentlyReading = data.books.filter((b) => b.shelf === "currently-reading");
  const read = data.books.filter((b) => b.shelf === "read");
  const toRead = data.books.filter((b) => b.shelf === "to-read");

  const readRows = read.length > 0 ? splitIntoRows(read, BOOKS_PER_ROW) : [[]];
  const toReadRows = toRead.length > 0 ? splitIntoRows(toRead, BOOKS_PER_ROW) : [[]];

  const lastSynced = new Date(data.lastSynced).toLocaleDateString("en-US", {
    month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
  });

  // Each section is [label, rows[], dimmed]
  type Section = { label: string; rows: GoodreadsBook[][]; dimmed?: boolean; minHeight?: number };
  const sections: Section[] = [
    { label: `currently reading · ${currentlyReading.length}`, rows: [currentlyReading], minHeight: 175 },
    { label: `read · ${read.length}`, rows: readRows },
    { label: `want to read · ${toRead.length}`, rows: toReadRows, dimmed: true, minHeight: 155 },
  ];

  return (
    <div
      className="min-h-screen py-10 px-4"
      style={{ background: "linear-gradient(160deg, #F0E8DC 0%, #E8DDD0 100%)" }}
    >
      {/* ── Page header ── */}
      <div className="max-w-5xl mx-auto mb-8">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: "#3D2B1F" }}>
              {data.username ? `${data.username}'s Bookshelf` : "My Bookshelf"}
            </h1>
            <p className="text-sm mt-1" style={{ color: "#8B6245" }}>
              {data.books.length} books &middot; synced from Goodreads
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-xs" style={{ color: "#A07850" }}>Synced {lastSynced}</span>
            {!readOnly && (
              <>
                <button
                  onClick={onSync}
                  disabled={syncing}
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border transition-opacity hover:opacity-80 disabled:opacity-50"
                  style={{ background: "rgba(255,255,255,0.7)", borderColor: "#C4955A", color: "#5C3D28" }}
                >
                  <RefreshCw className={`w-3 h-3 ${syncing ? "animate-spin" : ""}`} />
                  {syncing ? "Syncing…" : "Sync"}
                </button>
                {onShare && (
                  <button
                    onClick={onShare}
                    className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border transition-opacity hover:opacity-80"
                    style={{ background: "rgba(255,255,255,0.7)", borderColor: "#C4955A", color: "#5C3D28" }}
                  >
                    <Share2 className="w-3 h-3" />
                    Share
                  </button>
                )}
                <button
                  onClick={onDisconnect}
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border transition-opacity hover:opacity-80"
                  style={{ background: "rgba(255,255,255,0.7)", borderColor: "#ccc", color: "#888" }}
                >
                  <LogOut className="w-3 h-3" />
                  Disconnect
                </button>
              </>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-8 mt-4">
          {[
            { label: "Reading now", count: currentlyReading.length },
            { label: "Read", count: read.length },
            { label: "Want to Read", count: toRead.length },
          ].map(({ label, count }) => (
            <div key={label}>
              <div className="text-2xl font-bold leading-none" style={{ color: "#3D2B1F" }}>{count}</div>
              <div className="text-xs mt-0.5" style={{ color: "#8B6245" }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Bookshelf ── */}
      <div className="max-w-5xl mx-auto">
        {/*
          Two-column layout:
            left col  = section labels (fixed 180px)
            right col = the wooden shelf unit
          Each section in the right col lines up with its label in the left col
          via CSS subgrid / matching structure.
        */}
        <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 0 }}>

          {/* ── Left: label column ── */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            {/* Spacer matching decorative top + first plank */}
            <div style={{ height: 58 + 14 }} />

            {sections.map((section, si) =>
              section.rows.map((_, ri) => (
                <div
                  key={`${si}-${ri}`}
                  style={{
                    minHeight: section.minHeight ?? 170,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    paddingRight: 12,
                    // Plank height below each row
                    paddingBottom: 14,
                  }}
                >
                  {ri === 0 && <SectionLabel>{section.label}</SectionLabel>}
                </div>
              ))
            )}
          </div>

          {/* ── Right: wooden shelf unit ── */}
          <div
            style={{
              background: "#2C1810",
              borderRadius: 8,
              boxShadow: "0 16px 64px rgba(0,0,0,0.35), inset 0 2px 0 rgba(255,255,255,0.04)",
              overflow: "hidden",   // keeps the rounded corners clipping content inside
            }}
          >
            <DecorativeTop />
            <ShelfPlank />

            {sections.map((section, si) =>
              section.rows.map((row, ri) => (
                <div key={`${si}-${ri}`}>
                  <ShelfRow
                    books={row}
                    onBookClick={onBookClick}
                    minHeight={section.minHeight}
                    dimmed={section.dimmed}
                  />
                  <ShelfPlank rounded={si === sections.length - 1 && ri === section.rows.length - 1 ? "0 0 6px 6px" : ""} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <p className="text-center text-xs mt-8" style={{ color: "#A07850" }}>
        Click any book spine to see details &middot; Data synced from your public Goodreads shelves
      </p>
    </div>
  );
}
