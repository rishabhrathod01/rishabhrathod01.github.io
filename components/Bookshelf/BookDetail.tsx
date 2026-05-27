"use client";

import { X, ExternalLink, Star } from "lucide-react";
import { GoodreadsBook, getBookColor } from "@/lib/goodreads";
import { useEffect } from "react";

interface BookDetailProps {
  book: GoodreadsBook;
  onClose: () => void;
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#039;/g, "'").trim();
}

export default function BookDetail({ book, onClose }: BookDetailProps) {
  const spineColor = getBookColor(book.title);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return null;
    return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  const shelfLabel =
    book.shelf === "currently-reading"
      ? "Currently Reading"
      : book.shelf === "read"
        ? "Read"
        : "Want to Read";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative bg-background rounded-xl shadow-2xl max-w-lg w-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Colored top bar matching book color */}
        <div style={{ height: 6, background: spineColor }} />

        <div className="p-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex gap-5">
            {/* Cover */}
            <div className="flex-shrink-0">
              {book.coverImage && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={book.coverImage}
                  alt={book.title}
                  width={90}
                  height={135}
                  className="rounded shadow-md object-cover"
                  style={{ width: 90, height: 135 }}
                />
              )}
              {!book.coverImage && (
                <div
                  style={{
                    width: 90,
                    height: 135,
                    background: spineColor,
                    borderRadius: 4,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 11,
                    color: "rgba(255,255,255,0.85)",
                    fontWeight: 600,
                    textAlign: "center",
                    padding: 8,
                  }}
                >
                  {book.title}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="mb-1">
                <span
                  className="text-xs font-medium px-2 py-0.5 rounded-full"
                  style={{
                    background: spineColor + "22",
                    color: spineColor,
                    border: `1px solid ${spineColor}44`,
                  }}
                >
                  {shelfLabel}
                </span>
              </div>

              <h2 className="text-lg font-bold leading-snug mt-2 mb-1">
                {book.title}
              </h2>
              <p className="text-muted-foreground text-sm mb-3">{book.author}</p>

              {book.userRating > 0 && (
                <div className="flex items-center gap-1 mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-3.5 h-3.5"
                      style={{
                        fill: i < book.userRating ? "#f59e0b" : "none",
                        color: i < book.userRating ? "#f59e0b" : "#d1d5db",
                      }}
                    />
                  ))}
                  <span className="text-xs text-muted-foreground ml-1">my rating</span>
                </div>
              )}

              <div className="space-y-0.5 text-xs text-muted-foreground">
                {book.numPages > 0 && (
                  <p>{book.numPages.toLocaleString()} pages</p>
                )}
                {book.yearPublished && <p>Published {book.yearPublished}</p>}
                {book.dateRead && formatDate(book.dateRead) && (
                  <p>Read {formatDate(book.dateRead)}</p>
                )}
                {book.averageRating > 0 && (
                  <p>
                    Avg rating:{" "}
                    <span className="text-amber-500">
                      {book.averageRating.toFixed(2)}
                    </span>
                  </p>
                )}
              </div>
            </div>
          </div>

          {book.description && (
            <div className="mt-5 pt-4 border-t">
              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-5">
                {stripHtml(book.description)}
              </p>
            </div>
          )}

          {book.userReview && (
            <div className="mt-3">
              <p className="text-xs font-semibold mb-1">My review</p>
              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4">
                {stripHtml(book.userReview)}
              </p>
            </div>
          )}

          {book.link && (
            <div className="mt-5">
              <a
                href={book.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                View on Goodreads
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
