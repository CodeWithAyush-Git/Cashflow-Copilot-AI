const store = require("../data/mockStore");

function getDaysPastDue(dueDate) {
  const now = new Date();
  const due = new Date(dueDate);
  const differenceInMs = now.setHours(0, 0, 0, 0) - due.setHours(0, 0, 0, 0);

  return Math.floor(differenceInMs / (1000 * 60 * 60 * 24));
}

function getRiskLevel(invoice) {
  if (invoice.status === "paid") {
    return "low";
  }

  const daysPastDue = getDaysPastDue(invoice.dueDate);

  if (daysPastDue >= 7 || invoice.amount >= 70000) {
    return "high";
  }

  if (daysPastDue > 0 || invoice.amount >= 35000) {
    return "medium";
  }

  return "low";
}

function decorateInvoice(invoice) {
  const client = store.getClientById(invoice.clientId);
  const daysPastDue = getDaysPastDue(invoice.dueDate);

  return {
    ...invoice,
    clientName: client ? client.name : "Unknown client",
    clientEmail: client ? client.email : "missing@example.com",
    daysPastDue: Math.max(daysPastDue, 0),
    riskLevel: getRiskLevel(invoice)
  };
}

function listInvoices() {
  return store
    .getInvoices()
    .map(decorateInvoice)
    .sort((left, right) => new Date(left.dueDate) - new Date(right.dueDate));
}

function listClients() {
  return store.getClients();
}

function getInvoiceDetails(invoiceId) {
  const invoice = store.getInvoiceById(invoiceId);

  if (!invoice) {
    return null;
  }

  return decorateInvoice(invoice);
}

function createInvoice(input) {
  if (!input.clientId || !store.getClientById(input.clientId)) {
    throw new Error("A valid clientId is required.");
  }

  if (!input.title || !input.issueDate || !input.dueDate) {
    throw new Error("title, issueDate and dueDate are required.");
  }

  if (!Number(input.amount) || Number(input.amount) <= 0) {
    throw new Error("amount must be greater than zero.");
  }

  const invoice = store.addInvoice(input);
  return decorateInvoice(invoice);
}

module.exports = {
  createInvoice,
  getInvoiceDetails,
  listClients,
  listInvoices
};
