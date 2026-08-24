export default function SlotsFullStamp({
  spots,
  size = "md",
  className = "",
}: {
  spots?: number;
  size?: "sm" | "md";
  className?: string;
}) {
  const compact = size === "sm";

  return (
    <div
      role="img"
      aria-label={spots ? `Slots full · ${spots} doubles` : "Slots full"}
      className={`inline-flex -rotate-[7deg] flex-col items-center justify-center rounded-xl border-2 border-[#1c1c1c] bg-[#FFF201] text-[#1c1c1c] shadow-[2px_3px_0_rgba(28,28,28,0.16)] ${
        compact ? "px-3 py-1.5" : "px-3.5 py-2"
      } ${className}`}
    >
      <p
        className={`font-black uppercase leading-none tracking-[0.12em] ${
          compact ? "text-[11px]" : "text-[13px]"
        }`}
      >
        Slots full
      </p>
      {spots ? (
        <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.16em] text-[#1c1c1c]/65">
          {spots} doubles
        </p>
      ) : null}
    </div>
  );
}
