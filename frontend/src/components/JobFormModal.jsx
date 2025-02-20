// src/components/JobFormModal.jsx
import React, { Fragment } from 'react';
import { Dialog, Transition, TransitionChild } from '@headlessui/react';
import JobForm from './JobForm.jsx';

function JobFormModal({ mode, initialData, onSubmit, onClose }) {
  return (
    <Transition appear show as={Fragment}>
      <Dialog as="div" className="modal-overlay" onClose={onClose}>
        <div className="modal-container">
          <TransitionChild
            as={Fragment}
            enter="transition-opacity duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="modal-backdrop" />
          </TransitionChild>

          {/* This invisible span helps vertically center the modal content */}
          <span className="modal-center-helper" aria-hidden="true">&#8203;</span>

          <TransitionChild
            as={Fragment}
            enter="transition-opacity duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="transition-opacity duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="modal-content">
              <Dialog.Title className="modal-title">
                {mode === 'add' ? 'Add New Job' : 'Edit Job'}
              </Dialog.Title>
              <div className="modal-body">
                <JobForm 
                  initialData={initialData}
                  onSubmit={onSubmit}
                  onCancel={onClose}
                />
              </div>
            </div>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
}

export default JobFormModal;
