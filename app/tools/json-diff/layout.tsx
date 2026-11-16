import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JSON Diff",
  description:
    "Compare two JSON objects in the browser. Keys are sorted before diffing.",
};

export default function JsonDiffLayout({ children }: { children: React.ReactNode }) {
  return children;
}
