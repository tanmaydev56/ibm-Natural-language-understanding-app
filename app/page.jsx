'use client';

import { useState } from 'react';
import SentimentChart from '../components/SentimentChart';
import EmotionRadar from '../components/EmotionRadar';

export default function Home() {
  const [text, setText] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const analyzeText = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err.message);
      setResults(null);
    } finally {
      setLoading(false);
    }
  };

  // Helper functions for colors
  const getEmotionColor = (score) => (score > 0.7 ? 'bg-green-500' : score > 0.4 ? 'bg-blue-500' : 'bg-gray-300');
  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-100 text-green-800';
      case 'negative':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">IBM Watson NLP Analyzer</h1>
          <p className="mt-3 text-xl text-gray-500">Analyze text sentiment, emotions, and key phrases</p>
        </div>

        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <div className="mb-4">
            <label htmlFor="text-input" className="block text-sm font-medium text-gray-700 mb-2">
              Enter text to analyze
            </label>
            <textarea
              id="text-input"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type or paste your text here..."
              rows={6}
            />
          </div>

          <button
            onClick={analyzeText}
            disabled={loading || !text.trim()}
            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              loading || !text.trim()
                ? 'bg-indigo-300 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
            }`}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Analyzing...
              </>
            ) : (
              'Analyze Text'
            )}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-8">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {results && (
          <div className="space-y-8">
            {/* Text Results Section */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Text Analysis Results</h2>
              </div>

              <div className="px-6 py-5">
                <div className="mb-6">
                  <h3 className="text-md font-medium text-gray-900 mb-3">Sentiment</h3>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getSentimentColor(
                      results.sentiment?.document?.label,
                    )}`}
                  >
                    {results.sentiment?.document?.label || 'neutral'}
                  </span>
                  {results.sentiment?.document?.score && (
                    <p className="mt-2 text-sm text-gray-500">
                      Confidence: {(results.sentiment.document.score * 100).toFixed(1)}%
                    </p>
                  )}
                </div>

                <div className="mb-6">
                  <h3 className="text-md font-medium text-gray-900 mb-3">Emotions</h3>
                  <div className="space-y-2">
                    {results.emotion?.document?.emotion &&
                      Object.entries(results.emotion.document.emotion)
                        .sort((a, b) => b[1] - a[1])
                        .map(([emotion, score]) => (
                          <div key={emotion} className="flex items-center">
                            <span className="w-24 text-sm font-medium text-gray-700 capitalize">{emotion}</span>
                            <div className="flex-1 ml-2">
                              <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div
                                  className={`h-2.5 rounded-full ${getEmotionColor(score)}`}
                                  style={{ width: `${score * 100}%` }}
                                ></div>
                              </div>
                            </div>
                            <span className="ml-2 w-10 text-sm text-gray-500">{score.toFixed(2)}</span>
                          </div>
                        ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-md font-medium text-gray-900 mb-3">Key Phrases</h3>
                  <div className="space-y-3">
                    {results.keywords
                      ?.sort((a, b) => b.relevance - a.relevance)
                      .map((keyword, index) => (
                        <div key={index} className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex justify-between items-start">
                            <span className="font-medium text-gray-900">{keyword.text}</span>
                            <span className="text-xs px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full">
                              {keyword.relevance.toFixed(2)}
                            </span>
                          </div>
                          <p className="mt-1 text-sm text-gray-600">{keyword.sentiment.label}</p>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Visualization Section */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
  <div className="bg-white p-6 rounded-lg shadow">
    <h2 className="text-xl font-semibold mb-4 text-gray-900">Sentiment Chart</h2>
    <SentimentChart 
      sentiment={{
        positive: results.sentiment?.document?.label === 'positive' ? results.sentiment.document.score : 0,
        negative: results.sentiment?.document?.label === 'negative' ? results.sentiment.document.score : 0,
        neutral: results.sentiment?.document?.label === 'neutral' ? results.sentiment.document.score : 0,
      }} 
    />
  </div>


              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4 text-gray-900">Emotion Radar</h2>
                <EmotionRadar emotions={results.emotion?.document?.emotion || {}} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}