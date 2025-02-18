import React, { useState, useEffect } from 'react';

function JobForm({ initialData, onSubmit, onCancel}){

    const [formData, setFormData] = useState({
        company: '',
        title: '',
        status: 'applied',
        dateApplied: '',
        notes: ''
    });

    //Pre-fill the form if editing 
    useEffect(() => {
        if (initialData){
            const formattedDate = new Date(initialData.dateApplied).toISOString().split('T')[0];
            setFormData({
                company: initialData.company,
                title: initialData.title,
                status: initialData.status,
                dateApplied: formattedDate,
                notes: initialData.notes || ''
              });
        }
    }, [initialData]);

    //Handles changes using setFormDate - state
    const handleChange = (e) => {
        const {name, value } = e.target;
        setFormData(prev => ({...prev, [name]: value}));
    };

    //Purpose: Prevents the default behavior of the form submission.
    //Default Behavior: In a traditional HTML form, submitting the form would cause the page to refresh or navigate away.
    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    }


    return (
        <form onSubmit={handleSubmit} className='job-form'>
            {/* Company Name */}
            <div className='form-group'>
                <label className='form-label'>Company Name</label>
                <input 
                    type='text'
                    name='company'
                    value={formData.company}
                    onChange={handleChange}
                    placeholder='Enter Company Name'
                    className='form-input'
                    required
                />  
            </div>

            {/* Job Title */}
            <div className="form-group">
                <label className="form-label">Job Title</label>
                <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter job title"
                className="form-input"
                required
                />
            </div>

            {/* Status Dropdown */}
            <div className="form-group">
                <label className="form-label">Status</label>
                <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="form-select"
                required
                >
                    <option value="applied">Applied</option>
                    <option value="interview">Interview</option>
                    <option value="rejected">Rejected</option>
                    <option value="offer">Offer</option>
                </select>
            </div>

            {/* Date Applied */}
            <div className="form-group">
                <label className="form-label">Date Applied</label>
                <input
                type="date"
                name="dateApplied"
                value={formData.dateApplied}
                onChange={handleChange}
                className="form-input"
                required
                />
            </div>

            {/* Notes */}
            <div className="form-group">
                <label className="form-label">Notes</label>
                <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Enter additional notes (optional)"
                className="form-textarea"
                rows="3"
                ></textarea>
            </div>

            {/* Action Buttons */}
            {/* The save button - Trigered the form onSubmit because the type is - submit */}
            <div className="form-actions">
                <button type="button" onClick={onCancel} className="cancel-button">
                Cancel
                </button>
                <button type="submit" className="submit-button">
                Save
                </button>
            </div>
        </form>
    );
}
export default JobForm