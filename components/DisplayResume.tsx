export const dynamic = 'force-dynamic'; // Prevent static caching

import { GetResume } from '@/actions/db.actions';
import React from 'react';

interface ResumeAnalysis {
  id: number;
  filename: string;
  sentiment_label: string;
  sentiment_score: number;
  analyzed_at: string;
}

const SentimentCircularProgress = ({
  score,
  label,
}: {
  score: number;
  label: string;
}) => {
  const radius = 40; // Slightly larger radius
  const circumference = 2 * Math.PI * radius;
  const normalizedScore = Math.min(Math.abs(score), 1);
  const strokeDashoffset = circumference * (1 - normalizedScore);

  // Enhanced color scheme with better visual hierarchy
  const colorMap = {
    positive: {
      main: '#10b981', // emerald-500
      light: '#d1fae5', // emerald-100
      dark: '#059669'  // emerald-600
    },
    negative: {
      main: '#ef4444', // red-500
      light: '#fee2e2', // red-100
      dark: '#dc2626'   // red-600
    },
    neutral: {
      main: '#f59e0b', // amber-500
      light: '#fef3c7', // amber-100
      dark: '#d97706'   // amber-600
    }
  };

  const colors = colorMap[label.toLowerCase() as keyof typeof colorMap] || colorMap.neutral;

  // Score interpretation text
  const getSentimentText = () => {
    if (label === 'positive') {
      return score > 0.75 ? 'Very Positive' : 'Positive';
    } else if (label === 'negative') {
      return score < -0.75 ? 'Very Negative' : 'Negative';
    }
    return 'Neutral';
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      <div className="relative w-24 h-24">
        <svg width="100%" height="100%" viewBox="0 0 100 100" className="transform -rotate-90">
          <circle
            stroke={colors.light}
            fill="transparent"
            strokeWidth={8}
            r={radius}
            cx={50}
            cy={50}
          />
          <circle
            stroke={colors.main}
            fill="transparent"
            strokeWidth={8}
            r={radius}
            cx={50}
            cy={50}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{ 
              transition: 'stroke-dashoffset 0.7s ease, stroke 0.3s ease',
            }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span 
            className="text-2xl font-bold" 
            style={{ color: colors.dark }}
          >
            {score > 0 ? '+' : ''}
            {score.toFixed(2)}
          </span>
        </div>
      </div>
      <div className="px-3 py-1 rounded-full" style={{ backgroundColor: colors.light }}>
        <span className="text-sm font-medium" style={{ color: colors.dark }}>
          {getSentimentText()}
        </span>
      </div>
    </div>
  );
};

const DisplayResume = async () => {
  const resumes = (await GetResume()) as ResumeAnalysis[];

  resumes.sort(
    (a, b) => new Date(b.analyzed_at).getTime() - new Date(a.analyzed_at).getTime()
  );

  if (!resumes || resumes.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center max-w-md p-8 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="mx-auto w-20 h-20 bg-gray-100 rounded-full mb-4 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No Resumes Analyzed Yet</h3>
          <p className="text-gray-600 mb-6">
            Upload your resume to get started with sentiment analysis and improvement suggestions.
          </p>
          <button className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200">
            Upload Resume
          </button>
        </div>
      </div>
    );
  }

  // Calculate statistics for the summary
  const averageScore = resumes.reduce((sum, r) => sum + r.sentiment_score, 0) / resumes.length;
  const positiveCount = resumes.filter(r => r.sentiment_label === 'positive').length;
  const negativeCount = resumes.filter(r => r.sentiment_label === 'negative').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
         <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
  Data-Driven Resume Emotional Optimization
</h1>
<h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
  Why 92% of Our Customers Get More Interviews
</h1>
<p className="text-lg text-gray-600 max-w-3xl mx-auto">
  NLP-powered sentiment analysis gives your resume the professional edge
</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Total Resumes</h3>
            <p className="text-3xl font-bold text-gray-900">{resumes.length}</p>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Average Score</h3>
            <p className="text-3xl font-bold" style={{
              color: averageScore > 0 ? '#10b981' : averageScore < 0 ? '#ef4444' : '#f59e0b'
            }}>
              {averageScore > 0 ? '+' : ''}{averageScore.toFixed(2)}
            </p>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Sentiment Ratio</h3>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-emerald-600">{positiveCount} Positive</span>
              <span className="text-gray-400">|</span>
              <span className="text-sm font-medium text-amber-600">{resumes.length - positiveCount - negativeCount} Neutral</span>
              <span className="text-gray-400">|</span>
              <span className="text-sm font-medium text-red-600">{negativeCount} Negative</span>
            </div>
          </div>
        </div>

        {/* Resume Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {resumes.map((resume) => {
            const analyzedDate = new Date(resume.analyzed_at);
            const formattedDate = analyzedDate.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            });

            return (
              <div
                key={resume.id}
                className="group relative rounded-xl bg-white shadow-sm p-6 border border-gray-200 flex flex-col items-center text-center
                           hover:shadow-md hover:border-gray-300 transition-all duration-200 ease-in-out overflow-hidden"
              >
                {/* Subtle background effect */}
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300 ${
                  resume.sentiment_label === 'positive' ? 'bg-emerald-500' :
                  resume.sentiment_label === 'negative' ? 'bg-red-500' : 'bg-amber-500'
                }`} />
                
                <div className="relative z-10 w-full">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 px-2 truncate w-full">
                    {resume.filename}
                  </h3>
                  <p className="text-gray-500 text-sm mb-6">
                    Analyzed on <span className="font-medium">{formattedDate}</span>
                  </p>

                  <SentimentCircularProgress
                    score={resume.sentiment_score}
                    label={resume.sentiment_label}
                  />

                  {/* Additional metadata placeholder */}
                  <div className="mt-6 pt-4 border-t border-gray-100 w-full">
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>ID: {resume.id}</span>
                      <span className="capitalize">{resume.sentiment_label}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DisplayResume;