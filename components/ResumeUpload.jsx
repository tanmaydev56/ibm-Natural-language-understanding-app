"use client";

import { useState } from "react";

export default function ResumeUpload() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResults, setAnalysisResults] = useState(null);

  const handleUpload = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setMessage("Please select a DOCX file first.");
      return;
    }

    setIsLoading(true);
    setMessage("");
    setAnalysisResults(null);

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
    } catch (error) {
      setMessage(`Error: ${error.message}`);
      console.error("Upload error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleUpload} className="space-y-4 max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
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

      {analysisResults && (
        <div className="mt-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Analysis Results</h3>
          {analysisResults && (
        <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Analysis Insights:</h3>

          {/* Display Sentiment */}
          {analysisResults.sentiment?.document && (
            <div className="mb-3">
              <h4 className="font-medium text-gray-700">Overall Sentiment:</h4>
              <p className="text-gray-600">
                Label: <span className="font-semibold">{analysisResults.sentiment.document.label}</span>, 
                Score: {analysisResults.sentiment.document.score.toFixed(2)}
              </p>
            </div>
          )}

          {/* Display Emotion */}
          {analysisResults.emotion?.document?.emotion && (
            <div className="mb-3">
              <h4 className="font-medium text-gray-700">Document Emotions:</h4>
              <ul className="list-disc list-inside text-gray-600">
                {Object.entries(analysisResults.emotion.document.emotion).map(([emotionName, score]) => (
                  <li key={emotionName}>
                    {emotionName.charAt(0).toUpperCase() + emotionName.slice(1)}: {score.toFixed(2)}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Display Keywords */}
          {analysisResults.keywords && analysisResults.keywords.length > 0 && (
            <div className="mb-3">
              <h4 className="font-medium text-gray-700">Keywords:</h4>
              <ul className="list-disc list-inside text-gray-600">
                {analysisResults.keywords.map((kw, index) => (
                  <li key={index}>{kw.text} (Relevance: {kw.relevance.toFixed(2)})</li>
                ))}
              </ul>
            </div>
          )}

          {/* Display Concepts */}
          {analysisResults.concepts && analysisResults.concepts.length > 0 && (
            <div className="mb-3">
              <h4 className="font-medium text-gray-700">Concepts:</h4>
              <ul className="list-disc list-inside text-gray-600">
                {analysisResults.concepts.map((con, index) => (
                  <li key={index}>{con.text} (Relevance: {con.relevance.toFixed(2)})</li>
                ))}
              </ul>
            </div>
          )}

          {/* Display Entities */}
          {analysisResults.entities && analysisResults.entities.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-700">Entities:</h4>
              <ul className="list-disc list-inside text-gray-600">
                {analysisResults.entities.map((ent, index) => (
                  <li key={index}>{ent.text} (Type: {ent.type})</li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Fallback if no specific insights */}
          {!analysisResults.keywords?.length && 
           !analysisResults.concepts?.length && 
           !analysisResults.entities?.length &&
           !analysisResults.sentiment?.document &&
           !analysisResults.emotion?.document?.emotion && (
              <p className="text-gray-600">No specific insights extracted. The content might be too short or generic, or NLU returned no features.</p>
          )}
        </div>
          )}
        </div>
      )}
    </form>
  );
}