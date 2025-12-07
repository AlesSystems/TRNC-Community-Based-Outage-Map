'use client';

import Link from 'next/link';
import { Share2, PlusSquare, MoreVertical, Home, Map, Smartphone, AlertTriangle, Zap, Clock } from 'lucide-react';

export default function GuidePage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 p-4 md:p-8 relative overflow-hidden">
      {/* Ambient Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-900/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-900/20 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16 pt-8 animate-fade-in">
          <div className="inline-flex items-center justify-center p-3 mb-6 rounded-full bg-blue-500/10 border border-blue-500/20">
            <Zap className="w-8 h-8 text-blue-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-400">
            Nasıl Kullanılır?
          </h1>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
            KKTC Elektrik Kesinti Haritası topluluk destekli bir platformdur. İşte sistemin nasıl çalıştığına dair kısa bir rehber.
          </p>
        </div>

        {/* Grid Layout */}
        <div className="grid gap-8 md:gap-12">
          
          {/* Section A: How the System Works */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 mb-2 px-2">
              <Map className="w-6 h-6 text-blue-400" />
              <h2 className="text-2xl font-bold">Harita Sistemi</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {/* Step 1 */}
              <div className="glass-card p-6 rounded-2xl relative group hover:bg-white/5 transition-all duration-300">
                <div className="absolute top-4 right-4 text-4xl font-bold text-white/5 group-hover:text-white/10 transition-colors">1</div>
                <div className="mb-4 p-3 bg-red-500/20 w-fit rounded-xl">
                  <Zap className="w-6 h-6 text-red-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Bildirim Gönder</h3>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  Elektriğin kesildiğinde ana sayfadaki kırmızı butona bas. Konumun otomatik olarak alınır.
                </p>
              </div>

              {/* Step 2 */}
              <div className="glass-card p-6 rounded-2xl relative group hover:bg-white/5 transition-all duration-300 border-yellow-500/20">
                <div className="absolute top-4 right-4 text-4xl font-bold text-white/5 group-hover:text-white/10 transition-colors">2</div>
                <div className="mb-4 p-3 bg-yellow-500/20 w-fit rounded-xl">
                  <AlertTriangle className="w-6 h-6 text-yellow-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Doğrulama</h3>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  Haritada görünmesi için bölgeden en az <span className="text-white font-medium">4 farklı bildirim</span> gerekir. Komşularına haber ver!
                </p>
              </div>

              {/* Step 3 */}
              <div className="glass-card p-6 rounded-2xl relative group hover:bg-white/5 transition-all duration-300">
                <div className="absolute top-4 right-4 text-4xl font-bold text-white/5 group-hover:text-white/10 transition-colors">3</div>
                <div className="mb-4 p-3 bg-blue-500/20 w-fit rounded-xl">
                  <Map className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Canlı Takip</h3>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  Doğrulanan kesintiler haritada yoğunluk (heatmap) olarak belirir. Koyu renkler yoğun bildirimi gösterir.
                </p>
              </div>
            </div>

            {/* Note Box */}
            <div className="glass p-4 rounded-xl flex items-start gap-4 border-l-4 border-blue-500/50">
              <Clock className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-neutral-300">
                <strong className="text-white">Hatırlatma:</strong> Yanıltıcı bildirimleri önlemek için her cihazdan 10 dakikada bir bildirim yapılabilir.
              </p>
            </div>
          </section>

          {/* Section B: PWA Installation */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 mb-2 px-2">
              <Smartphone className="w-6 h-6 text-purple-400" />
              <h2 className="text-2xl font-bold">Uygulamayı Yükle</h2>
            </div>

            <div className="glass-card rounded-2xl overflow-hidden">
              <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/10">
                {/* iOS */}
                <div className="p-6 md:p-8 space-y-4">
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    <span className="text-2xl">🍎</span> iOS (iPhone)
                  </h3>
                  <ol className="space-y-4 text-sm text-neutral-300">
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-white/10 rounded-full flex items-center justify-center text-xs">1</span>
                      <span>Safari&apos;de <span className="text-white font-medium">Paylaş</span> butonuna tıkla <Share2 className="inline w-4 h-4 mx-1" /></span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-white/10 rounded-full flex items-center justify-center text-xs">2</span>
                      <span>Listeden <span className="text-white font-medium">Ana Ekrana Ekle</span> seçeneğini bul <PlusSquare className="inline w-4 h-4 mx-1" /></span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-white/10 rounded-full flex items-center justify-center text-xs">3</span>
                      <span>Sağ üstteki <span className="text-white font-medium">Ekle</span> butonuna bas</span>
                    </li>
                  </ol>
                </div>

                {/* Android */}
                <div className="p-6 md:p-8 space-y-4">
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    <span className="text-2xl">🤖</span> Android
                  </h3>
                  <ol className="space-y-4 text-sm text-neutral-300">
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-white/10 rounded-full flex items-center justify-center text-xs">1</span>
                      <span>Chrome menüsünü aç <MoreVertical className="inline w-4 h-4 mx-1" /></span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-white/10 rounded-full flex items-center justify-center text-xs">2</span>
                      <span><span className="text-white font-medium">Uygulamayı Yükle</span> veya <span className="text-white font-medium">Ana Ekrana Ekle</span> seçeneğine dokun</span>
                    </li>
                  </ol>
                </div>
              </div>
              
              <div className="bg-white/5 p-4 text-center text-sm text-neutral-400 border-t border-white/5">
                Uygulama mağazasına gerek kalmadan, doğrudan ana ekranınızdan erişin.
              </div>
            </div>
          </section>

          {/* Back Button */}
          <div className="text-center pt-8 pb-12">
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-neutral-100 hover:bg-white text-neutral-900 font-bold py-4 px-8 rounded-xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              <Home className="w-5 h-5" />
              Ana Sayfaya Dön
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-neutral-500 text-sm pb-8">
          <p>Kuzey Kıbrıs Topluluk Tabanlı Kesinti Haritası &copy; {new Date().getFullYear()}</p>
        </div>
      </div>
    </div>
  );
}
