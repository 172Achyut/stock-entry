export interface StockSuggestion {
  _id: string;
  stockName: string;
  entryPrice: string;
  exitPoints: string[];
  stopLoss: string | null;
  category: 'Investment' | 'Swing';
  postedBy: 'Archit' | 'Achyutananda';
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PostFormData {
  postedBy: 'Archit' | 'Achyutananda' | '';
  stockName: string;
  entryPrice: string;
  exitPoints: string[];
  stopLoss: string;
  category: 'Investment' | 'Swing' | '';
  notes: string;
}
