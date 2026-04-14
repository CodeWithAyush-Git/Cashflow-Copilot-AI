const express = require("express");
const { getInvoices, postInvoice } = require("../controllers/invoiceController");

const router = express.Router();

router.get("/", getInvoices);
router.post("/", postInvoice);

module.exports = router;
