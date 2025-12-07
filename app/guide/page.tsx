'use client';

import Link from 'next/link';
import { Share2, PlusSquare, MoreVertical, Home } from 'lucide-react';

export default function GuidePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 pt-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            ❓ Nasıl Kullanılır?
          </h1>
          <p className="text-xl text-gray-300">
            KKTC Elektrik Kesinti Haritası Kullanım Kılavuzu
          </p>
        </div>

        {/* Section A: How the System Works */}
        <section className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 md:p-8 mb-8 shadow-2xl">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <span className="text-4xl">🗺️</span>
            Harita Nasıl Çalışır?
          </h2>

          <div className="space-y-6">
            {/* Step 1 */}
            <div className="bg-blue-600/20 rounded-xl p-6 border-l-4 border-blue-500">
              <div className="flex items-start gap-4">
                <span className="flex-shrink-0 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-xl font-bold">
                  1
                </span>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Elektriğin mi kesildi?</h3>
                  <p className="text-gray-200">
                    Ana sayfadaki kırmızı <strong>&quot;Elektrik Yok! ⚡️&quot;</strong> butonuna bas. 
                    Sistem konumunu alır ve bildirimi kaydeder.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 2 - Highlighted */}
            <div className="bg-yellow-600/30 rounded-xl p-6 border-l-4 border-yellow-500 shadow-lg">
              <div className="flex items-start gap-4">
                <span className="flex-shrink-0 w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center text-xl font-bold text-black">
                  2
                </span>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Doğrulama Süreci</h3>
                  <p className="text-gray-100 text-lg font-semibold mb-2">
                    ⚠️ ÖNEMLİ: Bir bölgede kesintinin haritada görünmesi için en az 4 bildirim gerekiyor!
                  </p>
                  <p className="text-gray-200">
                    Sistemin çalışması için <strong>senin gibi 3 komşunun daha bildirim yapması gerekir</strong>. 
                    Bu sayede yanlış bildirimler önlenir ve gerçek kesintiler doğru şekilde gösterilir.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-red-600/20 rounded-xl p-6 border-l-4 border-red-500">
              <div className="flex items-start gap-4">
                <span className="flex-shrink-0 w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-xl font-bold">
                  3
                </span>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Harita Görünümü</h3>
                  <p className="text-gray-200 mb-2">
                    Doğrulanan bölgeler haritada <strong>kırmızı yoğunluk (heatmap)</strong> olarak belirir.
                  </p>
                  <p className="text-gray-300 text-sm">
                    💡 Daha koyu kırmızı renkler, daha fazla bildirim alan bölgeleri gösterir. 
                    Yeni bildirimler anında haritada görünür.
                  </p>
                </div>
              </div>
            </div>

            {/* Rate Limiting Info */}
            <div className="bg-purple-600/20 rounded-xl p-4 border border-purple-500/50">
              <p className="text-sm text-gray-200">
                ⏱️ <strong>Not:</strong> Her kullanıcı 10 dakikada bir bildirim yapabilir. 
                Bu süre kötüye kullanımı önlemek içindir.
              </p>
            </div>
          </div>
        </section>

        {/* Section B: PWA Installation */}
        <section className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 md:p-8 mb-8 shadow-2xl">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <span className="text-4xl">📱</span>
            Uygulamayı İndir (Kurulum Yapmadan)
          </h2>

          <p className="text-gray-300 mb-6">
            Bu uygulamayı telefonuna yükleyerek uygulama mağazalarına ihtiyaç duymadan 
            direkt ana ekrandan kullanabilirsin!
          </p>

          <div className="space-y-8">
            {/* iOS Instructions */}
            <div className="bg-gradient-to-r from-blue-600/30 to-purple-600/30 rounded-xl p-6 border border-blue-500/50">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span>🍎</span>
                iPhone (iOS) İçin
              </h3>
              
              <ol className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center font-bold text-sm">
                    1
                  </span>
                  <div className="flex-1">
                    <p className="text-gray-100 mb-2">
                      Safari tarayıcısında <strong>alt menüdeki</strong> &apos;Paylaş&apos; butonuna bas
                    </p>
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <Share2 className="w-5 h-5" />
                      <span>Paylaş ikonu</span>
                    </div>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center font-bold text-sm">
                    2
                  </span>
                  <div className="flex-1">
                    <p className="text-gray-100 mb-2">
                      Açılan listede <strong>aşağı in</strong> ve &apos;Ana Ekrana Ekle&apos; seçeneğine tıkla
                    </p>
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <PlusSquare className="w-5 h-5" />
                      <span>Ana Ekrana Ekle</span>
                    </div>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center font-bold text-sm">
                    3
                  </span>
                  <div className="flex-1">
                    <p className="text-gray-100">
                      Sağ üstten <strong>&apos;Ekle&apos;</strong> butonuna bas
                    </p>
                  </div>
                </li>
              </ol>
            </div>

            {/* Android Instructions */}
            <div className="bg-gradient-to-r from-green-600/30 to-teal-600/30 rounded-xl p-6 border border-green-500/50">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span>🤖</span>
                Android İçin
              </h3>
              
              <ol className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center font-bold text-sm">
                    1
                  </span>
                  <div className="flex-1">
                    <p className="text-gray-100 mb-2">
                      Chrome tarayıcısında <strong>sağ üstteki</strong> 3 Nokta menüsüne tıkla
                    </p>
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <MoreVertical className="w-5 h-5" />
                      <span>Menü</span>
                    </div>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center font-bold text-sm">
                    2
                  </span>
                  <div className="flex-1">
                    <p className="text-gray-100">
                      <strong>&apos;Uygulamayı Yükle&apos;</strong> veya <strong>&apos;Ana Ekrana Ekle&apos;</strong> seçeneğine bas
                    </p>
                  </div>
                </li>
              </ol>
            </div>
          </div>

          <div className="mt-6 bg-green-600/20 rounded-xl p-4 border border-green-500/50">
            <p className="text-sm text-gray-200">
              ✅ <strong>Tebrikler!</strong> Artık uygulamayı telefonunun ana ekranından açabilirsin. 
              Normal bir uygulama gibi çalışır!
            </p>
          </div>
        </section>

        {/* Back Button */}
        <div className="text-center pb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-full shadow-lg transition-all duration-200 text-lg"
            aria-label="Ana sayfaya dön"
          >
            <Home className="w-6 h-6" />
            Ana Sayfaya Dön
          </Link>
        </div>

        {/* Footer Info */}
        <div className="text-center text-gray-400 text-sm pb-4">
          <p>Bu uygulama topluluk katkıları ile çalışır 💙</p>
        </div>
      </div>
    </div>
  );
}
