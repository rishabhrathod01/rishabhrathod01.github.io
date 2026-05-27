"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  GoodreadsBook,
  GoodreadsData,
  STORAGE_KEY,
  syncGoodreads,
} from "@/lib/goodreads";
import VirtualRoom from "./VirtualRoom";
import ConnectPrompt from "./ConnectPrompt";
import BookDetail from "./BookDetail";
import ShareModal from "./ShareModal";
import SharedReadView from "./SharedReadView";

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

export default function BookshelfClient() {
  const searchParams = useSearchParams();
  const sharedUserId = searchParams.get("user");

  // ── Shared / read-only view state ───────────────────────────────────────────
  const [viewData, setViewData] = useState<GoodreadsData | null>(null);
  const [viewLoading, setViewLoading] = useState(false);
  const [viewError, setViewError] = useState<string | null>(null);

  // ── Own bookshelf state ─────────────────────────────────────────────────────
  const [data, setData] = useState<GoodreadsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedBook, setSelectedBook] = useState<GoodreadsBook | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [showShare, setShowShare] = useState(false);

  // ── Hydration: load own data from localStorage ──────────────────────────────
  useEffect(() => {
    setHydrated(true);
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setData(JSON.parse(raw) as GoodreadsData);
    } catch {
      // corrupted storage — ignore
    }
  }, []);

  // ── Shared view: fetch when ?user= param is present ─────────────────────────
  useEffect(() => {
    if (!sharedUserId) return;
    setViewLoading(true);
    setViewError(null);
    syncGoodreads(sharedUserId)
      .then(setViewData)
      .catch((e) => {
        const msg = e instanceof Error ? e.message : "Unknown error";
        setViewError(
          `Could not load this bookshelf. Make sure the shelves are public. (${msg})`
        );
      })
      .finally(() => setViewLoading(false));
  }, [sharedUserId]);

  // ── Own-shelf handlers ──────────────────────────────────────────────────────
  const handleConnect = async (input: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await syncGoodreads(input);
      setData(result);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(result));
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Unknown error";
      setError(
        `Could not sync Goodreads. Make sure your shelves are public and the ID is correct. (${msg})`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSync = () => {
    if (data?.userId) handleConnect(data.userId);
  };

  const handleDisconnect = () => {
    localStorage.removeItem(STORAGE_KEY);
    setData(null);
    setError(null);
  };

  // ── Shared view ─────────────────────────────────────────────────────────────
  if (sharedUserId) {
    if (viewLoading) return <LoadingShelf />;
    if (viewError) {
      return (
        <div
          className="min-h-screen flex items-center justify-center p-8"
          style={{ background: "linear-gradient(160deg, #F0E8DC 0%, #E8DDD0 100%)" }}
        >
          <div className="text-center max-w-sm">
            <p className="text-base font-semibold mb-2" style={{ color: "#3D2B1F" }}>
              Couldn&apos;t load this bookshelf
            </p>
            <p className="text-sm" style={{ color: "#8B6245" }}>{viewError}</p>
          </div>
        </div>
      );
    }
    if (viewData) return <SharedReadView data={viewData} />;
    return <LoadingShelf />;
  }

  // ── Own-shelf view ──────────────────────────────────────────────────────────
  if (!hydrated) return <LoadingShelf />;

  return (
    <>
      {data ? (
        <VirtualRoom
          data={data}
          onBookClick={setSelectedBook}
          onSync={handleSync}
          onDisconnect={handleDisconnect}
          syncing={loading}
          onShare={() => setShowShare(true)}
        />
      ) : (
        <ConnectPrompt
          onConnect={handleConnect}
          loading={loading}
          error={error}
        />
      )}

      {selectedBook && (
        <BookDetail book={selectedBook} onClose={() => setSelectedBook(null)} />
      )}

      {showShare && data && (
        <ShareModal
          userId={data.userId}
          username={data.username}
          onClose={() => setShowShare(false)}
        />
      )}
    </>
  );
}
