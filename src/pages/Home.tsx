import { useEffect, useState } from 'react';
import SuggestionCard from '../components/SuggestionCard';
import type { StockSuggestion } from '../types';
import './Home.css';

export default function Home() {
  const [suggestions, setSuggestions] = useState<StockSuggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/suggestions')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load suggestions');
        return res.json();
      })
      .then((data) => {
        setSuggestions(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="page-state">Loading...</div>;
  if (error) return <div className="page-state error">Error: {error}</div>;

  return (
    <div className="home-page">
      <h1 className="page-title">Stock Suggestions</h1>
      {suggestions.length === 0 ? (
        <div className="page-state">No suggestions yet. Be the first to post one!</div>
      ) : (
        <div className="suggestions-grid">
          {suggestions.map((s) => (
            <SuggestionCard key={s._id} suggestion={s} />
          ))}
        </div>
      )}
    </div>
  );
}
