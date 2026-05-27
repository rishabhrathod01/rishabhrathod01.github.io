"use client";

import { useState } from "react";
import { X, Copy, Check, Link2, Share2 } from "lucide-react";

interface ShareModalProps {
  userId: string;
  username: string;
  onClose: () => void;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border transition-all hover:opacity-80 flex-shrink-0"
      style={{
        background: copied ? "rgba(34,197,94,0.1)" : "rgba(255,255,255,0.8)",
        borderColor: copied ? "#22c55e" : "#C4955A",
        color: copied ? "#15803d" : "#5C3D28",
      }}
    >
      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

export default function ShareModal({ userId, username, onClose }: ShareModalProps) {
  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/bookshelf?user=${userId}`
      : `/bookshelf?user=${userId}`;

  const handleNativeShare = () => {
    navigator.share({
      title: `${username}'s Bookshelf`,
      text: `Check out ${username}'s bookshelf!`,
      url: shareUrl,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      <div
        className="relative bg-background rounded-xl shadow-2xl w-full max-w-md overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Warm top accent */}
        <div style={{ height: 4, background: "linear-gradient(to right, #C4955A, #8B6245)" }} />

        <div className="p-6">
          <div className="flex items-start justify-between mb-5">
            <div>
              <h2 className="text-base font-bold">Share your Bookshelf</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Anyone with this link can view your books (read-only)
              </p>
            </div>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors ml-4">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Share URL */}
          <div className="mb-5">
            <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
              Share link
            </p>
            <div className="flex items-center gap-2">
              <div
                className="flex-1 flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-mono"
                style={{ background: "var(--muted)", minWidth: 0 }}
              >
                <Link2 className="w-3 h-3 flex-shrink-0 text-muted-foreground" />
                <span className="truncate text-muted-foreground">{shareUrl}</span>
              </div>
              <CopyButton text={shareUrl} />
            </div>
          </div>

          {/* Native Share (mobile) */}
          {typeof navigator !== "undefined" && "share" in navigator && (
            <button
              onClick={handleNativeShare}
              className="flex items-center gap-2 w-full justify-center px-4 py-2.5 rounded-lg text-sm font-medium transition-opacity hover:opacity-90"
              style={{ background: "#2C1810", color: "#F0E8DC" }}
            >
              <Share2 className="w-4 h-4" />
              Share via…
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
