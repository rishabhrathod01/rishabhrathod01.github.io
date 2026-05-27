import { Metadata } from "next";
import { Suspense } from "react";
import BookshelfClient from "@/components/Bookshelf/BookshelfClient";

export const metadata: Metadata = {
  title: "Bookshelf",
  description:
    "My virtual bookshelf — books I'm reading, have read, and want to read, synced from Goodreads.",
};

function LoadingShelf() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "linear-gradient(160deg, #F0E8DC 0%, #E8DDD0 100%)" }}
    >
      <div className="w-6 h-6 border-2 border-muted-foreground/30 border-t-muted-foreground rounded-full animate-spin" />
    </div>
  );
}

export default function BookshelfPage() {
  return (
    <Suspense fallback={<LoadingShelf />}>
      <BookshelfClient />
    </Suspense>
  );
}
