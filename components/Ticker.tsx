'use client';

import { useEffect, useState } from 'react';

interface TickerReport {
  lat: number;
  lng: number;
  created_at: string;
}

interface TickerProps {
  reports: TickerReport[];
}

// Simple district mapping based on coordinates
const getDistrict = (lat: number, lng: number): string => {
  // TRNC districts approximate boundaries
  if (lat > 35.3 && lng < 33.4) return 'Güzelyurt';
  if (lat > 35.3 && lng > 33.4 && lng < 33.7) return 'Lefkoşa';
  if (lat > 35.3 && lng > 33.7) return 'Girne';
  if (lat < 35.3 && lng < 33.7) return 'Lefke';
  if (lat < 35.3 && lng > 33.7 && lng < 34.5) return 'İskele';
  if (lat < 35.2 && lng > 34.5) return 'Gazimağusa';
  return 'KKTC';
};

// Format time difference
const getTimeAgo = (createdAt: string): string => {
  const now = Date.now();
  const created = new Date(createdAt).getTime();
  const diffMs = now - created;
  const diffMinutes = Math.floor(diffMs / 60000);
  
  if (diffMinutes < 1) return 'Az önce';
  if (diffMinutes === 1) return '1 dk önce';
  if (diffMinutes < 60) return `${diffMinutes} dk önce`;
  
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours === 1) return '1 saat önce';
  return `${diffHours} saat önce`;
};

export default function Ticker({ reports }: TickerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (reports.length === 0) return;

    const interval = setInterval(() => {
      setIsVisible(false);
      
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % reports.length);
        setIsVisible(true);
      }, 500);
    }, 5000);

    return () => clearInterval(interval);
  }, [reports.length]);

  if (reports.length === 0) return null;

  const currentReport = reports[currentIndex];
  const district = getDistrict(currentReport.lat, currentReport.lng);
  const timeAgo = getTimeAgo(currentReport.created_at);

  return (
    <div 
      className="fixed top-0 left-0 right-0 bg-black/70 text-white py-3 px-4 z-[900] backdrop-blur-sm"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <div 
        className={`text-center text-sm md:text-base transition-opacity duration-500 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        📍 <span className="font-semibold">{district}</span> bölgesinden yeni bildirim ({timeAgo})
      </div>
    </div>
  );
}
