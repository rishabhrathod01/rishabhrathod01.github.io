"use client";

function Key({
  label,
  hint,
  className = "",
}: {
  label: string;
  hint: string;
  className?: string;
}) {
  return (
    <div className={`flex flex-col items-center gap-1 ${className}`}>
      <kbd className="min-w-[2rem] px-1.5 py-1 rounded-md border border-white/20 bg-surface-container text-on-surface text-[11px] font-bold text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
        {label}
      </kbd>
      <span className="text-[8px] text-slate-muted tracking-wider uppercase">{hint}</span>
    </div>
  );
}

export default function ControlLegend() {
  return (
    <div className="glass-card rounded-xl px-4 py-3 flex items-start gap-5">
      <div>
        <p className="text-[9px] text-slate-muted tracking-widest uppercase mb-2">WASD</p>
        <div className="grid grid-cols-3 gap-1.5 items-end">
          <div />
          <Key label="W" hint="Up" />
          <div />
          <Key label="A" hint="Turn" />
          <Key label="S" hint="Down" />
          <Key label="D" hint="Turn" />
        </div>
      </div>

      <div className="w-px self-stretch bg-white/10" />

      <div>
        <p className="text-[9px] text-slate-muted tracking-widest uppercase mb-2">Arrows</p>
        <div className="grid grid-cols-3 gap-1.5 items-end">
          <div />
          <Key label="↑" hint="Fwd" />
          <div />
          <Key label="←" hint="Strafe" />
          <Key label="↓" hint="Back" />
          <Key label="→" hint="Strafe" />
        </div>
      </div>

      <div className="w-px self-stretch bg-white/10 hidden xl:block" />

      <div className="hidden xl:flex flex-col gap-2 pt-5">
        <div className="flex items-center gap-2">
          <kbd className="px-2 py-1 rounded-md border border-white/20 bg-surface-container text-on-surface text-[10px] font-bold">
            SHIFT
          </kbd>
          <span className="text-[8px] text-slate-muted tracking-wider uppercase">Sport</span>
        </div>
        <div className="flex items-center gap-2">
          <kbd className="px-2 py-1 rounded-md border border-white/20 bg-surface-container text-on-surface text-[10px] font-bold">
            E
          </kbd>
          <span className="text-[8px] text-slate-muted tracking-wider uppercase">Read</span>
        </div>
        <div className="flex items-center gap-2">
          <kbd className="px-2 py-1 rounded-md border border-white/20 bg-surface-container text-on-surface text-[10px] font-bold">
            ENTER
          </kbd>
          <span className="text-[8px] text-slate-muted tracking-wider uppercase">Open link</span>
        </div>
      </div>
    </div>
  );
}
