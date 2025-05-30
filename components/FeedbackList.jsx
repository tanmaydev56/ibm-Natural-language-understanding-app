'use client';

import { format } from 'date-fns';

export default function FeedbackList({ feedbacks, onSelectFeedback }) {
  return (
    <div className="space-y-4">
      {feedbacks.map((feedback) => (
        <div 
          key={feedback.id} 
          className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
          onClick={() => onSelectFeedback(feedback)}
        >
          <div className="flex justify-between items-start">
            <h3 className="font-medium">{feedback.customer_name || 'Anonymous'}</h3>
            <span className="text-sm text-gray-500">
              {format(new Date(feedback.created_at), 'MMM d, yyyy')}
            </span>
          </div>
          <p className="mt-2 text-gray-600">{feedback.comment}</p>
          {feedback.rating && (
            <div className="mt-2 flex items-center">
              <span className="text-sm text-gray-500 mr-2">Rating:</span>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-4 h-4 ${i < feedback.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}