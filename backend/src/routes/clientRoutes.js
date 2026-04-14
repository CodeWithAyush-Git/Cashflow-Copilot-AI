const express = require("express");
const { getClients } = require("../controllers/invoiceController");

const router = express.Router();

router.get("/", getClients);

module.exports = router;
