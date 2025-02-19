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
            enter="modal-overlay-enter"
            enterFrom="modal-overlay-from"
            enterTo="modal-overlay-to"
            leave="modal-overlay-leave"
            leaveFrom="modal-overlay-leave-from"
            leaveTo="modal-overlay-leave-to"
          >
            <Dialog.Overlay className="modal-backdrop" />
          </TransitionChild>

          {/* This invisible span helps vertically center the modal content */}
          <span className="modal-center-helper" aria-hidden="true">&#8203;</span>

          <TransitionChild
            as={Fragment}
            enter="modal-content-enter"
            enterFrom="modal-content-from"
            enterTo="modal-content-to"
            leave="modal-content-leave"
            leaveFrom="modal-content-leave-from"
            leaveTo="modal-content-leave-to"
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
