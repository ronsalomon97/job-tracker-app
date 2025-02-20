// src/pages/Analytics.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';

// Register necessary ChartJS components for our charts
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

function Analytics() {
  const [stats, setStats] = useState(null);

  // Fetch analytics data from backend when component mounts
  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('/api/jobs/stats', { headers: { Authorization: `Bearer ${token}` } })
      .then(response => {
        console.log('Fetched analytics stats:', response.data);
        setStats(response.data);
      })
      .catch(error => console.error('Error fetching analytics:', error));
  }, []);

  // Prepare data for the Pie chart based on the statusStats array
  const pieData = {
    labels: stats && stats.statusStats ? stats.statusStats.map(item => item._id) : [],
    datasets: [{
      data: stats && stats.statusStats ? stats.statusStats.map(item => item.count) : [],
      backgroundColor: ['#4299E1', '#48BB78', '#ED8936', '#ED64A6']
    }]
  };

  return (
    <div className="analytics-page">
      <h1 className="analytics-title">Analytics</h1>
      {stats ? (
        <div className="analytics-chart-container">
          <Pie data={pieData} />
          <div className="analytics-metrics">
            <p className="metrics-text">Total Jobs: {stats.additionalMetrics.totalJobs}</p>
            <p className="metrics-text">Months: {stats.additionalMetrics.months}</p>
            <p className="metrics-text">
              Average Jobs per Month: {stats.additionalMetrics.avgJobsPerMonth.toFixed(2)}
            </p>
          </div>
        </div>
      ) : (
        <p className="no-analytics-message">No analytics data available.</p>
      )}
    </div>
  );
}

export default Analytics;
