import React from 'react';

const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null; // Jika modal tidak terbuka, tidak merender apa-apa

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 h-screen overflow-y-auto p-6">
            <div className="bg-white border-2 text-gray-900 border-gray-200 p-4 rounded-lg lg:w-1/2 w-full mx-3">
                {children}
            </div>
        </div>
    );
};

export default Modal;
