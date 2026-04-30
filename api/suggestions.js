import { connectDB } from './db.js';
import StockSuggestion from './StockSuggestion.js';
import { sendWhatsAppNotifications } from './whatsapp.js';

export default async function handler(req, res) {
  await connectDB();

  if (req.method === 'GET') {
    try {
      const suggestions = await StockSuggestion.find().sort({ createdAt: -1 });
      return res.json(suggestions);
    } catch {
      return res.status(500).json({ error: 'Failed to fetch suggestions' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { stockName, entryPrice, exitPoints, stopLoss, category, postedBy, notes } = req.body;

      if (!stockName || !entryPrice || !exitPoints?.length || !category || !postedBy) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const suggestion = await StockSuggestion.create({
        stockName,
        entryPrice,
        exitPoints,
        stopLoss: stopLoss || null,
        category,
        postedBy,
        notes: notes || null,
      });

      sendWhatsAppNotifications(suggestion).catch((err) =>
        console.error('[WhatsApp] Unexpected error:', err)
      );

      return res.status(201).json(suggestion);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to create suggestion' });
    }
  }

  res.status(405).json({ error: 'Method not allowed' });
}
