import React, { useState, useEffect } from 'react';
import axios from 'axios';
import JobCard from '../components/JobCard';
import JobFormModal from '../components/JobFormModal';

function Dashboard() {
    
   // State for job data
  const [jobs, setJobs] = useState([]);

return (
    <div className='dashboard-container'>   
        <header className='dashboard-navbar'>
            <h1 className='dashboard-title'>Job Tracker App</h1>
            {/* ----------------- Future: Add navigation links  ----------------------- */}
        </header>

        <div className='jobs-grid'>
            {jobs.map(job => {
                <JobCard key={job.id} job={job} onClick={() => openEditModal(job)} />
            })}


        </div>
    </div>
);
}

export default Dashboard;