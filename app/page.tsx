'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { supabase } from '@/utils/supabaseClient';
import { toast } from 'sonner';

const Map = dynamic(() => import('@/components/Map'), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-screen">Harita yükleniyor...</div>
});

const LegalModal = dynamic(() => import('@/components/LegalModal'), {
  ssr: false
});

const Ticker = dynamic(() => import('@/components/Ticker'), {
  ssr: false
});

interface Report {
  lat: number;
  lng: number;
  intensity?: number;
}

interface TickerReport {
  lat: number;
  lng: number;
  created_at: string;
}

// Time window for reports in hours
const TIME_WINDOW_HOURS = 2;

// Rate limiting time in minutes
const RATE_LIMIT_MINUTES = 10;

export default function Home() {
  const [reports, setReports] = useState<Report[]>([]);
  const [recentReports, setRecentReports] = useState<TickerReport[]>([]);

  useEffect(() => {
    fetchReports();
    fetchRecentReports();

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
            
            // Update recent reports for ticker
            setRecentReports(prev => [{
              lat: newReport.lat,
              lng: newReport.lng,
              created_at: newReport.created_at
            }, ...prev].slice(0, 5));
            
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

  const fetchRecentReports = async () => {
    try {
      const { data, error } = await supabase
        .from('reports')
        .select('lat, lng, created_at')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;

      if (data) {
        setRecentReports(data);
      }
    } catch (error) {
      console.error('Son bildirimler çekme hatası:', error);
    }
  };

  const handleReport = async () => {
    // Rate limiting kontrolü
    try {
      const lastReportTime = localStorage.getItem('last_report_time');
      if (lastReportTime) {
        const currentTime = Date.now();
        const timeDiff = currentTime - Number(lastReportTime);
        const rateLimitMs = RATE_LIMIT_MINUTES * 60 * 1000;
        
        if (timeDiff < rateLimitMs) {
          toast.warning('Çok hızlı gidiyorsun! Bildirimler arasında 10 dakika beklemelisin.');
          return;
        }
      }
    } catch (error) {
      console.error('Rate limiting hatası:', error);
    }

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

          // Başarılı bildirim sonrası zamanı kaydet
          try {
            localStorage.setItem('last_report_time', Date.now().toString());
          } catch (error) {
            console.error('localStorage hatası:', error);
          }

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
      <Ticker reports={recentReports} />
      <Map reports={reports} />
      
      {/* Navigation Menu */}
      <div className="fixed top-16 right-4 z-[900] flex flex-col gap-2">
        <a
          href="/guide"
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-all duration-200 text-center"
          aria-label="Nasıl kullanılır kılavuzu"
        >
          ❓ Nasıl Kullanılır?
        </a>
        <a
          href="/stats"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-all duration-200 text-center"
          aria-label="İstatistikleri görüntüle"
        >
          📊 İstatistikler
        </a>
        <a
          href="/calculator"
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-all duration-200 text-center"
          aria-label="Jeneratör hesaplayıcı"
        >
          ⚡️ Hesaplayıcı
        </a>
      </div>
      
      <button
        onClick={handleReport}
        className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-full shadow-lg transition-all duration-200 text-lg z-[1000] flex items-center gap-2"
        aria-label="Elektrik kesintisi bildir"
      >
        Elektrik Yok! ⚡️
      </button>

      <LegalModal />
    </div>
  );
}
