'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { supabase } from '@/utils/supabaseClient';
import { toast } from 'sonner';

const Map = dynamic(() => import('@/components/Map'), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-screen">Harita yükleniyor...</div>
});

interface Report {
  lat: number;
  lng: number;
  intensity?: number;
}

// Time window for reports in hours
const TIME_WINDOW_HOURS = 2;

export default function Home() {
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    fetchReports();

    // Setup realtime subscription
    const channel = supabase
      .channel('reports-channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'reports'
        },
        (payload) => {
          const newReport = payload.new as { lat: number; lng: number; created_at: string };
          
          // Check if the new report is within time window
          const reportTime = new Date(newReport.created_at).getTime();
          const currentTime = Date.now();
          const timeWindowMs = TIME_WINDOW_HOURS * 60 * 60 * 1000;
          
          if (currentTime - reportTime <= timeWindowMs) {
            setReports(prev => [...prev, {
              lat: newReport.lat,
              lng: newReport.lng,
              intensity: 1
            }]);
            toast.info('Harita güncellendi - Yeni kesinti bildirimi alındı');
          }
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchReports = async () => {
    try {
      // Calculate time threshold (2 hours ago)
      const timeThreshold = new Date(Date.now() - TIME_WINDOW_HOURS * 60 * 60 * 1000).toISOString();

      const { data, error } = await supabase
        .from('reports')
        .select('lat, lng')
        .gte('created_at', timeThreshold)
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
      toast.error('Harita verileri yüklenemedi');
    }
  };

  const handleReport = async () => {
    if (!navigator.geolocation) {
      toast.error('Tarayıcınız konum özelliğini desteklemiyor');
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

          toast.success('Bildirim alındı! Harita güncelleniyor...');
          
          // Refresh reports
          fetchReports();
        } catch (error) {
          console.error('Kaydetme hatası:', error);
          toast.error('Bildiriminiz kaydedilemedi. Lütfen tekrar deneyin');
        }
      },
      (error) => {
        console.error('Konum hatası:', error);
        toast.error('Konumunuz alınamadı. Lütfen konum izni verin');
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
