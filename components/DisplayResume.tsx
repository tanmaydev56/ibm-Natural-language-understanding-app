import { GetResume } from '@/actions/db.actions';
import React from 'react';

import Link from 'next/link';

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
    <div className="min-h-screen  bg-gray-50 py-8 px-4">
      <div className="w-full mx-auto">
       

        <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900">Resume Analysis Dashboard</h2>
          <p className="text-lg text-gray-600">Click on a resume to view full analysis</p>
        </div>

        {resumes.length === 0 ? (
          <div className="text-center text-gray-500">No resumes found. Upload one to get started.</div>
        ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
  {resumes.map((resume) => (
    <Link key={resume.id} href={`/resume-analyzer/${resume.id}`}>
      <div className="group cursor-pointer rounded-2xl bg-white shadow-sm hover:shadow-lg hover:scale-105 transition-transform duration-300 p-6 border border-gray-100">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-800 truncate max-w-[220px] sm:max-w-[280px] lg:max-w-[320px]">
              {resume.filename}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Analyzed on {new Date(resume.analyzed_at).toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center pl-2 text-green-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 opacity-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4" />
            </svg>
          </div>
        </div>

        <div
          className={`mt-4 inline-block rounded-full px-3 py-1 text-sm font-medium ${
            resume.sentiment_label === 'positive'
              ? 'bg-green-100 text-green-700'
              : resume.sentiment_label === 'negative'
              ? 'bg-red-100 text-red-700'
              : 'bg-yellow-100 text-yellow-700'
          }`}
        >
          {resume.sentiment_label.charAt(0).toUpperCase() + resume.sentiment_label.slice(1)} ({resume.sentiment_score > 0 ? '+' : ''}
          {resume.sentiment_score.toFixed(2)})
        </div>
      </div>
    </Link>
  ))}
</div>


        )}
      </div>
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
