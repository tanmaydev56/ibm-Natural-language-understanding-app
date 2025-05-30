import { useState } from 'react';
import SentimentChart from './SentimentChart';
import EmotionRadar from './EmotionRadar';

export default function Dashboard() {
  const [feedback, setFeedback] = useState('');
  const [results, setResults] = useState(null);

  const analyzeFeedback = async () => {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: feedback }),
    });
    const data = await response.json();
    setResults(data);
  };

  // Compute dashboardData only if results exist
  const dashboardData = results
    ? {
        sentiment: {
          positive:
            results.sentiment?.document?.label === 'positive'
              ? results.sentiment.document.score
              : 0,
          negative:
            results.sentiment?.document?.label === 'negative'
              ? results.sentiment.document.score
              : 0,
          neutral:
            results.sentiment?.document?.label === 'neutral'
              ? results.sentiment.document.score
              : 0,
        },
        emotions: results.emotion?.document?.emotion || {},
        phrases: results.keywords || [],
      }
    : null;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-8">Customer Feedback Analyzer</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <textarea
          className="md:col-span-3 p-4 border rounded-lg"
          placeholder="Paste customer feedback here..."
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
        />
        <button
          onClick={analyzeFeedback}
          className="bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700"
        >
          Analyze Feedback
        </button>
      </div>

      {dashboardData && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Sentiment Analysis</h2>
            <SentimentChart data={dashboardData.sentiment} />
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Emotion Breakdown</h2>
            <EmotionRadar emotions={dashboardData.emotions} />
          </div>
        </div>
      )}
    </div>
  );
}
