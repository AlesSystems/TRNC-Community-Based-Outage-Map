'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { supabase } from '@/utils/supabaseClient';
import { toast } from 'sonner';
import { Zap, BarChart3, HelpCircle, Calculator } from 'lucide-react';

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

// KKTC Geographic Boundaries
const KKTC_BOUNDS = {
  minLat: 34.9,  // Güney ucu
  maxLat: 35.8,  // Kuzey ucu
  minLng: 32.2,  // Batı ucu (Güzelyurt tarafı)
  maxLng: 34.7   // Doğu ucu (Karpaz tarafı)
};

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

          // Bounding box kontrolü
          if (
            latitude < KKTC_BOUNDS.minLat ||
            latitude > KKTC_BOUNDS.maxLat ||
            longitude < KKTC_BOUNDS.minLng ||
            longitude > KKTC_BOUNDS.maxLng
          ) {
            toast.error('Bu hizmet sadece KKTC sınırları içinde kullanılabilir. Konumunuz kapsama alanı dışında.');
            return;
          }

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
      
      {/* Modern Navigation Dock */}
      <div className="fixed top-20 right-4 z-[900] flex flex-col gap-3">
        <div className="glass p-2 rounded-2xl flex flex-col gap-2 shadow-2xl bg-black/20">
          <a
            href="/guide"
            className="group flex items-center justify-center w-12 h-12 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-200 relative"
            aria-label="Nasıl kullanılır kılavuzu"
          >
            <HelpCircle className="w-6 h-6 text-blue-400" />
            <span className="absolute right-full mr-3 px-2 py-1 bg-black/80 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none backdrop-blur-sm">
              Nasıl Kullanılır?
            </span>
          </a>
          
          <a
            href="/stats"
            className="group flex items-center justify-center w-12 h-12 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-200 relative"
            aria-label="İstatistikleri görüntüle"
          >
            <BarChart3 className="w-6 h-6 text-green-400" />
            <span className="absolute right-full mr-3 px-2 py-1 bg-black/80 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none backdrop-blur-sm">
              İstatistikler
            </span>
          </a>
          
          <a
            href="/calculator"
            className="group flex items-center justify-center w-12 h-12 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-200 relative"
            aria-label="Jeneratör hesaplayıcı"
          >
            <Calculator className="w-6 h-6 text-purple-400" />
            <span className="absolute right-full mr-3 px-2 py-1 bg-black/80 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none backdrop-blur-sm">
              Hesaplayıcı
            </span>
          </a>
        </div>
      </div>
      
      {/* Main Action Button (Floating) */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-[1000]">
        {/* Pulse Effect Ring */}
        <div className="absolute inset-0 bg-red-600 rounded-full animate-ping opacity-20 duration-1000"></div>
        
        <button
          onClick={handleReport}
          className="relative group bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-bold py-4 px-8 rounded-full shadow-[0_0_40px_rgba(220,38,38,0.5)] transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center gap-3 border border-red-400/30"
          aria-label="Elektrik kesintisi bildir"
        >
          <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
            <Zap className="w-6 h-6 text-white fill-white" />
          </div>
          <span className="text-lg tracking-wide text-shadow-sm">Elektrik Yok!</span>
        </button>
      </div>

      <LegalModal />
    </div>
  );
}
