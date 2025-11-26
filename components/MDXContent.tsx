import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import rehypeRaw from 'rehype-raw';
import 'highlight.js/styles/github-dark.css';

const components = {
  h1: (props: any) => (
    <h1 className="text-4xl font-bold mt-8 mb-4" {...props} />
  ),
  h2: (props: any) => (
    <h2 className="text-3xl font-bold mt-6 mb-3" {...props} />
  ),
  h3: (props: any) => (
    <h3 className="text-2xl font-semibold mt-4 mb-2" {...props} />
  ),
  p: (props: any) => <p className="mb-4 leading-7" {...props} />,
  ul: (props: any) => (
    <ul className="list-disc list-inside mb-4 space-y-2" {...props} />
  ),
  ol: (props: any) => (
    <ol className="list-decimal list-inside mb-4 space-y-2" {...props} />
  ),
  li: (props: any) => <li className="ml-4" {...props} />,
  a: (props: any) => (
    <a
      className="text-primary hover:underline"
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    />
  ),
  blockquote: (props: any) => (
    <blockquote
      className="border-l-4 border-primary pl-4 italic my-4"
      {...props}
    />
  ),
  code: (props: any) => {
    const { children, className, ...rest } = props;
    const isInline = !className;

    if (isInline) {
      return (
        <code
          className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono"
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
      className="bg-muted p-4 rounded-lg overflow-x-auto mb-4 text-sm"
      {...props}
    />
  ),
  img: (props: any) => (
    <img className="rounded-lg my-4" {...props} alt={props.alt || ''} />
  ),
  hr: () => <hr className="my-8 border-border" />,
  table: (props: any) => (
    <div className="overflow-x-auto my-4">
      <table className="w-full border-collapse" {...props} />
    </div>
  ),
  th: (props: any) => (
    <th
      className="border border-border px-4 py-2 bg-muted font-semibold text-left"
      {...props}
    />
  ),
  td: (props: any) => (
    <td className="border border-border px-4 py-2" {...props} />
  ),
};

export function MDXContent({ source }: { source: string }) {
  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
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
