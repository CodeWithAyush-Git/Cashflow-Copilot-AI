const config = require("../config");
const store = require("../data/mockStore");
const { getInvoiceDetails } = require("./invoiceService");

function getToneGuide(tone) {
  if (tone === "firm") {
    return "Be respectful but direct. Ask for a payment date confirmation.";
  }

  if (tone === "friendly") {
    return "Keep it warm, short, and helpful.";
  }

  return "Sound professional and confident.";
}

function createFallbackDraft(invoice, tone) {
  const greeting = invoice.daysPastDue > 0 ? "I hope you are doing well." : "Hope your week is going smoothly.";
  const urgencyLine =
    invoice.daysPastDue > 0
      ? `This is a reminder that invoice ${invoice.id} for INR ${invoice.amount.toLocaleString("en-IN")} is overdue by ${invoice.daysPastDue} day(s).`
      : `This is a quick reminder that invoice ${invoice.id} for INR ${invoice.amount.toLocaleString("en-IN")} is due on ${invoice.dueDate}.`;

  const subject =
    tone === "firm"
      ? `Action needed: payment update for ${invoice.id}`
      : `Friendly reminder for invoice ${invoice.id}`;

  return {
    source: "rules",
    subject,
    channel: "email",
    tone,
    reasoning:
      invoice.riskLevel === "high"
        ? "High value or late invoice, so the message asks for a clear payment commitment."
        : "Moderate reminder to keep the relationship smooth while nudging for action.",
    message: [
      `Hi ${invoice.clientName},`,
      "",
      greeting,
      urgencyLine,
      "Please let us know the expected payment date so we can update our cashflow plan.",
      "",
      "Thank you,",
      "Accounts Team"
    ].join("\n")
  };
}

async function createOpenAiDraft(invoice, tone) {
  const prompt = {
    clientName: invoice.clientName,
    invoiceId: invoice.id,
    amount: invoice.amount,
    dueDate: invoice.dueDate,
    daysPastDue: invoice.daysPastDue,
    riskLevel: invoice.riskLevel,
    tone,
    instruction: getToneGuide(tone)
  };

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.openAiApiKey}`
    },
    body: JSON.stringify({
      model: config.openAiModel,
      input: [
        {
          role: "system",
          content: [
            {
              type: "input_text",
              text: "You write cashflow reminder drafts for small businesses. Return JSON with subject, channel, reasoning, and message."
            }
          ]
        },
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: JSON.stringify(prompt)
            }
          ]
        }
      ]
    })
  });

  if (!response.ok) {
    throw new Error("OpenAI request failed.");
  }

  const data = await response.json();
  const text = data.output_text || "";
  const parsed = JSON.parse(text);

  return {
    source: "openai",
    tone,
    subject: parsed.subject,
    channel: parsed.channel || "email",
    reasoning: parsed.reasoning,
    message: parsed.message
  };
}

async function generateReminderPreview(invoiceId, tone = "professional") {
  const invoice = getInvoiceDetails(invoiceId);

  if (!invoice) {
    throw new Error("Invoice not found.");
  }

  let draft;

  if (config.openAiApiKey && config.openAiModel) {
    try {
      draft = await createOpenAiDraft(invoice, tone);
    } catch (error) {
      draft = createFallbackDraft(invoice, tone);
      draft.warning = "OpenAI call failed, so the local fallback draft was used.";
    }
  } else {
    draft = createFallbackDraft(invoice, tone);
  }

  store.markReminderSent(invoiceId);

  return {
    invoice,
    draft
  };
}

module.exports = {
  generateReminderPreview
};
