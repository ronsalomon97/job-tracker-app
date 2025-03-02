import React from 'react';
import ReactModal from 'react-modal';
import JobForm from './JobForm.jsx';

// Set the app element to document.body to avoid inherited opacity from container elements.
ReactModal.setAppElement(document.body);

// Reset ReactModal default inline styles so that your CSS classes can fully control styling.
ReactModal.defaultStyles = {
  overlay: {},
  content: {}
};

function JobFormModalAlt({ mode, initialData, onSubmit, onClose }) {
  return (
    <ReactModal
      isOpen={true}
      onRequestClose={onClose}
      contentLabel={mode === 'add' ? 'Add New Job' : 'Edit Job'}
      className="modal-content"
      overlayClassName="modal-backdrop"
    >
      <h2 className="modal-title">
        {mode === 'add' ? 'Add New Job' : 'Edit Job'}
      </h2>
      <div className="modal-body">
        <JobForm initialData={initialData} onSubmit={onSubmit} onCancel={onClose} />
      </div>
    </ReactModal>
  );
}

export default JobFormModalAlt;
