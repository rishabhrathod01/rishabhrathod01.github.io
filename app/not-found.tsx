"use client";

import Link from "next/link";
import { Home, ArrowLeft } from "@/components/icons";

const btnPrimary =
  "inline-flex items-center gap-2 rounded-lg bg-on-surface px-3 py-2 text-base font-semibold text-surface transition-opacity hover:opacity-85 active:scale-[0.98]";
const btnSecondary =
  "inline-flex items-center gap-2 rounded-lg border border-line px-3 py-2 text-base font-semibold text-on-surface transition-colors hover:bg-surface-container active:scale-[0.98]";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-[760px] px-4 pb-24 pt-24 md:px-6 md:pt-32">
      <p className="eyebrow">Error 404</p>
      <h1 className="text-gradient mt-4 max-w-[680px] text-5xl font-bold leading-none md:text-6xl">
        This page does not exist
      </h1>
      <p className="mt-6 max-w-[680px] text-lg text-slate-muted">
        It may have moved, or the link has a typo.
      </p>
      <div className="mt-8 flex flex-wrap gap-2">
        <Link href="/" className={btnPrimary}>
          <Home className="h-4 w-4" />
          Go to the home page
        </Link>
        <button
          type="button"
          onClick={() => window.history.back()}
          className={btnSecondary}
        >
          <ArrowLeft className="h-4 w-4" />
          Go back
        </button>
      </div>
    </div>
  );
}
