"use client";

import { useState } from "react";
import RecomendationsPannel from "./RecomendationsPannel";
import AnalysisResultPannel from "./AnalysisResultPannel";

export default function ResumeUpload() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [recommendations, setRecommendations] = useState("");
  

  const handleUpload = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setMessage("Please select a DOCX file first.");
      return;
    }

    setIsLoading(true);
    setMessage("");
    setAnalysisResults(null);
    setRecommendations("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Failed to analyze document");
      }

      setMessage(data.message);
      setAnalysisResults(data.insights);
      setRecommendations(data.recommendations);
    } catch (error) {
      setMessage(`Error: ${error.message}`);
      console.error("Upload error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <form onSubmit={handleUpload} className="space-y-4 p-6 bg-white rounded-lg shadow-md mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Resume Analyzer</h2>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Upload DOCX Resume
          </label>
          <input
            type="file"
            accept=".docx"
            onChange={(e) => setFile(e.target.files[0])}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
          <p className="text-xs text-gray-500">Only .docx files are supported</p>
        </div>

        <button
          type="submit"
          disabled={isLoading || !file}
          className={`w-full py-2 px-4 rounded-md font-medium ${
            isLoading || !file
              ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isLoading ? 'Analyzing...' : 'Analyze Resume'}
        </button>

        {message && (
          <div className={`p-3 rounded-md ${
            message.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {message}
          </div>
        )}
      </form>

      {(analysisResults || recommendations) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Analysis Results Panel */}
         <AnalysisResultPannel
          analysisResults={analysisResults} />

          {/* Recommendations Panel */}
          <RecomendationsPannel
         
           recommendations={recommendations} />
        </div>
      )}
    </div>
  );
}