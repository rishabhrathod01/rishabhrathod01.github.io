import HomeClient from "@/components/home/HomeClient";
import { buildFlightContent } from "@/lib/flight-content";

// Server component: assembles the drone-experience content at build time
// (static export — there is no runtime server to fetch from).
export default async function HomePage() {
  const flightContent = await buildFlightContent();
  return <HomeClient flightContent={flightContent} />;
}
