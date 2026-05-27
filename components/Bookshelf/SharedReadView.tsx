"use client";

import Link from "next/link";
import { BookOpen, ArrowRight } from "lucide-react";
import { GoodreadsBook, GoodreadsData } from "@/lib/goodreads";
import VirtualRoom from "./VirtualRoom";
import BookDetail from "./BookDetail";
import { useState } from "react";

interface SharedReadViewProps {
  data: GoodreadsData;
}

export default function SharedReadView({ data }: SharedReadViewProps) {
  const [selectedBook, setSelectedBook] = useState<GoodreadsBook | null>(null);

  return (
    <>
      {/* Banner */}
      <div
        className="sticky top-0 z-40 flex items-center justify-between px-4 py-2.5 text-sm"
        style={{
          background: "rgba(44, 24, 16, 0.95)",
          backdropFilter: "blur(8px)",
          borderBottom: "1px solid rgba(196, 149, 90, 0.3)",
          color: "#F0E8DC",
        }}
      >
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 flex-shrink-0" style={{ color: "#C4955A" }} />
          <span>
            You&apos;re viewing{" "}
            <span className="font-semibold" style={{ color: "#C4955A" }}>
              {data.username}&apos;s
            </span>{" "}
            bookshelf &mdash; read only
          </span>
        </div>
        <Link
          href="/bookshelf"
          className="flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-full transition-opacity hover:opacity-80 flex-shrink-0 ml-4"
          style={{ background: "rgba(196,149,90,0.2)", border: "1px solid rgba(196,149,90,0.5)", color: "#C4955A" }}
        >
          Connect your own
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <VirtualRoom
        data={data}
        onBookClick={setSelectedBook}
        onSync={() => {}}
        onDisconnect={() => {}}
        syncing={false}
        readOnly
      />

      {selectedBook && (
        <BookDetail book={selectedBook} onClose={() => setSelectedBook(null)} />
      )}
    </>
  );
}
