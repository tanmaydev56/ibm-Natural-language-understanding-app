"use client";

import { useState } from 'react';

interface RecommendationsPanelProps {
  recommendations: string;
}

const RecommendationsPanel = ({ recommendations }: RecommendationsPanelProps) => {
   const [expanded, setExpanded] = useState(false);
  const [maxHeight, setMaxHeight] = useState('400px'); // Initial max height

  if (!recommendations) return null;

 
  // Parse recommendations into structured sections
  const parseRecommendations = (text: string) => {
    const sections: { title?: string; items: string[] }[] = [];
    let currentSection: { title?: string; items: string[] } = { items: [] };
    
    text.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (!trimmed) return;
      
      if (trimmed.endsWith(':')) {
        if (currentSection.items.length > 0 || currentSection.title) {
          sections.push(currentSection);
        }
        currentSection = {
          title: trimmed.replace(':', '').trim(),
          items: []
        };
      } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        currentSection.items.push(trimmed.substring(2).trim());
      } else {
        currentSection.items.push(trimmed);
      }
    });
    
    if (currentSection.items.length > 0 || currentSection.title) {
      sections.push(currentSection);
    }
    
    return sections;
  };

  const recommendationSections = parseRecommendations(recommendations);

  const toggleExpand = () => {
    setExpanded(!expanded);
    setMaxHeight(expanded ? '400px' : 'none');
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md border border-gray-100">
      <div className="flex items-center mb-6 pb-4 border-b border-gray-200">
        <div className="flex items-center">
          <div className="p-2 bg-blue-100 rounded-lg mr-3">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-800">AI-Powered Resume Recommendations</h3>
        </div>
        <span className="ml-auto px-3 py-1 bg-blue-50 text-blue-700 text-sm font-bold rounded-full border border-blue-100">
          Powered by Gemini AI
        </span>
      </div>
      
      <div 
        className="space-y-6 overflow-hidden transition-all duration-300"
        style={{ maxHeight: maxHeight }}
      >
        {recommendationSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="space-y-3">
            {section.title && (
              <h4 className="font-bold text-gray-800 flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                {section.title}
              </h4>
            )}
            <ul className="space-y-3 pl-5">
              {section.items.map((item, itemIndex) => (
                <li key={itemIndex} className="flex items-start">
                  <span className="text-blue-500 font-bold mr-2 mt-1.5">•</span>
                  <p className="text-gray-700">
                    {item.split('**').map((part, i) => 
                      i % 2 === 1 ? (
                        <span key={i} className="font-bold">{part}</span>
                      ) : (
                        part
                      )
                    )}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Read More/Less Button */}
      <div className="flex justify-center mt-4">
        <button
          onClick={toggleExpand}
          className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors flex items-center"
        >
          {expanded ? (
            <>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
              Show Less
            </>
          ) : (
            <>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              Read More
            </>
          )}
        </button>
      </div>

      <div className="mt-8 p-5 bg-blue-50 rounded-lg border border-blue-100">
        <h4 className="font-bold text-gray-800 mb-3 flex items-center">
          <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          Action Plan
        </h4>
        <ul className="space-y-3">
          {[
            {
              icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />,
              title: "Review Recommendations",
              description: "Carefully examine each suggestion above"
            },
            {
              icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />,
              title: "Implement Changes",
              description: "Update your resume with the suggested improvements"
            },
            {
              icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />,
              title: "Re-upload & Verify",
              description: "Submit your improved resume for another analysis"
            }
          ].map((item, index) => (
            <li key={index} className="flex items-start p-3 bg-white rounded-lg border border-gray-200">
              <span className="flex-shrink-0 p-1 bg-blue-100 text-blue-600 rounded-full mr-3">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {item.icon}
                </svg>
              </span>
              <div>
                <h5 className="font-bold text-gray-800">{item.title}</h5>
                <p className="text-sm text-gray-600 font-medium mt-1">{item.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RecommendationsPanel;