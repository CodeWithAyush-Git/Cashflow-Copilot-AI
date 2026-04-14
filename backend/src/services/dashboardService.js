const { listInvoices } = require("./invoiceService");

function formatCurrency(number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(number);
}

function buildActionItems(invoices) {
  return invoices
    .filter((invoice) => invoice.status !== "paid")
    .sort((left, right) => {
      if (left.riskLevel === right.riskLevel) {
        return right.amount - left.amount;
      }

      return left.riskLevel === "high" ? -1 : 1;
    })
    .slice(0, 3)
    .map((invoice) => ({
      invoiceId: invoice.id,
      title: `Follow up with ${invoice.clientName}`,
      detail: `${invoice.title} is ${invoice.daysPastDue} day(s) overdue for ${formatCurrency(invoice.amount)}.`
    }));
}

function getDashboardSummary() {
  const invoices = listInvoices();
  const pendingInvoices = invoices.filter((invoice) => invoice.status !== "paid");
  const overdueInvoices = invoices.filter((invoice) => invoice.status === "overdue");
  const paidInvoices = invoices.filter((invoice) => invoice.status === "paid");

  const pendingAmount = pendingInvoices.reduce((sum, invoice) => sum + invoice.amount, 0);
  const overdueAmount = overdueInvoices.reduce((sum, invoice) => sum + invoice.amount, 0);
  const recoveredAmount = paidInvoices.reduce((sum, invoice) => sum + invoice.amount, 0);
  const collectionRate = Math.round(
    (recoveredAmount / Math.max(recoveredAmount + pendingAmount, 1)) * 100
  );

  return {
    headline: "Monitor receivables, spot risky accounts early, and generate payment reminders in seconds.",
    stats: [
      {
        label: "Pending Revenue",
        value: formatCurrency(pendingAmount),
        accent: "warm"
      },
      {
        label: "Overdue Invoices",
        value: String(overdueInvoices.length),
        accent: "alert"
      },
      {
        label: "Collection Rate",
        value: `${collectionRate}%`,
        accent: "calm"
      },
      {
        label: "High Risk Accounts",
        value: String(pendingInvoices.filter((invoice) => invoice.riskLevel === "high").length),
        accent: "neutral"
      }
    ],
    actionItems: buildActionItems(invoices)
  };
}

module.exports = {
  getDashboardSummary
};
