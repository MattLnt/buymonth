export default function CalMark({ size = 34, className = "" }) {
  return (
    <span className={`calmark ${className}`} style={{ width: size }} aria-hidden="true">
      {Array.from({ length: 12 }).map((_, i) => (
        <span key={i} />
      ))}
    </span>
  );
}