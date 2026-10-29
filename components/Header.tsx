"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, Moon, Sun, X } from "@/components/icons";
import { cn } from "@/lib/utils";
import { personalInfo } from "@/lib/data";

const navigation = [
  { name: "Projects", href: "/projects" },
  { name: "Blog", href: "/blog" },
  { name: "Travel", href: "/travel" },
  { name: "About", href: "/about" },
  { name: "Fly", href: "/fly" },
];

function ThemeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {}
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
      className="grid h-9 w-9 place-items-center rounded-lg text-slate-muted transition-colors hover:bg-surface-container hover:text-on-surface active:scale-[0.98]"
    >
      {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  );
}

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isActive = (href: string) => pathname.startsWith(href);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <header className="sticky top-3 z-50 px-4 md:px-6">
      <nav className="mx-auto flex max-w-container-max items-center justify-between rounded-xl border border-line bg-surface/85 py-2 pl-4 pr-2 backdrop-blur-xl">
        <Link
          href="/"
          className="text-base font-bold text-on-surface"
          onClick={() => setOpen(false)}
        >
          Rishabh Rathod
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={cn(
                "rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors",
                isActive(item.href)
                  ? "bg-surface-container text-on-surface"
                  : "text-slate-muted hover:text-on-surface"
              )}
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-1">
          <ThemeToggle />
          <a
            href={personalInfo.social.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden rounded-lg bg-on-surface px-3 py-2 text-sm font-semibold text-surface transition-opacity hover:opacity-85 active:scale-[0.98] md:inline-flex"
          >
            Say hello
          </a>
          <button
            className="grid h-9 w-9 place-items-center rounded-lg text-on-surface md:hidden"
            onClick={() => setOpen(!open)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="fixed inset-x-0 bottom-0 top-[72px] z-40 bg-surface px-4 pt-8 md:hidden">
          <ul className="space-y-2">
            {[{ name: "Home", href: "/" }, ...navigation].map((item, i) => (
              <li
                key={item.href}
                className="animate-[rise_400ms_cubic-bezier(0.22,1,0.36,1)_both]"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "block py-2 text-4xl font-bold",
                    (item.href === "/" ? pathname === "/" : isActive(item.href))
                      ? "text-on-surface"
                      : "text-fg-3"
                  )}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
          <a
            href={personalInfo.social.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex rounded-lg bg-on-surface px-3 py-2 text-base font-semibold text-surface"
          >
            Say hello
          </a>
        </div>
      )}
    </header>
  );
}
