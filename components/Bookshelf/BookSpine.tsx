"use client";

import { GoodreadsBook, getBookColor, getBookHeight } from "@/lib/goodreads";

interface BookSpineProps {
  book: GoodreadsBook;
  onClick: (book: GoodreadsBook) => void;
  dimmed?: boolean;
}

export default function BookSpine({ book, onClick, dimmed }: BookSpineProps) {
  const color = getBookColor(book.title);
  const height = getBookHeight(book.numPages);

  // Slightly lighter shade for the spine highlight
  const highlightColor = color + "cc";

  return (
    <div
      onClick={() => onClick(book)}
      title={`${book.title} — ${book.author}`}
      className="relative cursor-pointer select-none flex-shrink-0 group"
      style={{
        width: 26,
        height,
        opacity: dimmed ? 0.65 : 1,
        transition: "transform 0.18s ease, opacity 0.18s ease",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.transform =
          "translateY(-10px) scale(1.04)";
        (e.currentTarget as HTMLElement).style.zIndex = "10";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.transform = "";
        (e.currentTarget as HTMLElement).style.zIndex = "";
      }}
    >
      {/* Book body */}
      <div
        className="w-full h-full relative overflow-hidden"
        style={{
          background: `linear-gradient(to right, ${color}dd 0%, ${color} 15%, ${color} 85%, ${color}99 100%)`,
          borderRadius: "1px 2px 2px 1px",
          boxShadow:
            "inset -3px 0 6px rgba(0,0,0,0.3), inset 2px 0 4px rgba(255,255,255,0.08), 2px 0 4px rgba(0,0,0,0.35)",
        }}
      >
        {/* Spine decorative line at top and bottom */}
        <div
          className="absolute top-0 left-0 right-0"
          style={{ height: 3, background: "rgba(255,255,255,0.15)" }}
        />
        <div
          className="absolute bottom-0 left-0 right-0"
          style={{ height: 3, background: "rgba(0,0,0,0.2)" }}
        />

        {/* Title text — vertical */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ padding: "8px 4px" }}
        >
          <span
            style={{
              writingMode: "vertical-rl",
              textOrientation: "mixed",
              transform: "rotate(180deg)",
              fontSize: 9,
              fontWeight: 700,
              color: "rgba(255,255,255,0.92)",
              lineHeight: 1.1,
              letterSpacing: "0.02em",
              maxHeight: height - 20,
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: 1,
              WebkitBoxOrient: "vertical",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {book.title}
          </span>
        </div>
      </div>

      {/* Tooltip on hover */}
      <div
        className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-xs rounded-md shadow-lg px-2 py-1.5 whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50 border"
        style={{ maxWidth: 200 }}
      >
        <p className="font-semibold truncate">{book.title}</p>
        <p className="text-muted-foreground truncate">{book.author}</p>
        {book.userRating > 0 && (
          <p className="text-amber-500 text-[10px] mt-0.5">
            {"★".repeat(book.userRating)}
          </p>
        )}
      </div>
    </div>
  );
}
