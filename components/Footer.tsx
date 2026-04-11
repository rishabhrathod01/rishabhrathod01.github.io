import { Github, Linkedin, Twitter, Instagram, Mail } from "lucide-react";
import { personalInfo } from "@/lib/data";
import { TrackedLink } from "@/components/TrackedLink";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="font-semibold mb-3">Rishabh Rathod</h3>
            <p className="text-sm text-muted-foreground">
              Staff Frontend Engineer passionate about building efficient
              developer tools and user-friendly applications.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <TrackedLink
                  href="/projects"
                  gaLabel="Projects"
                  gaLocation="footer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Projects
                </TrackedLink>
              </li>
              <li>
                <TrackedLink
                  href="/blog"
                  gaLabel="Blog"
                  gaLocation="footer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Blog
                </TrackedLink>
              </li>
              <li>
                <TrackedLink
                  href="/travel"
                  gaLabel="Travel Stories"
                  gaLocation="footer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Travel Stories
                </TrackedLink>
              </li>
              <li>
                <TrackedLink
                  href="/about"
                  gaLabel="About"
                  gaLocation="footer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  About
                </TrackedLink>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-semibold mb-3">Connect</h3>
            <div className="flex space-x-4">
              <TrackedLink
                href={personalInfo.social.github}
                target="_blank"
                rel="noopener noreferrer"
                gaLabel="GitHub"
                gaLocation="footer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </TrackedLink>
              <TrackedLink
                href={personalInfo.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                gaLabel="LinkedIn"
                gaLocation="footer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </TrackedLink>
              <TrackedLink
                href={personalInfo.social.twitter}
                target="_blank"
                rel="noopener noreferrer"
                gaLabel="Twitter"
                gaLocation="footer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </TrackedLink>
              <TrackedLink
                href={personalInfo.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                gaLabel="Instagram"
                gaLocation="footer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </TrackedLink>
              <TrackedLink
                href={`mailto:${personalInfo.email}`}
                gaLabel="Email"
                gaLocation="footer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </TrackedLink>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {currentYear} Rishabh Rathod. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
