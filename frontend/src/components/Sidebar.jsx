const NAV_ITEMS = [
  { id: "overview", label: "Overview" },
  { id: "invoices", label: "Invoices" },
  { id: "reminders", label: "Reminder Studio" }
];

export default function Sidebar({ activeView, onChange }) {
  return (
    <aside className="sidebar">
      <div>
        <p className="eyebrow">Revenue Operations</p>
        <h1>Cashflow Copilot</h1>
        <p className="sidebar-copy">
          Monitor receivables, reduce payment delays, and draft follow-ups from one workspace.
        </p>
      </div>

      <nav className="nav-list">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={activeView === item.id ? "nav-item active" : "nav-item"}
            onClick={() => onChange(item.id)}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
