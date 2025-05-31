'use client';
import RecommendationsPanel from './RecomendationsPannel';
import React from 'react';

const ResumeDetails = ({ resume }: { resume: any }) => {
  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-800">{resume.filename}</h1>
          <p className="text-sm text-gray-500">
            Analyzed on {new Date(resume.analyzed_at).toLocaleString()}
          </p>
          <div
            className={`mt-3 inline-block px-3 py-1 rounded-full text-sm font-medium ${
              resume.sentiment_label === 'positive'
                ? 'bg-green-100 text-green-800'
                : resume.sentiment_label === 'negative'
                ? 'bg-red-100 text-red-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}
          >
            {resume.sentiment_label} ({resume.sentiment_score > 0 ? '+' : ''}
            {resume.sentiment_score.toFixed(2)})
          </div>
        </div>

        {/* Original Content */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="font-semibold text-lg mb-2">Original Content</h2>
          <div className="prose prose-sm max-w-none text-gray-700 h-64 overflow-y-auto">
            {resume.input_text.split('\n').map((paragraph: string, i: number) => (
              <p key={i}>{paragraph.trim() === '' ? <br /> : paragraph}</p>
            ))}
          </div>
        </div>

        {/* Emotions */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="font-semibold text-lg mb-4">Emotion Analysis</h2>
          {Object.entries(resume.emotion_data).map(([emotion, value]) => (
            <div key={emotion} className="flex items-center mb-2">
              <span className="w-24 capitalize">{emotion}</span>
              <div className="flex-1 bg-gray-200 h-2.5 rounded-full">
                <div
                  className="bg-blue-500 h-2.5 rounded-full"
                  style={{ width: `${value * 100}%` }}
                ></div>
              </div>
              <span className="ml-2 text-sm text-gray-500 w-12 text-right">
                {(value * 100).toFixed(1)}%
              </span>
            </div>
          ))}
        </div>

        {/* Keywords */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="font-semibold text-lg mb-2">Key Insights</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            {resume.keywords.slice(0, 5).map((keyword: any, i: number) => (
              <span
                key={i}
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  keyword.sentiment === 'positive'
                    ? 'bg-green-100 text-green-800'
                    : keyword.sentiment === 'negative'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {keyword.text}
              </span>
            ))}
          </div>

          {resume.recommendations && (
            <RecommendationsPanel recommendations={resume.recommendations} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeDetails;
