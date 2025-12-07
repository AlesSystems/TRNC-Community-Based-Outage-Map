'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabaseClient';
import Link from 'next/link';
import { toast } from 'sonner';
import { ArrowLeft, BarChart2, MapPin, Share2, Zap, AlertTriangle } from 'lucide-react';

interface DistrictStats {
  district: string;
  count: number;
}

// Simple district mapping based on coordinates
const getDistrict = (lat: number, lng: number): string => {
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
  
  return 'Diğer';
};

export default function StatsPage() {
  const [stats, setStats] = useState<DistrictStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalReports, setTotalReports] = useState(0);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

      const { data, error } = await supabase
        .from('reports')
        .select('lat, lng')
        .gte('created_at', twentyFourHoursAgo)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        setTotalReports(data.length);
        
        const districtMap: { [key: string]: number } = {};
        
        data.forEach((report) => {
          const district = getDistrict(report.lat, report.lng);
          districtMap[district] = (districtMap[district] || 0) + 1;
        });

        const statsArray = Object.entries(districtMap)
          .map(([district, count]) => ({ district, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);

        setStats(statsArray);
      }
    } catch (error) {
      console.error('İstatistik çekme hatası:', error);
      toast.error('İstatistikler yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: 'KKTC Kesinti İstatistikleri',
      text: 'Son 24 saatteki elektrik kesinti istatistiklerini kontrol et!',
      url: window.location.href,
    };

    if (navigator.share && navigator.canShare?.(shareData)) {
      try {
        await navigator.share(shareData);
        toast.success('Paylaşıldı!');
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          console.error('Paylaşım hatası:', error);
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Link kopyalandı!');
      } catch {
        console.error('Link kopyalanamadı');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-red-500/30 border-t-red-500 rounded-full animate-spin" />
          <div className="text-neutral-400 animate-pulse">Veriler analiz ediliyor...</div>
        </div>
      </div>
    );
  }

  const maxCount = stats[0]?.count || 1;

  return (
    <div className="min-h-screen bg-neutral-950 text-white selection:bg-red-500/30">
      <div className="max-w-5xl mx-auto p-6 md:p-8">
        
        {/* Header Section */}
        <header className="mb-12 animate-fade-in">
          <Link 
            href="/"
            className="group inline-flex items-center text-neutral-400 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Ana Sayfa
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-500">
                Kesinti Raporu
              </h1>
              <div className="flex items-center gap-2 text-neutral-400">
                <BarChart2 className="w-4 h-4" />
                <span>Son 24 saatlik ağ durumu analizi</span>
              </div>
            </div>
            
            <button
              onClick={handleShare}
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all duration-300 hover:scale-105 active:scale-95 backdrop-blur-sm group"
            >
              <Share2 className="w-4 h-4 text-neutral-300 group-hover:text-white transition-colors" />
              <span className="text-sm font-medium text-neutral-300 group-hover:text-white">Paylaş</span>
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Key Metric Card */}
          <div className="lg:col-span-1 animate-slide-up [animation-delay:100ms]">
            <div className="h-full glass-card rounded-2xl p-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Zap className="w-32 h-32 text-red-500" />
              </div>
              
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  <h2 className="text-neutral-400 font-medium mb-1 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Toplam Bildirim
                  </h2>
                  <div className="text-6xl md:text-7xl font-bold text-white tracking-tight">
                    {totalReports}
                  </div>
                </div>
                
                <div className="mt-8 pt-6 border-t border-white/5">
                  <p className="text-sm text-neutral-500 leading-relaxed">
                    Kullanıcılar tarafından son 24 saat içinde raporlanan toplam elektrik kesintisi sayısı.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Leaderboard Section */}
          <div className="lg:col-span-2 animate-slide-up [animation-delay:200ms]">
            <div className="glass-card rounded-2xl p-6 md:p-8 h-full">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-red-500" />
                Etkilenen Bölgeler
              </h2>
              
              {stats.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 text-neutral-500 border border-dashed border-neutral-800 rounded-xl bg-neutral-900/50">
                  <Zap className="w-8 h-8 mb-3 opacity-20" />
                  <p>Veri bulunamadı veya kesinti yok</p>
                </div>
              ) : (
                <div className="space-y-5">
                  {stats.map((stat, index) => (
                    <div 
                      key={stat.district} 
                      className="group relative"
                      style={{ animationDelay: `${(index + 2) * 100}ms` }}
                    >
                      {/* Background Bar (Ghost) */}
                      <div className="absolute inset-0 bg-white/0 rounded-lg group-hover:bg-white/[0.02] transition-colors -mx-2 -my-1 px-2 py-1" />
                      
                      <div className="flex items-center justify-between mb-2 relative z-10">
                        <div className="flex items-center gap-4">
                          <div className={`
                            flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold
                            ${index === 0 ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 
                              index === 1 ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' : 
                              index === 2 ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' : 
                              'bg-neutral-800 text-neutral-400'}
                          `}>
                            {index + 1}
                          </div>
                          <span className="font-medium text-lg text-neutral-200 group-hover:text-white transition-colors">
                            {stat.district}
                          </span>
                        </div>
                        <span className="text-neutral-400 font-mono text-sm bg-neutral-900 px-2 py-1 rounded border border-neutral-800">
                          {stat.count}
                        </span>
                      </div>
                      
                      {/* Progress Bar Container */}
                      <div className="h-2 w-full bg-neutral-800/50 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-1000 ease-out ${
                             index === 0 ? 'bg-gradient-to-r from-red-600 to-red-500 shadow-[0_0_12px_rgba(239,68,68,0.4)]' : 
                             index === 1 ? 'bg-gradient-to-r from-orange-600 to-orange-500' :
                             'bg-neutral-600'
                          }`}
                          style={{ width: `${(stat.count / maxCount) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="mt-12 text-center animate-fade-in [animation-delay:500ms]">
          <p className="text-neutral-600 text-sm">
            Veriler topluluk bildirimlerine dayanmaktadır ve resmi kurum verisi değildir.
          </p>
        </div>
      </div>
    </div>
  );
}