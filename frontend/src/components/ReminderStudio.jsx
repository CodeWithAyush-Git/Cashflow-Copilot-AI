function currency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(amount);
}

export default function ReminderStudio({
  selectedInvoice,
  reminderDraft,
  tone,
  onToneChange,
  onGenerate,
  isGenerating
}) {
  if (!selectedInvoice) {
    return <p className="empty-state">Select an invoice to generate a payment reminder draft.</p>;
  }

  return (
    <div className="reminder-layout">
      <article className="reminder-meta">
        <p className="eyebrow">Invoice Details</p>
        <h3>{selectedInvoice.title}</h3>
        <ul className="meta-list">
          <li>Client: {selectedInvoice.clientName}</li>
          <li>Amount: {currency(selectedInvoice.amount)}</li>
          <li>Due date: {selectedInvoice.dueDate}</li>
          <li>Risk level: {selectedInvoice.riskLevel}</li>
        </ul>

        <label>
          Tone
          <select value={tone} onChange={(event) => onToneChange(event.target.value)}>
            <option value="professional">Professional</option>
            <option value="friendly">Friendly</option>
            <option value="firm">Firm</option>
          </select>
        </label>

        <button type="button" className="primary-button" onClick={() => onGenerate()} disabled={isGenerating}>
          {isGenerating ? "Generating..." : "Generate reminder"}
        </button>
      </article>

      <article className="draft-card">
        {reminderDraft ? (
          <>
            <div className="draft-header">
              <div>
                <p className="eyebrow">Reminder Preview</p>
                <h3>{reminderDraft.subject}</h3>
              </div>
              <span className="badge badge-source">{reminderDraft.source}</span>
            </div>

            <p className="draft-reasoning">{reminderDraft.reasoning}</p>
            {reminderDraft.warning ? <p className="warning-text">{reminderDraft.warning}</p> : null}
            <pre className="draft-message">{reminderDraft.message}</pre>
          </>
        ) : (
          <p className="empty-state">
            Choose a tone and generate a reminder to preview the draft for this invoice.
          </p>
        )}
      </article>
    </div>
  );
}
