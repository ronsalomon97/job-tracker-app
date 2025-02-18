import React, { useState, useEffect } from 'react';
import axios from 'axios';
import JobCard from '../components/JobCard';
import JobFormModal from '../components/JobFormModal';

function Dashboard() {

    
    // State for job data
    const [jobs, setJobs] = useState([]);

    // Modal state: open flag, mode ('add' or 'edit'), and job to edit
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add');
    const [selectedJob, setSelectedJob] = useState(null);

    // Fetch jobs from API on mount
    useEffect(() => {
        const token = localStorage.getItem('token');
        axios.get('/api/jobs', {headers: {Authorization: `Bearer${token}`}})
        .then(response =>{ 
            console.log('Fetched jobs:', response.data);
            setJobs(response.data)
        
        }
        )
        .catch(error => console.error('Error fetching jobs:' , error));
    },[]);

    // Handlers for modal actions
    const openAddModal = () => {
        setModalMode('add');
        setSelectedJob(null);
        setIsModalOpen(true);
      };

      const openEditModal = (job) => {
        setModalMode('edit');
        setSelectedJob(job);
        setIsModalOpen(true);
      };

      const handleJobSubmit = (jobData) => {
       
        const token = localStorage.getItem('token');
      
        if (modalMode == 'add'){
            axios.post('/api/jobs', jobData, { headers: { Authorization: `Bearer ${token}` } })
            .then(response => {
                setJobs([...jobs, response.data]);
                setIsModalOpen(false);
            })
            .catch(error => console.error('Error adding job:', error));
            
        } else if (modalMode == 'edit' && selectedJob){
            axios.put(`/api/jobs/${selectedJob._id}`, jobData, { headers: { Authorization: `Bearer ${token}` } })
            .then(response => {
                const updatedJobs = jobs.map(job => {
                    job._id === response.data._id ? response.data : job
                });
                setJobs(updatedJobs);
                setIsModalOpen(false);
            })
            .catch(error => console.error('Erorr updating job:', error));
        }
        }

    return (
        <div className='dashboard-container'>   
            <header className='dashboard-navbar'>
                <h1 className='dashboard-title'>Job Tracker App</h1>
                {/* ----------------- Future: Add navigation links  ----------------------- */}
            </header>

            {/* Job Cards Grid */}
            <div className='jobs-grid'>
                {jobs.map(job => {
                    <JobCard key={job.id} job={job} onClick={() => openEditModal(job)} />
                })}
            </div>

            {/* Floating Action Button */}
            <button onClick={openAddModal} className="floating-add-button">
                +
            </button>

            {/* Modal for Add/Edit Job */}
            {isModalOpen && (
            <JobFormModal
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