const express = require("express");
const { postReminderPreview } = require("../controllers/reminderController");

const router = express.Router();

router.post("/preview", postReminderPreview);

module.exports = router;
