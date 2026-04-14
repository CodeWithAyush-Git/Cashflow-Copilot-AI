const { createInvoice, listClients, listInvoices } = require("../services/invoiceService");

function getInvoices(req, res) {
  res.json(listInvoices());
}

function getClients(req, res) {
  res.json(listClients());
}

function postInvoice(req, res) {
  try {
    const invoice = createInvoice(req.body);
    res.status(201).json(invoice);
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
}

module.exports = {
  getClients,
  getInvoices,
  postInvoice
};
