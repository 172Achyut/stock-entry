import twilio from 'twilio';

function buildMessage(suggestion) {
  const targets = suggestion.exitPoints.join(', ');
  const stopLoss = suggestion.stopLoss || 'N/A';
  return (
    `New Stock Suggestion Posted\n\n` +
    `Stock: ${suggestion.stockName}\n` +
    `Category: ${suggestion.category}\n` +
    `Entry: ₹${suggestion.entryPrice}\n` +
    `Targets: ${targets}\n` +
    `Stop Loss: ${stopLoss}\n` +
    `Posted By: ${suggestion.postedBy}`
  );
}

export async function sendWhatsAppNotifications(suggestion) {
  const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WHATSAPP_FROM, ARCHIT_PHONE, ACHYUTANANDA_PHONE } = process.env;

  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN) {
    console.warn('[WhatsApp] Twilio credentials not configured — skipping notifications');
    return [];
  }

  const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
  const from = `whatsapp:${TWILIO_WHATSAPP_FROM}`;
  const message = buildMessage(suggestion);

  const recipients = [
    { name: 'Archit', phone: ARCHIT_PHONE },
    { name: 'Achyutananda', phone: ACHYUTANANDA_PHONE },
  ];

  const results = [];

  for (const recipient of recipients) {
    if (!recipient.phone) {
      console.warn(`[WhatsApp] Skipping ${recipient.name}: phone not set in .env`);
      results.push({ name: recipient.name, status: 'skipped' });
      continue;
    }

    try {
      await client.messages.create({
        from,
        to: `whatsapp:${recipient.phone}`,
        body: message,
      });
      console.log(`[WhatsApp] Sent to ${recipient.name}`);
      results.push({ name: recipient.name, status: 'sent' });
    } catch (err) {
      console.error(`[WhatsApp] Failed to send to ${recipient.name}:`, err.message);
      results.push({ name: recipient.name, status: 'failed', error: err.message });
    }
  }

  return results;
}
