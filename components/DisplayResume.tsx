import { GetResume } from '@/actions/db.actions';
import React from 'react';
import RecommendationsPanel from './RecomendationsPannel';

interface ResumeAnalysis {
  id: number;
  filename: string;
  input_text: string;
  sentiment_label: string;
  sentiment_score: number;
  emotion_data: {
    anger: number;
    disgust: number;
    fear: number;
    joy: number;
    sadness: number;
  };
  keywords: Array<{
    text: string;
    sentiment: string;
    emotion: Record<string, number>;
  }>;
  analyzed_at: string;
  recommendations: string;
  analysis_data: any;
}

const DisplayResume = async () => {
  const resumes = await GetResume() as ResumeAnalysis[];

  // Sort by analysis date (newest first)
  resumes.sort((a, b) => new Date(b.analyzed_at).getTime() - new Date(a.analyzed_at).getTime());

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Resume Analysis Dashboard</h2>
          <p className="mt-2 text-lg text-gray-600">View and compare your analyzed resumes</p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {resumes.map((resume) => (
            <div key={resume.id} className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6 space-y-6">

                {/* Header */}
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">{resume.filename}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Analyzed on {new Date(resume.analyzed_at).toLocaleString()}
                    </p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    resume.sentiment_label === 'positive' ? 'bg-green-100 text-green-800' :
                    resume.sentiment_label === 'negative' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {resume.sentiment_label} ({resume.sentiment_score > 0 ? '+' : ''}{resume.sentiment_score.toFixed(2)})
                  </div>
                </div>

                {/* Original Text */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                    <h4 className="font-semibold text-gray-800 flex items-center">
                      <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Original Content
                    </h4>
                  </div>
                  <div className="p-4 h-64 overflow-y-auto">
                    <div className="prose prose-sm max-w-none text-gray-700">
                      {resume.input_text.split('\n').map((paragraph, index) => (
                        <p key={index} className="mb-3 last:mb-0">
                          {paragraph.trim() === '' ? <br /> : paragraph}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Emotion Analysis */}
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Emotion Analysis</h4>
                  <div className="space-y-3">
                    {Object.entries(resume.emotion_data).map(([emotion, score]) => (
                      <div key={emotion} className="flex items-center">
                        <span className="w-24 capitalize">{emotion}</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-blue-500 h-2.5 rounded-full"
                            style={{ width: `${score * 100}%` }}
                          />
                        </div>
                        <span className="ml-2 text-sm text-gray-500 w-10 text-right">
                          {(score * 100).toFixed(1)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Keywords and Recommendations */}
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Key Insights</h4>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {resume.keywords.slice(0, 5).map((keyword, i) => (
                      <span
                        key={i}
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          keyword.sentiment === 'positive' ? 'bg-green-100 text-green-800' :
                          keyword.sentiment === 'negative' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
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
          ))}
        </div>

        {resumes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No resume analyses found. Upload a resume to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DisplayResume;
