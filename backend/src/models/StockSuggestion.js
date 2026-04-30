import mongoose from 'mongoose';

const stockSuggestionSchema = new mongoose.Schema(
  {
    stockName: { type: String, required: true, trim: true },
    entryPrice: { type: String, required: true, trim: true },
    exitPoints: { type: [String], required: true },
    stopLoss: { type: String, default: null },
    category: { type: String, enum: ['Investment', 'Swing'], required: true },
    postedBy: { type: String, enum: ['Archit', 'Achyutananda'], required: true },
    notes: { type: String, default: null },
  },
  { timestamps: true }
);

export default mongoose.model('StockSuggestion', stockSuggestionSchema);
