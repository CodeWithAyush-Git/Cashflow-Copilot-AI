const cors = require("cors");
const express = require("express");

const clientRoutes = require("./routes/clientRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const invoiceRoutes = require("./routes/invoiceRoutes");
const reminderRoutes = require("./routes/reminderRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    message: "Cashflow Copilot backend is running."
  });
});

app.use("/api/clients", clientRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/reminders", reminderRoutes);

module.exports = app;
