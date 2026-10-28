import type { Metadata } from "next";
import FlyClient from "@/components/drone/FlyClient";
import { buildFlightContent } from "@/lib/flight-content";

export const metadata: Metadata = {
  title: "Fly",
  description:
    "Fly a DJI Mini 4 Pro over an island built from my projects, posts, and drone videos.",
};

// Server component: assembles the drone-experience content at build time
// (static export — there is no runtime server to fetch from).
export default async function FlyPage() {
  const flightContent = await buildFlightContent();
  return <FlyClient flightContent={flightContent} />;
}
