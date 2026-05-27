import { Github, Linkedin, Twitter, Instagram } from "lucide-react";
import { personalInfo } from "@/lib/data";
import { TrackedLink } from "@/components/TrackedLink";

const quickLinks = [
  { name: "Home", href: "/" },
  { name: "Projects", href: "/projects" },
  { name: "Blog", href: "/blog" },
  { name: "Travel", href: "/travel" },
  { name: "Bookshelf", href: "/bookshelf" },
  { name: "About", href: "/about" },
];

const shelfBooks = [
  { title: "Clean Code", author: "Robert C. Martin" },
  { title: "Pragmatic Programmer", author: "Andrew Hunt" },
  { title: "Atomic Habits", author: "James Clear" },
];

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-surface-container-lowest py-section-gap">
      <div className="max-w-container-max mx-auto px-4 md:px-gutter">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div className="space-y-6">
            <p className="font-geist text-xl font-semibold text-on-surface">
              Rishabh Rathod
            </p>
            <p className="text-slate-muted text-sm max-w-xs leading-relaxed">
              Staff Frontend Engineer passionate about building efficient
              developer tools and user-friendly applications.
            </p>
            <div className="flex gap-4">
              <a
                href={personalInfo.social.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="text-slate-muted hover:text-emerald transition-colors"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href={personalInfo.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="text-slate-muted hover:text-emerald transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href={personalInfo.social.twitter}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="text-slate-muted hover:text-emerald transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href={personalInfo.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-slate-muted hover:text-emerald transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-jetbrains text-xs font-semibold tracking-widest uppercase text-primary mb-6">
              Quick Links
            </h4>
            <ul className="space-y-4">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <TrackedLink
                    href={link.href}
                    gaLabel={link.name}
                    gaLocation="footer"
                    className="text-slate-muted hover:text-emerald transition-colors flex items-center gap-2 group text-sm"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-white/10 group-hover:bg-emerald transition-all" />
                    {link.name}
                  </TrackedLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Books on shelf */}
          <div>
            <h4 className="font-jetbrains text-xs font-semibold tracking-widest uppercase text-primary mb-6">
              Books on My Shelf
            </h4>
            <p className="text-slate-muted text-sm italic mb-4 font-serif">
              &ldquo;Craftsmanship over convenience.&rdquo;
            </p>
            <ul className="space-y-4">
              {shelfBooks.map((book) => (
                <li key={book.title} className="text-sm">
                  <span className="text-on-surface">{book.title}</span>
                  <span className="text-slate-muted italic"> — {book.author}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-jetbrains text-xs text-slate-muted">
            &copy; {new Date().getFullYear()} Rishabh Rathod. Built with
            precision.
          </p>
          <p className="font-jetbrains text-xs text-slate-muted">
            v1.2.0-stable
          </p>
        </div>
      </div>
    </footer>
  );
}
