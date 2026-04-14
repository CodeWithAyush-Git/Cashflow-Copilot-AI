import { startTransition, useEffect, useState } from "react";
import Footer from "./components/Footer";
import InvoiceForm from "./components/InvoiceForm";
import InvoiceTable from "./components/InvoiceTable";
import Panel from "./components/Panel";
import ReminderStudio from "./components/ReminderStudio";
import Sidebar from "./components/Sidebar";
import StatCard from "./components/StatCard";
import {
  createInvoice,
  fetchClients,
  fetchDashboard,
  fetchInvoices,
  generateReminder
} from "./services/api";


function App() {
  const [activeView, setActiveView] = useState("overview");
  const [dashboard, setDashboard] = useState(null);
  const [clients, setClients] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);
  const [reminderDraft, setReminderDraft] = useState(null);
  const [tone, setTone] = useState("professional");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");

  async function loadData(preferredInvoiceId) {
    setError("");

    try {
      const [dashboardData, clientData, invoiceData] = await Promise.all([
        fetchDashboard(),
        fetchClients(),
        fetchInvoices()
      ]);

      setDashboard(dashboardData);
      setClients(clientData);
      setInvoices(invoiceData);

      const suggestedInvoice =
        invoiceData.find((invoice) => invoice.id === preferredInvoiceId) ||
        invoiceData.find((invoice) => invoice.status !== "paid") ||
        invoiceData[0];

      setSelectedInvoiceId(suggestedInvoice ? suggestedInvoice.id : null);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleCreateInvoice(payload) {
    setIsSaving(true);

    try {
      const invoice = await createInvoice(payload);
      await loadData(invoice.id);
      startTransition(() => setActiveView("invoices"));
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleGenerateReminder() {
    if (!selectedInvoiceId) {
      return;
    }

    setIsGenerating(true);
    setError("");

    try {
      const response = await generateReminder({
        invoiceId: selectedInvoiceId,
        tone
      });

      setReminderDraft(response.draft);
      await loadData(selectedInvoiceId);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsGenerating(false);
    }
  }

  const selectedInvoice = invoices.find((invoice) => invoice.id === selectedInvoiceId) || null;

  return (
    <div className="app-shell">
      <Sidebar
        activeView={activeView}
        onChange={(view) => {
          startTransition(() => setActiveView(view));
        }}
      />

      <main className="content">
        <section className="hero">
          <p className="eyebrow">AI-Powered Receivables Management</p>
          <h2>Track outstanding invoices, prioritize collections, and generate polished reminders faster.</h2>
          <p>{dashboard?.headline || "Loading dashboard summary..."}</p>
        </section>

        {error ? <div className="error-banner">{error}</div> : null}

        {isLoading ? (
          <div className="loading-card">Loading app data...</div>
        ) : (
          <>
            {activeView === "overview" ? (
              <>
                <section className="stats-grid">
                  {dashboard?.stats?.map((item) => (
                    <StatCard key={item.label} {...item} />
                  ))}
                </section>

                <Panel
                  title="Priority Follow-Ups"
                  description="Review the most urgent collection tasks based on invoice age, amount, and account risk."
                >
                  <div className="action-grid">
                    {dashboard?.actionItems?.map((item) => (
                      <button
                        key={item.invoiceId}
                        type="button"
                        className="action-card"
                        onClick={() => {
                          setSelectedInvoiceId(item.invoiceId);
                          startTransition(() => setActiveView("reminders"));
                        }}
                      >
                        <strong>{item.title}</strong>
                        <p>{item.detail}</p>
                      </button>
                    ))}
                  </div>
                </Panel>
              </>
            ) : null}

            {activeView === "invoices" ? (
              <div className="split-layout">
                <Panel
                  title="Invoices"
                  description="Review invoice status, track risk, and open any account in the reminder workspace."
                >
                  <InvoiceTable
                    invoices={invoices}
                    selectedInvoiceId={selectedInvoiceId}
                    onSelectInvoice={(invoiceId) => {
                      setSelectedInvoiceId(invoiceId);
                      startTransition(() => setActiveView("reminders"));
                    }}
                  />
                </Panel>

                <Panel
                  title="Create Invoice"
                  description="Add a new invoice record to keep the dashboard and follow-up queue current."
                >
                  <InvoiceForm clients={clients} onSubmit={handleCreateInvoice} isSubmitting={isSaving} />
                </Panel>
              </div>
            ) : null}

            {activeView === "reminders" ? (
              <Panel
                title="Reminder Workspace"
                description="Generate a payment reminder using the selected invoice details and tone."
              >
                <ReminderStudio
                  selectedInvoice={selectedInvoice}
                  reminderDraft={reminderDraft}
                  tone={tone}
                  onToneChange={setTone}
                  onGenerate={handleGenerateReminder}
                  isGenerating={isGenerating}
                />
              </Panel>
            ) : null}

          </>
        )}
        <Footer />
      </main>
    </div>
  );
}

export default App;
