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
  // Güzelyurt: Kuzeybatı, batı kısmı (Merkez: ~35.19°K, 32.83°D)
  // Latitude: 35.15-35.25, Longitude: 32.7-33.2
  if (lat >= 35.15 && lat <= 35.25 && lng >= 32.7 && lng < 33.2) return 'Güzelyurt';
  
  // Lefkoşa: Merkez bölge (Merkez: ~35.18°K, 33.38°D)
  // Latitude: 35.15-35.25, Longitude: 33.2-33.6
  if (lat >= 35.15 && lat <= 35.25 && lng >= 33.2 && lng < 33.6) return 'Lefkoşa';
  
  // Girne: Kuzey kıyı, batıdan doğuya (Merkez: ~35.34°K, 33.32°D)
  // Alsancak, Yeşiltepe, Lapta, Girne şehir merkezi dahil
  // Latitude: 35.1-35.4, Longitude: 33.0-33.8
  if (lat >= 35.1 && lat <= 35.4 && lng >= 33.0 && lng < 33.8) return 'Girne';
  
  // Lefke: Güneybatı (Merkez: ~35.11°K, 32.85°D)
  // Latitude: 35.05-35.2, Longitude: 32.7-33.2
  if (lat >= 35.05 && lat < 35.2 && lng >= 32.7 && lng < 33.2) return 'Lefke';
  
  // İskele: Doğu orta bölge (Merkez: ~35.29°K, 33.89°D)
  // Latitude: 35.2-35.35, Longitude: 33.6-34.2
  if (lat >= 35.2 && lat <= 35.35 && lng >= 33.6 && lng < 34.2) return 'İskele';
  
  // Gazimağusa: Güneydoğu (Merkez: ~35.13°K, 33.95°D)
  // Latitude: 35.05-35.2, Longitude: 33.8-34.2
  if (lat >= 35.05 && lat < 35.2 && lng >= 33.8 && lng < 34.2) return 'Gazimağusa';
  
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
