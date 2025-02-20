// src/pages/Analytics.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';

// Register ChartJS components required for our charts.
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

function Analytics() {
  const [stats, setStats] = useState(null);

  // Fetch analytics data on component mount.
  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('/api/jobs/stats', { headers: { Authorization: `Bearer ${token}` } })
      .then(response => {
        console.log('Fetched analytics stats:', response.data);
        setStats(response.data);
      })
      .catch(error => console.error('Error fetching analytics:', error));
  }, []);

  // Prepare Pie chart data based on statusStats.
  const pieData = {
    labels: stats && stats.statusStats ? stats.statusStats.map(item => item._id) : [],
    datasets: [{
      data: stats && stats.statusStats ? stats.statusStats.map(item => item.count) : [],
      backgroundColor: ['#4299E1', '#48BB78', '#ED8936', '#ED64A6']
    }]
  };

  // Prepare Bar chart data using trendStats.
  const barLabels = stats && stats.trendStats 
    ? stats.trendStats.map(item => {
        const { year, month } = item._id;
        // Format as "MM/YYYY" (you can adjust format as needed).
        return `${month}/${year}`;
      })
    : [];
    
  const barData = {
    labels: barLabels,
    datasets: [{
      label: "Jobs Applied",
      data: stats && stats.trendStats ? stats.trendStats.map(item => item.count) : [],
      backgroundColor: '#4299E1'
    }]
  };

  return (
    <div className="analytics-page">
      <header className="analytics-navbar">
        <h1 className="analytics-title">Analytics</h1>
        <nav className="analytics-nav">
          <Link to="/" className="nav-link-dashboard">Back to Dashboard</Link>
        </nav>
      </header>
      {stats ? (
        <div className="analytics-charts-wrapper">
          <div className="chart-section">
            <h2 className="chart-section-title">Job Status Distribution</h2>
            <div className="pie-chart-wrapper">
              <Pie data={pieData} width={300} height={300} />
            </div>
          </div>
          <div className="chart-section">
            <h2 className="chart-section-title">Monthly Job Trend</h2>
            <div className="bar-chart-wrapper">
              <Bar data={barData} options={{ maintainAspectRatio: false }} />
            </div>
          </div>
          <div className="analytics-metrics">
            <p className="metrics-text">Total Applications: {stats.additionalMetrics.totalApplications}</p>
            <p className="metrics-text">Active Interviews: {stats.additionalMetrics.activeInterviews}</p>
            <p className="metrics-text">Offers Received: {stats.additionalMetrics.offersReceived}</p>
            <p className="metrics-text">Companies: {stats.additionalMetrics.companies}</p>
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
