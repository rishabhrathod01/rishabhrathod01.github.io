"use client";

import { useState } from "react";
import { BookOpen, RefreshCw } from "lucide-react";

interface ConnectPromptProps {
  onConnect: (input: string) => void;
  loading: boolean;
  error: string | null;
}

export default function ConnectPrompt({
  onConnect,
  loading,
  error,
}: ConnectPromptProps) {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) onConnect(input.trim());
  };

  return (
    <div
      className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-16"
      style={{ background: "var(--room-bg, #f0ece6)" }}
    >
      {/* Bookshelf illustration */}
      <div className="mb-8 opacity-60">
        <div
          className="flex items-end gap-1"
          style={{ height: 80 }}
        >
          {["#8B3A3A", "#2D6A4F", "#1B4F72", "#6C3483", "#A0522D", "#2E4057", "#5D4037"].map(
            (color, i) => (
              <div
                key={i}
                style={{
                  width: 22,
                  height: 55 + (i % 3) * 14,
                  background: color,
                  borderRadius: "2px 2px 0 0",
                  boxShadow: "inset -3px 0 6px rgba(0,0,0,0.25)",
                }}
              />
            )
          )}
        </div>
        <div
          style={{
            height: 10,
            background:
              "linear-gradient(180deg, #C4955A, #A07240, #C4955A)",
            boxShadow: "0 3px 6px rgba(0,0,0,0.3)",
            borderRadius: 2,
          }}
        />
      </div>

      <BookOpen className="w-10 h-10 text-muted-foreground mb-4" />

      <h2 className="text-2xl font-bold mb-2 text-center">
        Connect your Goodreads
      </h2>
      <p className="text-muted-foreground text-center max-w-sm mb-8 text-sm leading-relaxed">
        Paste your Goodreads profile URL or user ID to sync your shelves and
        display them here as a virtual bookshelf.
      </p>

      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-3">
        <div>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="goodreads.com/user/show/12345678 or just 12345678"
            className="w-full px-4 py-2.5 text-sm rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            disabled={loading}
          />
        </div>

        {error && (
          <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Syncing shelves…
            </>
          ) : (
            "Sync Goodreads"
          )}
        </button>
      </form>

      <p className="mt-6 text-xs text-muted-foreground text-center max-w-xs">
        Your Goodreads shelves must be public. Data is stored locally in your
        browser and never sent to any server.
      </p>
    </div>
  );
}
