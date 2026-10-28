import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import rehypeRaw from "rehype-raw";

// Monochrome syntax palette from theme tokens, so code reads in light and dark
// (replaces the dark-only github-dark hljs theme).
const syntax = [
  "[&_.hljs-keyword]:font-semibold [&_.hljs-keyword]:text-on-surface",
  "[&_.hljs-built_in]:font-semibold [&_.hljs-built_in]:text-on-surface",
  "[&_.hljs-literal]:font-semibold [&_.hljs-literal]:text-on-surface",
  "[&_.hljs-title]:font-semibold [&_.hljs-title]:text-on-surface",
  "[&_.hljs-section]:font-semibold [&_.hljs-section]:text-on-surface",
  "[&_.hljs-selector-tag]:font-semibold [&_.hljs-selector-tag]:text-on-surface",
  "[&_.hljs-name]:font-semibold [&_.hljs-name]:text-on-surface",
  "[&_.hljs-string]:text-slate-muted [&_.hljs-regexp]:text-slate-muted",
  "[&_.hljs-attr]:text-slate-muted [&_.hljs-attribute]:text-slate-muted",
  "[&_.hljs-number]:text-slate-muted [&_.hljs-type]:text-slate-muted",
  "[&_.hljs-comment]:text-fg-3 [&_.hljs-meta]:text-fg-3 [&_.hljs-quote]:text-fg-3",
  "[&_.hljs-deletion]:text-fg-3 [&_.hljs-deletion]:line-through",
  "[&_.hljs-addition]:font-semibold [&_.hljs-addition]:text-on-surface",
].join(" ");

const components = {
  h1: (props: any) => (
    <h1
      className="mb-4 mt-12 scroll-mt-28 text-4xl font-bold text-on-surface"
      {...props}
    />
  ),
  h2: (props: any) => (
    <h2
      className="mb-4 mt-12 scroll-mt-28 text-3xl font-bold text-on-surface"
      {...props}
    />
  ),
  h3: (props: any) => (
    <h3
      className="mb-2 mt-8 scroll-mt-28 text-2xl font-bold text-on-surface"
      {...props}
    />
  ),
  h4: (props: any) => (
    <h4
      className="mb-2 mt-8 scroll-mt-28 text-xl font-bold text-on-surface"
      {...props}
    />
  ),
  p: (props: any) => <p className="mb-6" {...props} />,
  strong: (props: any) => (
    <strong className="font-bold text-on-surface" {...props} />
  ),
  ul: (props: any) => (
    <ul className="mb-6 list-disc space-y-2 pl-6 marker:text-fg-3" {...props} />
  ),
  ol: (props: any) => (
    <ol
      className="mb-6 list-decimal space-y-2 pl-6 marker:text-fg-3"
      {...props}
    />
  ),
  li: (props: any) => <li className="pl-1" {...props} />,
  a: (props: any) => (
    <a
      className="font-semibold text-on-surface underline decoration-fg-3 underline-offset-4 transition-colors hover:decoration-on-surface"
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    />
  ),
  blockquote: (props: any) => (
    <blockquote
      className="my-8 rounded-xl border border-line bg-surface-container p-6 text-slate-muted [&>p:last-child]:mb-0"
      {...props}
    />
  ),
  code: (props: any) => {
    const { children, className, ...rest } = props;
    const isInline = !className;

    if (isInline) {
      return (
        <code
          className="rounded border border-line bg-surface-container px-1.5 py-0.5 font-jetbrains text-[0.875em]"
          {...rest}
        >
          {children}
        </code>
      );
    }

    return (
      <code className={className} {...rest}>
        {children}
      </code>
    );
  },
  pre: (props: any) => (
    <pre
      className={`my-8 overflow-x-auto rounded-xl border border-line bg-surface-container p-4 font-jetbrains text-sm leading-6 text-on-surface ${syntax}`}
      {...props}
    />
  ),
  img: (props: any) => (
    <img
      className="my-8 rounded-2xl border border-line"
      {...props}
      alt={props.alt || ""}
    />
  ),
  iframe: (props: any) => {
    const { className, ...rest } = props;
    return (
      <div className="relative my-8 aspect-video w-full overflow-hidden rounded-2xl border border-line bg-surface-container">
        <iframe
          {...rest}
          className={`absolute inset-0 h-full w-full ${className || ""}`}
          title={rest.title || "Embedded video"}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    );
  },
  hr: () => <hr className="my-12 border-line" />,
  table: (props: any) => (
    <div className="my-8 overflow-x-auto rounded-xl border border-line">
      <table className="w-full border-collapse text-base" {...props} />
    </div>
  ),
  th: (props: any) => (
    <th
      className="border-b border-line bg-surface-container px-4 py-2 text-left font-bold text-on-surface"
      {...props}
    />
  ),
  td: (props: any) => (
    <td className="border-t border-line px-4 py-2" {...props} />
  ),
};

export function MDXContent({ source }: { source: string }) {
  return (
    <div className="text-lg leading-7 text-on-surface">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeHighlight, rehypeSlug]}
        components={components}
      >
        {source}
      </ReactMarkdown>
    </div>
  );
}
