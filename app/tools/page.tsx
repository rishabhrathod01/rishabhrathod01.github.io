import Link from "next/link";
import { ArrowRight } from "lucide-react";

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
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <h1 className="text-3xl font-bold mb-2">Tools</h1>
      <p className="text-muted-foreground mb-10">
        Small utilities I built for everyday use.
      </p>
      <div className="flex flex-col gap-4">
        {tools.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="group flex items-start justify-between rounded-lg border p-5 hover:bg-muted/40 transition-colors"
          >
            <div>
              <h2 className="font-semibold mb-1">{tool.name}</h2>
              <p className="text-sm text-muted-foreground">{tool.description}</p>
            </div>
            <ArrowRight className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground group-hover:text-foreground transition-colors" />
          </Link>
        ))}
      </div>
    </div>
  );
}
