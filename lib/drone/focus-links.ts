import type { FlightContent } from "@/components/drone/types";

/** Primary outbound link for a focus board (matches the 3D banner teaser). */
export function getFocusLink(id: string, content: FlightContent): string | null {
  const { personal, projects, blogs, travel } = content;

  // Videos play inline in the focus panel — no [ENTER] navigate-away button.
  if (id.startsWith("video-")) return null;

  if (id === "about") return "/about";

  if (id === "blogs") {
    const post = blogs[0];
    return post ? `/blog/${post.slug}` : "/blog";
  }

  if (id === "travel") {
    const story = travel[0];
    return story ? `/travel/${story.slug}` : "/travel";
  }

  if (id.startsWith("proj-")) {
    const proj = projects[Number(id.slice(5))];
    if (!proj) return null;
    return proj.liveUrl || proj.githubUrl || null;
  }

  if (id === "hidden") return `mailto:${personal.email}`;

  return null;
}

/** Short HUD / button copy for the focus-panel Enter action. */
export function getFocusLinkLabel(id: string, content: FlightContent): string | null {
  const href = getFocusLink(id, content);
  if (!href) return null;

  if (id === "about") return "OPEN /ABOUT";

  if (id === "blogs") {
    const title = content.blogs[0]?.title;
    return title ? `OPEN — ${truncate(title, 36)}` : "OPEN BLOG";
  }

  if (id === "travel") {
    const title = content.travel[0]?.title;
    return title ? `OPEN — ${truncate(title, 36)}` : "OPEN STORY";
  }

  if (id.startsWith("proj-")) {
    const proj = content.projects[Number(id.slice(5))];
    if (!proj) return null;
    if (proj.liveUrl) return `OPEN — ${truncate(proj.title, 36)}`;
    if (proj.githubUrl) return "VIEW CODE";
    return null;
  }

  if (id === "hidden") return "GET IN TOUCH";

  return "OPEN LINK";
}

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1).trimEnd()}…`;
}
