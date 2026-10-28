export default function Loading() {
  return (
    <div className="mx-auto max-w-container-max px-4 pb-24 pt-24 md:px-6 md:pt-32">
      <div className="animate-pulse">
        <div className="h-4 w-24 rounded bg-surface-container" />
        <div className="mt-4 h-12 w-2/3 max-w-[680px] rounded bg-surface-container" />
        <div className="mt-6 h-6 w-full max-w-[680px] rounded bg-surface-container" />

        <div className="mt-24 grid grid-cols-1 gap-4 md:grid-cols-12">
          {[7, 5, 5, 7].map((span, i) => (
            <div
              key={i}
              className={`h-64 rounded-2xl border border-line bg-surface-container ${
                span === 7 ? "md:col-span-7" : "md:col-span-5"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
