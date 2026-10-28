import { Github, Linkedin, Twitter, Instagram } from "@/components/icons";
import { personalInfo } from "@/lib/data";
import { TrackedLink } from "@/components/TrackedLink";

const links = [
  { name: "Projects", href: "/projects" },
  { name: "Blog", href: "/blog" },
  { name: "Travel", href: "/travel" },
  { name: "Bookshelf", href: "/bookshelf" },
  { name: "Tools", href: "/tools" },
  { name: "Fly", href: "/fly" },
];

const socials = [
  { label: "GitHub", href: personalInfo.social.github, Icon: Github },
  { label: "LinkedIn", href: personalInfo.social.linkedin, Icon: Linkedin },
  { label: "X", href: personalInfo.social.twitter, Icon: Twitter },
  { label: "Instagram", href: personalInfo.social.instagram, Icon: Instagram },
];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line">
      <div className="mx-auto flex max-w-container-max flex-col gap-8 px-4 py-12 md:flex-row md:items-center md:justify-between md:px-6">
        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold">
          {links.map((link) => (
            <TrackedLink
              key={link.href}
              href={link.href}
              gaLabel={link.name}
              gaLocation="footer"
              className="text-slate-muted transition-colors hover:text-on-surface"
            >
              {link.name}
            </TrackedLink>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          {socials.map(({ label, href, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="text-slate-muted transition-colors hover:text-on-surface"
            >
              <Icon className="h-5 w-5" />
            </a>
          ))}
        </div>
      </div>
      <div className="mx-auto max-w-container-max px-4 pb-12 md:px-6">
        <p className="font-jetbrains text-sm text-fg-3">
          &copy; {new Date().getFullYear()} Rishabh Rathod · Bengaluru
        </p>
      </div>
    </footer>
  );
}
