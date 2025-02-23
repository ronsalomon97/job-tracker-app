import React from 'react';

function JobCard({ job, onClick }) {
  return (
    <div onClick={onClick} className="job-card">
      <h2 className="job-card-company">{job.company}</h2>
      <p className="job-card-title">{job.title}</p>
      {job.location && <p className="job-card-location">{job.location}</p>}
      <div className="job-card-info">
        <span className={`job-card-status status-${job.status}`}>
          {job.status}
        </span>
        <span className="job-card-date">
          {new Date(job.dateApplied).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
}

export default JobCard;
