import { useState } from "react";

const initialForm = {
  clientId: "",
  title: "",
  amount: "",
  issueDate: "",
  dueDate: ""
};

export default function InvoiceForm({ clients, onSubmit, isSubmitting }) {
  const [form, setForm] = useState(initialForm);

  async function handleSubmit(event) {
    event.preventDefault();

    await onSubmit({
      ...form,
      amount: Number(form.amount)
    });

    setForm(initialForm);
  }

  return (
    <form className="invoice-form" onSubmit={handleSubmit}>
      <label>
        Client
        <select
          value={form.clientId}
          onChange={(event) => setForm({ ...form, clientId: event.target.value })}
          required
        >
          <option value="">Select a client</option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.name}
            </option>
          ))}
        </select>
      </label>

      <label>
        Invoice title
        <input
          type="text"
          placeholder="Example: April social media retainer"
          value={form.title}
          onChange={(event) => setForm({ ...form, title: event.target.value })}
          required
        />
      </label>

      <label>
        Amount
        <input
          type="number"
          min="1"
          placeholder="45000"
          value={form.amount}
          onChange={(event) => setForm({ ...form, amount: event.target.value })}
          required
        />
      </label>

      <label>
        Issue date
        <input
          type="date"
          value={form.issueDate}
          onChange={(event) => setForm({ ...form, issueDate: event.target.value })}
          required
        />
      </label>

      <label>
        Due date
        <input
          type="date"
          value={form.dueDate}
          onChange={(event) => setForm({ ...form, dueDate: event.target.value })}
          required
        />
      </label>

      <button type="submit" className="primary-button" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Add invoice"}
      </button>
    </form>
  );
}
