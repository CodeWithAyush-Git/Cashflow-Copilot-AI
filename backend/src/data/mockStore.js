function daysFromToday(offset) {
  const value = new Date();
  value.setDate(value.getDate() + offset);
  return value.toISOString().split("T")[0];
}

const clients = [
  {
    id: "client-1",
    name: "Bright Ads Studio",
    email: "accounts@brightads.in",
    companyType: "Marketing agency"
  },
  {
    id: "client-2",
    name: "Nexa Furnish",
    email: "finance@nexafurnish.com",
    companyType: "Furniture brand"
  },
  {
    id: "client-3",
    name: "Pulse Fitness Hub",
    email: "admin@pulsefitnesshub.com",
    companyType: "Gym chain"
  },
  {
    id: "client-4",
    name: "Leaf & Bean Cafe",
    email: "owner@leafandbean.in",
    companyType: "Cafe"
  }
];

const invoices = [
  {
    id: "inv-1001",
    clientId: "client-1",
    title: "Meta Ads Retainer - March",
    amount: 48000,
    currency: "INR",
    issueDate: daysFromToday(-32),
    dueDate: daysFromToday(-4),
    status: "overdue",
    lastReminderAt: daysFromToday(-2)
  },
  {
    id: "inv-1002",
    clientId: "client-2",
    title: "Showroom Website Revamp",
    amount: 92000,
    currency: "INR",
    issueDate: daysFromToday(-18),
    dueDate: daysFromToday(6),
    status: "pending",
    lastReminderAt: null
  },
  {
    id: "inv-1003",
    clientId: "client-3",
    title: "Monthly CRM Automation",
    amount: 30000,
    currency: "INR",
    issueDate: daysFromToday(-20),
    dueDate: daysFromToday(-9),
    status: "overdue",
    lastReminderAt: daysFromToday(-1)
  },
  {
    id: "inv-1004",
    clientId: "client-4",
    title: "Cafe Loyalty App Support",
    amount: 18000,
    currency: "INR",
    issueDate: daysFromToday(-11),
    dueDate: daysFromToday(10),
    status: "pending",
    lastReminderAt: null
  },
  {
    id: "inv-1005",
    clientId: "client-1",
    title: "Landing Page Sprint",
    amount: 26000,
    currency: "INR",
    issueDate: daysFromToday(-40),
    dueDate: daysFromToday(-20),
    status: "paid",
    lastReminderAt: daysFromToday(-23)
  }
];

function getClients() {
  return clients;
}

function getInvoices() {
  return invoices;
}

function getClientById(clientId) {
  return clients.find((client) => client.id === clientId) || null;
}

function getInvoiceById(invoiceId) {
  return invoices.find((invoice) => invoice.id === invoiceId) || null;
}

function addInvoice(input) {
  const newInvoice = {
    id: `inv-${1000 + invoices.length + 1}`,
    clientId: input.clientId,
    title: input.title,
    amount: Number(input.amount),
    currency: input.currency || "INR",
    issueDate: input.issueDate,
    dueDate: input.dueDate,
    status: input.status || "pending",
    lastReminderAt: null
  };

  invoices.unshift(newInvoice);
  return newInvoice;
}

function markReminderSent(invoiceId) {
  const invoice = getInvoiceById(invoiceId);

  if (invoice) {
    invoice.lastReminderAt = new Date().toISOString().split("T")[0];
  }

  return invoice;
}

module.exports = {
  addInvoice,
  getClientById,
  getClients,
  getInvoiceById,
  getInvoices,
  markReminderSent
};
