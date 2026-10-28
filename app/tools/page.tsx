import Link from "next/link";
import { ArrowRight } from "@/components/icons";
import { Reveal } from "@/components/home/Reveal";

const tools = [
  {
    name: "JSON Diff",
    href: "/tools/json-diff",
    description:
      "Compare two JSON objects. Keys and arrays are sorted recursively before diffing so ordering differences don't pollute the output.",
  },
];

export default function ToolsPage() {
  return (
    <div className="mx-auto max-w-[760px] px-4 pb-24 pt-24 md:px-6 md:pt-32">
      <Reveal>
        <p className="eyebrow">Tools</p>
        <h1 className="text-gradient mt-4 max-w-[680px] text-5xl font-bold leading-none md:text-6xl">
          Small utilities
        </h1>
        <p className="mt-6 max-w-[680px] text-lg text-slate-muted">
          Things I built for everyday use. They run in your browser.
        </p>
      </Reveal>
      <div className="mt-16 flex flex-col gap-4">
        {tools.map((tool, i) => (
          <Reveal key={tool.href} delay={i * 0.06}>
            <Link
              href={tool.href}
              className="group flex items-start justify-between gap-4 rounded-2xl border border-line bg-surface-container p-6 transition-colors hover:bg-surface-container-high"
            >
              <div>
                <h2 className="text-xl font-bold text-on-surface">
                  {tool.name}
                </h2>
                <p className="mt-2 text-slate-muted">{tool.description}</p>
              </div>
              <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-slate-muted transition-transform group-hover:translate-x-1 group-hover:text-on-surface" />
            </Link>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
