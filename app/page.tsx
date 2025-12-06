'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { supabase } from '@/utils/supabaseClient';

const Map = dynamic(() => import('@/components/Map'), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-screen">Harita yükleniyor...</div>
});

interface Report {
  lat: number;
  lng: number;
  intensity?: number;
}

export default function Home() {
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const { data, error } = await supabase
        .from('reports')
        .select('lat, lng')
        .order('created_at', { ascending: false })
        .limit(1000);

      if (error) throw error;

      if (data) {
        setReports(data.map(report => ({
          lat: report.lat,
          lng: report.lng,
          intensity: 1
        })));
      }
    } catch (error) {
      console.error('Veri çekme hatası:', error);
    }
  };

  const handleReport = async () => {
    if (!navigator.geolocation) {
      alert('Tarayıcınız konum özelliğini desteklemiyor.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;

          // Get or create device ID
          let deviceId = localStorage.getItem('device_id');
          if (!deviceId) {
            deviceId = crypto.randomUUID();
            localStorage.setItem('device_id', deviceId);
          }

          // Insert report to Supabase
          const { error } = await supabase
            .from('reports')
            .insert({
              lat: latitude,
              lng: longitude,
              device_id: deviceId
            });

          if (error) throw error;

          alert('Bildiriminiz başarıyla kaydedildi! Teşekkür ederiz.');
          
          // Refresh reports
          fetchReports();
        } catch (error) {
          console.error('Kaydetme hatası:', error);
          alert('Bildiriminiz kaydedilemedi. Lütfen tekrar deneyin.');
        }
      },
      (error) => {
        console.error('Konum hatası:', error);
        alert('Konumunuz alınamadı. Lütfen konum izni verin.');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  return (
    <div className="relative w-full h-screen">
      <Map reports={reports} />
      
      <button
        onClick={handleReport}
        className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-full shadow-lg transition-all duration-200 text-lg z-[1000] flex items-center gap-2"
        aria-label="Elektrik kesintisi bildir"
      >
        Elektrik Yok! ⚡️
      </button>
    </div>
  );
}
