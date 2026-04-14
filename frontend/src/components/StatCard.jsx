export default function StatCard({ label, value, accent }) {
  return (
    <article className={`stat-card stat-${accent}`}>
      <p>{label}</p>
      <h3>{value}</h3>
    </article>
  );
}
