const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json"
    },
    ...options
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Request failed." }));
    throw new Error(error.message || "Request failed.");
  }

  return response.json();
}

export function fetchDashboard() {
  return request("/dashboard");
}

export function fetchInvoices() {
  return request("/invoices");
}

export function fetchClients() {
  return request("/clients");
}

export function createInvoice(payload) {
  return request("/invoices", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function generateReminder(payload) {
  return request("/reminders/preview", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}
