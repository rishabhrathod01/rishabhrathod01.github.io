"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { personalInfo } from "@/lib/data";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Projects", href: "/projects" },
  { name: "Blog", href: "/blog" },
  { name: "Travel", href: "/travel" },
  { name: "About", href: "/about" },
];

export function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-surface/80 backdrop-blur-xl">
      <nav className="max-w-container-max mx-auto px-4 md:px-gutter flex h-20 items-center justify-between">
        <Link
          href="/"
          className="font-geist text-lg font-semibold text-on-surface tracking-tight"
        >
          Rishabh Rathod
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative text-sm transition-colors duration-200 pb-1",
                pathname === item.href
                  ? "text-primary font-semibold after:content-[''] after:absolute after:-bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:bg-primary after:rounded-full"
                  : "text-slate-muted hover:text-on-surface"
              )}
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <a
            href={`mailto:${personalInfo.email}`}
            className="hidden md:inline-flex items-center px-5 py-2 bg-primary text-on-primary-dark rounded-full font-jetbrains text-xs font-semibold tracking-widest uppercase transition-all hover:shadow-[0_0_20px_rgba(192,193,255,0.3)] active:scale-95"
          >
            Get in Touch
          </a>

          <button
            className="md:hidden text-on-surface p-1"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-surface-container-low">
          <div className="max-w-container-max mx-auto px-4 py-4 space-y-3">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "block py-2 text-sm font-medium transition-colors",
                  pathname === item.href
                    ? "text-primary"
                    : "text-slate-muted hover:text-on-surface"
                )}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <a
              href={`mailto:${personalInfo.email}`}
              className="block py-2 text-sm font-jetbrains font-semibold tracking-wider uppercase text-primary"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Get in Touch
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
