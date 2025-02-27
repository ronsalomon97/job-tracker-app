// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import API from '../api/axios'; // Updated import
import JobCard from '../components/JobCard';
import JobFormModalAlt from '../components/JobFormModalAlt';
import LogoutButton from "../components/LogoutButton";

function Dashboard() {
  // State for job data
  const [jobs, setJobs] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');

  // Modal state: open flag, mode ('add' or 'edit'), and job to edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedJob, setSelectedJob] = useState(null);
  

  // Fetch jobs from API on mount
  useEffect(() => {
    API.get('/api/jobs') // Updated request
    .then(response => { 
      setJobs(response.data);
    })
    .catch(error => console.error('Error fetching jobs:', error));
  }, []);
  

  const filteredJobs = filterStatus === 'all' ? jobs 
  : jobs.filter(job => job.status === filterStatus);

    const openAddModal = () => {
        if (!isModalOpen) {
        setModalMode('add');
        setSelectedJob(null);
        setIsModalOpen(true);
        } else {
        // If modal is already open, just update mode/data
        setModalMode('add');
        setSelectedJob(null);
        }
    };

  const openEditModal = (job) => {
    setModalMode('edit');
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  const handleJobSubmit = (jobData) => {
    const token = localStorage.getItem('token');

    if (modalMode === 'add') {
      API.post('/api/jobs', jobData) // Updated request
      .then(response => {
          setJobs([...jobs, response.data]);
          setIsModalOpen(false);
        })
        .catch(error => console.error('Error adding job:', error));
    } else if (modalMode === 'edit' && selectedJob) {
      API.put(`/api/jobs/${selectedJob._id}`, jobData) // Updated request
        .then(response => {
          const updatedJobs = jobs.map(job => 
            job._id === response.data._id ? response.data : job
          );
          setJobs(updatedJobs);
          setIsModalOpen(false);
        })
        .catch(error => console.error('Error updating job:', error));
    }
  };

  return (
    <div className="dashboard-container">
        <header className="dashboard-navbar">
            <h1 className="dashboard-title">Job Tracker App</h1>
            <nav>
                <a href="/analytics" className="text-blue-600 hover:underline">Analytics</a>
                <LogoutButton />
            </nav>      
        </header>

      {/* Filter Section */}
      <div className='dashboard-filter'>
        <label htmlFor="statusFilter" className="dashboard-filter__label">Filter by Status:</label>
        <select
            id="statusFilter"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="dashboard-filter__select"
        >
            <option value="all">All</option>
            <option value="applied">Applied</option>
            <option value="interview">Interview</option>
            <option value="rejected">Rejected</option>
            <option value="offer">Offer</option>
        </select>
      </div>
    
      {/* Jobs Grid */}
      <div className="jobs-grid">
        {filteredJobs.map(job => (
          <JobCard key={job._id} job={job} onClick={() => openEditModal(job)} />
        ))}
      </div>

      {filteredJobs.length === 0 && (
        <div className="empty-jobs-message text-center text-gray-600 text-xl mt-8">
          No jobs available. Click the "+" button to add a new job.
        </div>
      )}

      {/* Floating Action Button */}
      <button onClick={openAddModal} className="floating-add-button">
        +
      </button>

      {/* Modal for Add/Edit Job */}
      {isModalOpen && (
        <JobFormModalAlt
          mode={modalMode}
          initialData={selectedJob}
          onSubmit={handleJobSubmit}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}

export default Dashboard;
