import { Router } from 'express';
import StockSuggestion from '../models/StockSuggestion.js';
import { sendWhatsAppNotifications } from '../services/whatsapp.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const suggestions = await StockSuggestion.find().sort({ createdAt: -1 });
    res.json(suggestions);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch suggestions' });
  }
});

router.post('/', async (req, res) => {
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

    // Fire-and-forget: don't let notification failure block the response
    sendWhatsAppNotifications(suggestion).catch((err) =>
      console.error('[WhatsApp] Unexpected error:', err)
    );

    res.status(201).json(suggestion);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create suggestion' });
  }
});

export default router;
