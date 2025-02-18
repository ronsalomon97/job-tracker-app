import React from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import JobForm from './JobForm';

function JobFormalModal({ mode, initalData, onSubmit, onClose }){
    return (
        <Transition appear show as={Fragment}>
            <Dialog as='div' className="modal-overlay" onClose={onClose}>
                <div className='modal-container'>
                    <Transition.Child
                        as={Fragment}
                        enter="modal-overlay-enter" enterFrom="modal-overlay-from" enterTo="modal-overlay-to"
                        leave="modal-overlay-leave" leaveFrom="modal-overlay-leave-from" leaveTo="modal-overlay-leave-to"
                    >
                        <Dialog.Overlay className="modal-backdrop" />
                    </Transition.Child>
  
                    {/* This invisible span is a trick used to help vertically center the modal content in the viewport. */}
                    <span className="modal-center-helper" aria-hidden="true">&#8203;</span>

                    <Transition.Child
                        as={Fragment}
                        enter="modal-content-enter" enterFrom="modal-content-from" enterTo="modal-content-to"
                        leave="modal-content-leave" leaveFrom="modal-content-leave-from" leaveTo="modal-content-leave-to"
                    >
                        <div className="modal-content">
                            
                            <Dialog.Title className="modal-title">
                                {mode === 'add' ? 'Add New Job' : 'Edit Job'}
                            </Dialog.Title>

                            <div className="modal-body">
                                <JobForm initialData={initialData} onSubmit={onSubmit} onCancel={onClose} />
                            </div>

                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>

    );
}

export default JobFormalModal;