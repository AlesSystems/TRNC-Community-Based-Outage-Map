'use client';

import { useState } from 'react';

export default function LegalModal() {
  const [isOpen, setIsOpen] = useState(() => {
    // Initialize state based on localStorage
    if (typeof window !== 'undefined') {
      try {
        const hasSeenLegal = localStorage.getItem('has_seen_legal');
        return !hasSeenLegal;
      } catch (error) {
        console.error('localStorage hatası:', error);
        return false;
      }
    }
    return false;
  });

  const handleAccept = () => {
    try {
      localStorage.setItem('has_seen_legal', 'true');
      setIsOpen(false);
    } catch (error) {
      console.error('localStorage hatası:', error);
      setIsOpen(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm"
        onClick={handleAccept}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-2xl max-w-md w-full mx-4 p-6 animate-in fade-in zoom-in duration-300">
        {/* Title */}
        <h2 className="text-2xl font-bold text-red-600 mb-4 text-center">
          Önemli Uyarı
        </h2>
        
        {/* Content */}
        <p className="text-gray-700 text-base leading-relaxed mb-6 text-center">
          Bu haritadaki veriler tamamen kullanıcı bildirimlerine dayanmaktadır. 
          Resmi KIBTEK verisi değildir ve kesin doğruluk taahhüt etmez. 
          Lütfen resmi duyuruları takip ediniz.
        </p>
        
        {/* Button */}
        <button
          onClick={handleAccept}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          aria-label="Feragati kabul et ve kapat"
        >
          Anladım ve Kabul Ediyorum
        </button>
      </div>
    </div>
  );
}
