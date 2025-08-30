// src/components/AdoptionModal.js

import React from 'react';
import Modal from 'react-modal';
import { HeartHandshake, X } from 'lucide-react';

// Style for the modal
const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    border: 'none',
    borderRadius: '12px',
    padding: '2rem',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
    maxWidth: '500px',
    width: '90%',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    zIndex: 1001, // Ensure it's above the map
  },
};

// Bind the modal to your app element for accessibility
Modal.setAppElement('#root');

export default function AdoptionModal({ isOpen, onRequestClose, patchInfo }) {
  if (!patchInfo) return null;

  const handleConfirmAdoption = () => {
    // In a real app, this would trigger a payment flow and API call
    alert(`Thank you for adopting Patch #${patchInfo.id}! Your contribution will make a difference.`);
    onRequestClose(); // Close the modal after confirmation
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={customStyles}
      contentLabel="Adoption Confirmation Modal"
    >
      <div className="text-center">
        <button onClick={onRequestClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700">
          <X size={24} />
        </button>
        
        <HeartHandshake size={48} className="mx-auto text-teal-500 mb-4" />
        
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Confirm Your Adoption</h2>
        
        <p className="text-gray-600 mb-6">
          You are about to sponsor the restoration of Mangrove Patch #{patchInfo.id}.
          This vital contribution helps protect our coastlines and fight climate change.
        </p>

        <div className="bg-gray-100 p-4 rounded-lg text-left mb-6">
          <p><strong>Area:</strong> {patchInfo.area} ha</p>
          <p><strong>Est. CO₂ Offset:</strong> {patchInfo.co2} tCO₂/year</p>
        </div>

        <button
          onClick={handleConfirmAdoption}
          className="w-full bg-teal-600 text-white font-bold py-3 px-6 rounded-lg text-lg transition-transform transform hover:scale-105"
        >
          Confirm & Adopt (Mock)
        </button>
      </div>
    </Modal>
  );
}
