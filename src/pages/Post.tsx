import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { PostFormData } from '../types';
import './Post.css';

const EMPTY_FORM: PostFormData = {
  postedBy: '',
  stockName: '',
  entryPrice: '',
  exitPoints: [''],
  stopLoss: '',
  category: '',
  notes: '',
};

export default function Post() {
  const navigate = useNavigate();
  const [form, setForm] = useState<PostFormData>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function setField<K extends keyof PostFormData>(key: K, value: PostFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function addTarget() {
    setForm((prev) => ({ ...prev, exitPoints: [...prev.exitPoints, ''] }));
  }

  function removeTarget(index: number) {
    setForm((prev) => ({
      ...prev,
      exitPoints: prev.exitPoints.filter((_, i) => i !== index),
    }));
  }

  function updateTarget(index: number, value: string) {
    setForm((prev) => {
      const pts = [...prev.exitPoints];
      pts[index] = value;
      return { ...prev, exitPoints: pts };
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const filledTargets = form.exitPoints.filter((t) => t.trim() !== '');
    if (!form.postedBy || !form.stockName || !form.entryPrice || !filledTargets.length || !form.category) {
      setError('Please fill in all required fields and at least one target.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          exitPoints: filledTargets,
          stopLoss: form.stopLoss.trim() || null,
          notes: form.notes.trim() || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to post suggestion');
      }

      navigate('/');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setSubmitting(false);
    }
  }

  return (
    <div className="post-page">
      <h1 className="page-title">Add Stock Suggestion</h1>

      <form className="post-form" onSubmit={handleSubmit}>
        {error && <div className="form-error">{error}</div>}

        <div className="form-group">
          <label htmlFor="postedBy">Posted By *</label>
          <select
            id="postedBy"
            value={form.postedBy}
            onChange={(e) => setField('postedBy', e.target.value as PostFormData['postedBy'])}
            required
          >
            <option value="">Select user</option>
            <option value="Archit">Archit</option>
            <option value="Achyutananda">Achyutananda</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="stockName">Stock Name *</label>
          <input
            id="stockName"
            type="text"
            placeholder="e.g. RELIANCE, TATASTEEL"
            value={form.stockName}
            onChange={(e) => setField('stockName', e.target.value.toUpperCase())}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category *</label>
          <select
            id="category"
            value={form.category}
            onChange={(e) => setField('category', e.target.value as PostFormData['category'])}
            required
          >
            <option value="">Select category</option>
            <option value="Investment">Investment</option>
            <option value="Swing">Swing</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="entryPrice">Entry Price *</label>
          <input
            id="entryPrice"
            type="text"
            placeholder="e.g. 250.50"
            value={form.entryPrice}
            onChange={(e) => setField('entryPrice', e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Targets / Exit Points *</label>
          {form.exitPoints.map((pt, i) => (
            <div key={i} className="target-row">
              <input
                type="text"
                placeholder={`Target ${i + 1}`}
                value={pt}
                onChange={(e) => updateTarget(i, e.target.value)}
              />
              {form.exitPoints.length > 1 && (
                <button type="button" className="remove-btn" onClick={() => removeTarget(i)}>
                  ✕
                </button>
              )}
            </div>
          ))}
          <button type="button" className="add-target-btn" onClick={addTarget}>
            + Add Target
          </button>
        </div>

        <div className="form-group">
          <label htmlFor="stopLoss">Stop Loss</label>
          <input
            id="stopLoss"
            type="text"
            placeholder="Optional — e.g. 230"
            value={form.stopLoss}
            onChange={(e) => setField('stopLoss', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="notes">Notes</label>
          <textarea
            id="notes"
            rows={3}
            placeholder="Optional notes or rationale"
            value={form.notes}
            onChange={(e) => setField('notes', e.target.value)}
          />
        </div>

        <button type="submit" className="submit-btn" disabled={submitting}>
          {submitting ? 'Posting...' : 'Post Suggestion'}
        </button>
      </form>
    </div>
  );
}
