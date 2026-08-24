export default function SlotsFullStamp({
  spots,
  variant = "ink",
  className = "",
}: {
  spots?: number;
  variant?: "ink" | "light";
  className?: string;
}) {
  const ink = variant === "ink";

  return (
    <div
      role="img"
      aria-label={spots ? `Slots full · ${spots} doubles` : "Slots full"}
      className={`slots-full-stamp ${ink ? "slots-full-stamp--ink" : "slots-full-stamp--light"} ${className}`}
    >
      <span className="slots-full-stamp__ring" aria-hidden />
      <p className="slots-full-stamp__kicker">House full</p>
      <p className="slots-full-stamp__title">Slots full</p>
      {spots ? <p className="slots-full-stamp__meta">{spots} doubles</p> : null}
    </div>
  );
}
