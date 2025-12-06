'use client';

import { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Zap, 
  Tv, 
  Wifi, 
  Monitor, 
  Waves, 
  Thermometer, 
  Lightbulb, 
  Minus, 
  Plus, 
  Info,
  RefreshCcw
} from 'lucide-react';

interface Device {
  name: string;
  watts: number;
  icon: React.ElementType;
}

const devices: Device[] = [
  { name: 'Buzdolabı', watts: 150, icon: Thermometer },
  { name: 'Klima (12000 BTU)', watts: 1200, icon: Waves },
  { name: 'Su Motoru (1 HP)', watts: 746, icon: RefreshCcw },
  { name: 'Çamaşır Makinesi', watts: 500, icon: Waves },
  { name: 'Televizyon', watts: 100, icon: Tv },
  { name: 'Bilgisayar', watts: 300, icon: Monitor },
  { name: 'Wi-Fi Router', watts: 10, icon: Wifi },
  { name: 'Aydınlatma', watts: 40, icon: Lightbulb },
];

export default function CalculatorPage() {
  const [counts, setCounts] = useState<{ [key: string]: number }>(
    devices.reduce((acc, device) => ({ ...acc, [device.name]: 0 }), {})
  );

  const increment = useCallback((deviceName: string) => {
    setCounts((prev) => ({
      ...prev,
      [deviceName]: prev[deviceName] + 1,
    }));
  }, []);

  const decrement = useCallback((deviceName: string) => {
    setCounts((prev) => ({
      ...prev,
      [deviceName]: Math.max(0, prev[deviceName] - 1),
    }));
  }, []);

  const reset = useCallback(() => {
    setCounts(devices.reduce((acc, device) => ({ ...acc, [device.name]: 0 }), {}));
  }, []);

  const totalWatts = useMemo(() => {
    return devices.reduce((sum, device) => {
      return sum + device.watts * counts[device.name];
    }, 0);
  }, [counts]);

  const recommendedKva = useMemo(() => {
    const kva = (totalWatts / 1000) * 1.2;
    return kva.toFixed(2);
  }, [totalWatts]);

  return (
    <div className="min-h-screen bg-neutral-950 text-white pb-40 selection:bg-blue-500/30">
      <div className="max-w-5xl mx-auto p-6 md:p-8">
        
        {/* Header */}
        <header className="mb-10 animate-fade-in">
          <div className="flex justify-between items-start">
            <Link 
              href="/"
              className="group inline-flex items-center text-neutral-400 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Ana Sayfa
            </Link>
            
            <button 
              onClick={reset}
              className="text-xs text-neutral-500 hover:text-white flex items-center gap-1 transition-colors"
              disabled={totalWatts === 0}
            >
              <RefreshCcw className="w-3 h-3" />
              Sıfırla
            </button>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-500">
            Jeneratör Sihirbazı
          </h1>
          <p className="text-neutral-400 max-w-xl leading-relaxed">
            Evinizdeki cihazları ekleyerek kesinti durumunda ihtiyacınız olan ideal jeneratör gücünü hesaplayın.
          </p>
        </header>

        {/* Grid Layout for Devices */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-slide-up [animation-delay:200ms]">
          {devices.map((device, index) => {
            const Count = counts[device.name];
            const Icon = device.icon;
            
            return (
              <div
                key={device.name}
                className={`
                  group relative p-5 rounded-xl border transition-all duration-300
                  ${Count > 0 
                    ? 'bg-neutral-900/80 border-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.1)]' 
                    : 'bg-neutral-900/40 border-white/5 hover:border-white/10 hover:bg-neutral-900/60'}
                `}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-2.5 rounded-lg ${Count > 0 ? 'bg-blue-500/20 text-blue-400' : 'bg-neutral-800 text-neutral-400'}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-mono text-neutral-500">{device.watts}W</div>
                  </div>
                </div>

                <div className="flex flex-col gap-1 mb-4">
                  <h3 className="font-medium text-neutral-200">{device.name}</h3>
                  {Count > 0 && (
                    <span className="text-xs text-blue-400 font-mono">
                      {(device.watts * Count).toLocaleString()}W Toplam
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between bg-neutral-950/50 rounded-lg p-1 border border-white/5">
                  <button
                    onClick={() => decrement(device.name)}
                    disabled={Count === 0}
                    className="w-8 h-8 flex items-center justify-center rounded-md text-neutral-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  
                  <span className={`font-mono font-medium w-8 text-center ${Count > 0 ? 'text-white' : 'text-neutral-600'}`}>
                    {Count}
                  </span>
                  
                  <button
                    onClick={() => increment(device.name)}
                    className="w-8 h-8 flex items-center justify-center rounded-md text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Info Box */}
        <div className="mt-8 p-4 rounded-xl bg-amber-500/5 border border-amber-500/10 flex gap-3 items-start text-amber-200/80 text-sm animate-fade-in [animation-delay:600ms]">
          <Info className="w-5 h-5 shrink-0" />
          <p>
            Hesaplama %20 güvenlik marjı içerir. Bu, jeneratörün tam kapasitede çalışmasını engelleyerek ömrünü uzatır ve ani yüklenmelere karşı koruma sağlar.
          </p>
        </div>
      </div>

      {/* Floating Result Dock */}
      <div className="fixed bottom-6 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-3xl z-50 animate-slide-up [animation-delay:400ms]">
        <div className="glass-card rounded-2xl p-1 shadow-2xl border-t border-white/10 bg-neutral-900/90 backdrop-blur-xl">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex flex-col">
              <span className="text-xs text-neutral-400 uppercase tracking-wider font-medium">Anlık Tüketim</span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-white">{totalWatts.toLocaleString()}</span>
                <span className="text-sm text-neutral-500">W</span>
              </div>
            </div>

            <div className="h-10 w-px bg-white/10 mx-4 hidden md:block" />

            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end md:items-start">
                <span className="text-xs text-blue-400 uppercase tracking-wider font-medium">Önerilen Güç</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-blue-400">{recommendedKva}</span>
                  <span className="text-sm text-blue-500/80">kVA</span>
                </div>
              </div>
              
              <div className="hidden sm:flex items-center justify-center w-12 h-12 rounded-full bg-blue-500/10 border border-blue-500/20">
                <Zap className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </div>
          
          {/* Category Indicator Bar */}
          {totalWatts > 0 && (
            <div className="px-1 pb-1">
              <div className="bg-neutral-800 rounded-lg py-2 px-4 text-center">
                <span className="text-sm text-neutral-300">
                  {parseFloat(recommendedKva) < 3.5 
                    ? '🏠 Küçük ev tipi (Portatif) jeneratör yeterli' 
                    : parseFloat(recommendedKva) < 7.5 
                    ? '🏡 Orta boy (Dizel/Benzinli) jeneratör önerilir' 
                    : '🏢 Büyük (Kabinli) jeneratör sistemi gerekli'}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}