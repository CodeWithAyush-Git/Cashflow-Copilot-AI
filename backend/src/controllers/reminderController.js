const { generateReminderPreview } = require("../services/reminderService");

async function postReminderPreview(req, res) {
  try {
    const result = await generateReminderPreview(req.body.invoiceId, req.body.tone);
    res.json(result);
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
}

module.exports = {
  postReminderPreview
};
