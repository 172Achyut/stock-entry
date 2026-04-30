import type { StockSuggestion } from '../types';
import './SuggestionCard.css';

interface Props {
  suggestion: StockSuggestion;
}

export default function SuggestionCard({ suggestion }: Props) {
  const date = new Date(suggestion.createdAt).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="card">
      <div className="card-header">
        <span className="stock-name">{suggestion.stockName}</span>
        <span className={`badge badge-${suggestion.category.toLowerCase()}`}>
          {suggestion.category}
        </span>
      </div>

      <div className="card-body">
        <div className="field">
          <label>Entry Price</label>
          <span>₹{suggestion.entryPrice}</span>
        </div>

        <div className="field">
          <label>Targets</label>
          <span>{suggestion.exitPoints.map((t) => `₹${t}`).join(' → ')}</span>
        </div>

        <div className="field">
          <label>Stop Loss</label>
          <span>{suggestion.stopLoss ? `₹${suggestion.stopLoss}` : 'N/A'}</span>
        </div>

        {suggestion.notes && (
          <div className="field notes">
            <label>Notes</label>
            <span>{suggestion.notes}</span>
          </div>
        )}
      </div>

      <div className="card-footer">
        <span className="posted-by">Posted by {suggestion.postedBy}</span>
        <span className="date">{date}</span>
      </div>
    </div>
  );
}
