// No 'use client'
import Link from 'next/link';
import { GetResumeById } from '@/actions/db.actions';
import ResumeDetails from '@/components/ResumeDetails';
import React from 'react';

export const dynamic = "force-dynamic"; // 🚨 Force fresh server rendering every time

interface PageProps {
  params: {
    id: string;
  };
}

const ResumePage = async ({ params }: PageProps) => {
  const resumeId = params.id;
  const resumeAnalysis = await GetResumeById(resumeId);

  if (!resumeAnalysis) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">No Analysis Found</h1>
          <p className="text-gray-600 mt-2">No analysis data available for resume ID: {resumeId}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <Link
        href="/resume-analyzer"
        className="inline-block mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        ← Go Back
      </Link>
      <ResumeDetails resume={resumeAnalysis} />
    </div>
  );
};

export default ResumePage;
