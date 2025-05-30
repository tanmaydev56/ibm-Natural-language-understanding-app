'use client';

import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

export default function SentimentChart({ sentiment }) {
  // Normalize the scores to sum to 1 (100%)
  const total = (sentiment?.positive || 0) + (sentiment?.negative || 0) + (sentiment?.neutral || 0);
  
  const chartData = {
    labels: ['Positive', 'Negative', 'Neutral'],
    datasets: [{
      data: total > 0 ? [
        (sentiment?.positive || 0) / total,
        (sentiment?.negative || 0) / total,
        (sentiment?.neutral || 0) / total
      ] : [1/3, 1/3, 1/3], // Default equal distribution if no data
      backgroundColor: ['#4ade80', '#f87171', '#60a5fa'],
      borderColor: ['#16a34a', '#dc2626', '#2563eb'],
      borderWidth: 1
    }]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.raw || 0;
            return `${label}: ${(value * 100).toFixed(1)}%`;
          }
        }
      }
    }
  };

  return <Pie data={chartData} options={options} />;
}