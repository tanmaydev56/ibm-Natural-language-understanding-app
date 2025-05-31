import React from 'react'
interface AnalysisResults {
  sentiment: {
    document: {
      label: string;
        score: number;
      // Add other properties as needed
    };
    
  };
  emotion: {
    document: {
      emotion: {
        [key: string]: number;
      };
      // Add other properties as needed
    };
  };
    keywords: {
        text: string;
        relevance: number;
    }[];
    concepts: {
        text: string;
        relevance: number;
    }[];
    entities: {
        text: string;
        type: string;
    }[];
}


const AnalysisResultPannel = ({ analysisResults }:{ analysisResults: AnalysisResults }) => {
  return (
    <>
       {analysisResults && (
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                Technical Analysis
              </h3>
              
              {/* Sentiment Card */}
              {analysisResults.sentiment?.document && (
                <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-2">Sentiment Analysis</h4>
                  <div className="flex items-center">
                    <span className="w-24 font-medium">Overall:</span>
                    <span className={`px-2 py-1 rounded text-sm font-medium ${
                      analysisResults.sentiment.document.label === 'positive' 
                        ? 'bg-green-100 text-green-800' 
                        : analysisResults.sentiment.document.label === 'negative' 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-gray-100 text-gray-800'
                    }`}>
                      {analysisResults.sentiment.document.label}
                    </span>
                    <span className="ml-auto text-gray-600">
                      Score: {analysisResults.sentiment.document.score.toFixed(2)}
                    </span>
                  </div>
                </div>
              )}

              {/* Emotion Card */}
              {analysisResults.emotion?.document?.emotion && (
                <div className="mb-4 p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-medium text-purple-800 mb-2">Emotional Tone</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(analysisResults.emotion.document.emotion).map(([emotionName, score]) => (
                      <div key={emotionName} className="flex items-center">
                        <span className="w-24 capitalize">{emotionName}:</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-purple-600 h-2.5 rounded-full" 
                            style={{ width: `${score * 100}%` }}
                          ></div>
                        </div>
                        <span className="ml-2 text-sm text-gray-600 w-10">{score.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Keywords Card */}
              {analysisResults.keywords && analysisResults.keywords.length > 0 && (
                <div className="mb-4 p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-800 mb-2">Top Keywords</h4>
                  <div className="flex flex-wrap gap-2">
                    {analysisResults.keywords.map((kw, index) => (
                      <span 
                        key={index} 
                        className="px-2 py-1 bg-white rounded-full text-sm shadow-xs border border-green-100"
                        title={`Relevance: ${kw.relevance.toFixed(2)}`}
                      >
                        {kw.text}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Concepts Card */}
              {analysisResults.concepts && analysisResults.concepts.length > 0 && (
                <div className="mb-4 p-4 bg-yellow-50 rounded-lg">
                  <h4 className="font-medium text-yellow-800 mb-2">Identified Concepts</h4>
                  <ul className="space-y-1">
                    {analysisResults.concepts.map((con, index) => (
                      <li key={index} className="flex justify-between">
                        <span>{con.text}</span>
                        <span className="text-gray-500">Relevance: {con.relevance.toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Entities Card */}
              {analysisResults.entities && analysisResults.entities.length > 0 && (
                <div className="p-4 bg-indigo-50 rounded-lg">
                  <h4 className="font-medium text-indigo-800 mb-2">Recognized Entities</h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-indigo-100">
                        <tr>
                          <th className="px-3 py-2 text-left text-xs font-medium text-indigo-800">Entity</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-indigo-800">Type</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {analysisResults.entities.map((ent, index) => (
                          <tr key={index}>
                            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-600">{ent.text}</td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-600 capitalize">{ent.type}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
    </>
  )
}

export default AnalysisResultPannel
