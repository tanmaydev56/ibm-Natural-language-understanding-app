"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface RecommendationsPanelProps {
  recommendations: string;
}

interface ResumeRating {
  score: number;
  label: string;
  description: string;
}

const RecommendationsPanel = ({ recommendations }: RecommendationsPanelProps) => {
  const [expanded, setExpanded] = useState(false);
  const [rating, setRating] = useState<ResumeRating | null>(null);
  const [loadingRating, setLoadingRating] = useState(true);

  // Parse recommendations and extract rating if available
  useEffect(() => {
    if (!recommendations) return;

    // Try to extract rating from the recommendations
    const ratingMatch = recommendations.match(/OVERALL RATING: (\d+(\.\d+)?)\/10 - (\w+)\n(.*?)(?=\n\n|$)/s);
    if (ratingMatch) {
      setRating({
        score: parseFloat(ratingMatch[1]),
        label: ratingMatch[3],
        description: ratingMatch[4].trim()
      });
    }
    setLoadingRating(false);
  }, [recommendations]);

  if (!recommendations) return null;

  // Enhanced parser that handles markdown-like formatting
  const parseRecommendations = (text: string) => {
    const sections: { title?: string; items: string[] }[] = [];
    let currentSection: { title?: string; items: string[] } = { items: [] };
    
    // First remove the rating part if present
    const contentWithoutRating = text.replace(/OVERALL RATING:.*?(?=\n\n|$)/s, '').trim();
    
    contentWithoutRating.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (!trimmed) return;
      
      // Section headers (ending with :)
      if (trimmed.match(/^[A-Z][A-Z\s]+:$/)) {
        if (currentSection.items.length > 0 || currentSection.title) {
          sections.push(currentSection);
        }
        currentSection = {
          title: trimmed.replace(':', '').trim(),
          items: []
        };
      } 
      // Bullet points
      else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        currentSection.items.push(trimmed.substring(2).trim());
      }
      // Bold text (**text**)
      else if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
        currentSection.items.push(trimmed.substring(2, trimmed.length - 2));
      }
      // Regular text
      else {
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
  };

  // Color based on rating score
  const getRatingColor = (score: number) => {
    if (score >= 8) return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    if (score >= 6) return 'bg-blue-100 text-blue-800 border-blue-200';
    if (score >= 4) return 'bg-amber-100 text-amber-800 border-amber-200';
    return 'bg-red-100 text-red-800 border-red-200';
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
          <h3 className="text-xl font-bold text-gray-800">AI-Powered Resume Analysis</h3>
        </div>
        <span className="ml-auto px-3 py-1 bg-blue-50 text-blue-700 text-sm font-bold rounded-full border border-blue-100">
          Powered by Gemini AI
        </span>
      </div>

      {/* Animated Rating Section */}
      {rating && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 p-5 rounded-lg border"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex-1">
              <h4 className="text-lg font-bold text-gray-800 mb-1">Overall Resume Rating</h4>
              <p className="text-gray-600">{rating.description}</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 }}
                className={`flex items-center justify-center w-20 h-20 rounded-full border-4 ${getRatingColor(rating.score)}`}
              >
                <AnimatePresence>
                  <motion.span 
                    key={rating.score}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl font-bold"
                  >
                    {rating.score.toFixed(1)}
                  </motion.span>
                </AnimatePresence>
              </motion.div>
              <div className="text-right">
                <span className="block text-sm font-medium text-gray-500">Out of 10</span>
                <span className="block text-lg font-bold capitalize">{rating.label}</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Recommendations Sections */}
      <div 
        className={`space-y-6 overflow-hidden transition-all duration-300 ${expanded ? 'max-h-[9999px]' : 'max-h-[400px]'}`}
      >
        {recommendationSections.map((section, sectionIndex) => (
          <motion.div 
            key={sectionIndex}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: sectionIndex * 0.1 }}
            className="space-y-3"
          >
            {section.title && (
              <h4 className="font-bold text-gray-800 flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                {section.title}
              </h4>
            )}
            <ul className="space-y-3 pl-5">
              {section.items.map((item, itemIndex) => (
                <motion.li 
                  key={itemIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: sectionIndex * 0.1 + itemIndex * 0.05 }}
                  className="flex items-start"
                >
                  <span className="text-blue-500 font-bold mr-2 mt-1.5">•</span>
                  <p className="text-gray-700">
                    {item.split('**').map((part, i) => 
                      i % 2 === 1 ? (
                        <span key={i} className="font-bold text-gray-900">{part}</span>
                      ) : (
                        part
                      )
                    )}
                  </p>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      {/* Read More/Less Button - Only show if content is long */}
      {recommendationSections.reduce((acc, section) => acc + section.items.length, 0) > 5 && (
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
      )}

      {/* Enhanced Action Plan */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 p-5 bg-blue-50 rounded-lg border border-blue-100"
      >
        <h4 className="font-bold text-gray-800 mb-3 flex items-center">
          <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          Your Improvement Roadmap
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />,
              title: "Review Analysis",
              description: "Understand your strengths and areas for improvement"
            },
            {
              icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />,
              title: "Implement Changes",
              description: "Apply the recommended modifications to your resume"
            },
            {
              icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />,
              title: "Verify Improvements",
              description: "Re-analyze to confirm your resume's enhanced impact"
            }
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className="p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
            >
              <div className="flex items-start">
                <span className="flex-shrink-0 p-2 bg-blue-100 text-blue-600 rounded-lg mr-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {item.icon}
                  </svg>
                </span>
                <div>
                  <h5 className="font-bold text-gray-800">{item.title}</h5>
                  <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default RecommendationsPanel;