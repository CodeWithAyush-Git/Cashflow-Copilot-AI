function currency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(amount);
}

export default function InvoiceTable({ invoices, selectedInvoiceId, onSelectInvoice }) {
  return (
    <div className="table-wrap">
      <table className="invoice-table">
        <thead>
          <tr>
            <th>Invoice</th>
            <th>Client</th>
            <th>Due Date</th>
            <th>Amount</th>
            <th>Risk</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice) => (
            <tr key={invoice.id} className={selectedInvoiceId === invoice.id ? "row-selected" : ""}>
              <td>
                <strong>{invoice.id}</strong>
                <span>{invoice.title}</span>
              </td>
              <td>{invoice.clientName}</td>
              <td>{invoice.dueDate}</td>
              <td>{currency(invoice.amount)}</td>
              <td>
                <span className={`badge badge-${invoice.riskLevel}`}>{invoice.riskLevel}</span>
              </td>
              <td>
                <span className={`badge badge-status-${invoice.status}`}>{invoice.status}</span>
              </td>
              <td>
                <button type="button" className="ghost-button" onClick={() => onSelectInvoice(invoice.id)}>
                  Open reminder
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
