# Phase 3: PWA Özellikleri ve Mobil Optimizasyon

## Genel Bakış

Bu doküman, uygulamanın Progressive Web App (PWA) özelliklerini eklemek ve mobil cihazlarda native app benzeri bir deneyim sunmak için gerekli adımları içermektedir. Phase 3, manifest dosyası, metadata yapılandırması, viewport optimizasyonları ve favicon ayarları üzerine odaklanmaktadır.

## Hedefler

- PWA manifest dosyası oluşturma
- Mobil cihazlarda standalone mod desteği
- iOS Safari optimizasyonları
- Harita kullanımı için viewport optimizasyonları
- Favicon ve icon yönetimi

---

## 1. Manifest Dosyası (Web App Manifest)

### 1.1 Amaç
Web App Manifest, uygulamanın mobil cihazlarda nasıl görüneceğini ve davranacağını tanımlar. Bu dosya sayesinde kullanıcılar uygulamayı ana ekrana ekleyebilir ve native app gibi kullanabilir.

### 1.2 Dosya Oluşturma
- **Dosya Yolu**: `public/manifest.json`
- **Format**: JSON
- **Erişim**: Tarayıcılar bu dosyayı otomatik olarak `/manifest.json` yolundan okur

### 1.3 Manifest Özellikleri

#### 1.3.1 Temel Bilgiler
- **name**: 'Kıbrıs Kesinti Haritası'
  - Uygulamanın tam adı
  - Ana ekranda ve app switcher'da görünen isim
  - Uzun isimler için kullanılır

- **short_name**: 'Kesinti Yok'
  - Kısa versiyon
  - Ana ekran ikonunun altında görünen kısa isim
  - Maksimum 12 karakter önerilir (iOS limiti)

- **start_url**: '/'
  - Uygulama açıldığında yüklenecek sayfa
  - Genellikle ana sayfa olur
  - Mutlak veya göreli yol kullanılabilir

#### 1.3.2 Görünüm Ayarları
- **display**: 'standalone'
  - **Kritik Özellik**: Adres çubuğunu gizler
  - Native app gibi görünüm sağlar
  - Tarayıcı UI elementleri (adres çubuğu, menü) gizlenir
  - Kullanıcı deneyimini önemli ölçüde iyileştirir
  - Alternatifler: 'fullscreen', 'minimal-ui', 'browser'

#### 1.3.3 Renk Ayarları
- **background_color**: '#ffffff'
  - Splash screen (başlangıç ekranı) arka plan rengi
  - Uygulama yüklenirken gösterilen ekranın rengi
  - Beyaz renk, temiz ve profesyonel görünüm sağlar
  - Hex formatında renk kodu

- **theme_color**: '#ef4444'
  - Tailwind CSS red-500 rengi
  - Tarayıcı UI elementlerinin rengi (adres çubuğu, durum çubuğu)
  - Android'de status bar rengi
  - Uygulamanın marka rengiyle uyumlu olmalı

#### 1.3.4 İkonlar
- **icons**: Icon dizisi
  - **192x192**: Android için küçük icon
  - **512x512**: Android için büyük icon ve splash screen
  - **Dosya Yolu**: `public/icon.png` (her iki boyut için aynı dosya referans edilebilir veya ayrı dosyalar kullanılabilir)
  - **Format**: PNG formatı önerilir (transparency desteği)
  - **Type**: 'image/png' belirtilmeli

### 1.4 Manifest Yapısı
Manifest dosyası JSON formatında olmalı ve tüm gerekli alanları içermelidir. Gelecekte eklenebilecek özellikler:
- **orientation**: 'portrait' veya 'landscape' (isteğe bağlı)
- **scope**: '/' (varsayılan, tüm site)
- **description**: Uygulama açıklaması (isteğe bağlı)

### 1.5 İkon Gereksinimleri
- **192x192**: Minimum Android icon boyutu
- **512x512**: Yüksek çözünürlüklü cihazlar için
- **Format**: PNG (transparency destekli)
- **Tasarım**: Basit, tanınabilir, küçük boyutlarda okunabilir
- **Öneri**: ⚡️ emoji'si veya elektrik kesintisi temalı bir ikon

---

## 2. Metadata ve Viewport Güncellemeleri (app/layout.tsx)

### 2.1 Amaç
Next.js layout.tsx dosyasındaki metadata ve viewport ayarlarını güncelleyerek PWA desteğini tamamlamak ve mobil deneyimi optimize etmek.

### 2.2 Güncellenecek Dosya
- **Dosya**: `app/layout.tsx`
- **Bölüm**: `metadata` export objesi ve `viewport` export (yeni)

### 2.3 Metadata Güncellemeleri

#### 2.3.1 Manifest Referansı
- **manifest**: '/manifest.json'
  - Manifest dosyasının yolunu belirtir
  - Next.js otomatik olarak `<link rel="manifest">` tag'ini ekler
  - Public klasöründen serve edilen dosyalar `/` ile başlar

#### 2.3.2 iOS Safari Özellikleri
iOS Safari için özel meta tag'ler eklenmeli (Next.js metadata API'si ile):

- **apple-mobile-web-app-capable**: 'yes'
  - iOS Safari'de standalone modu etkinleştirir
  - "Ana Ekrana Ekle" özelliği ile eklenen uygulamalar için
  - Tarayıcı UI'sını gizler
  - Native app benzeri deneyim sağlar

- **apple-mobile-web-app-status-bar-style**: 'default'
  - iOS status bar stilini belirler
  - Seçenekler: 'default', 'black', 'black-translucent'
  - 'default' beyaz arka plan için uygun
  - Alternatif: 'black-translucent' (tam ekran için)

#### 2.3.3 Ek iOS Meta Tag'leri (İsteğe Bağlı)
- **apple-mobile-web-app-title**: 'Kesinti Yok'
  - iOS ana ekranda görünen kısa isim
  - Manifest'teki short_name ile uyumlu olmalı

- **apple-touch-icon**: Icon referansı
  - iOS için özel icon
  - Genellikle 180x180 boyutunda
  - Public klasöründe `apple-touch-icon.png` olarak bulunabilir

### 2.4 Viewport Optimizasyonu

#### 2.4.1 Amaç
Kullanıcıların haritaya zoom yaparken yanlışlıkla sayfayı büyütmesini engellemek. Bu, özellikle harita uygulamaları için kritik öneme sahiptir.

#### 2.4.2 Viewport Ayarları
- **maximumScale**: 1
  - Maksimum zoom seviyesini 1 (100%) ile sınırlar
  - Kullanıcılar sayfayı büyütemez
  - Harita zoom'unun sayfa zoom'undan ayrılmasını sağlar

- **userScalable**: false
  - Kullanıcının pinch-to-zoom ile sayfayı büyütmesini engeller
  - Harita kendi zoom mekanizmasını kullanır
  - Mobil deneyimi iyileştirir

#### 2.4.3 Mevcut Viewport Ayarları
- **width**: 'device-width' (varsayılan)
- **initialScale**: 1 (varsayılan)
- **viewportFit**: 'cover' (notch'lu cihazlar için, isteğe bağlı)

### 2.5 Next.js Metadata API Kullanımı
Next.js 13+ App Router'da metadata ve viewport ayrı export'lar olarak tanımlanır:
- `export const metadata: Metadata` - Metadata objesi
- `export const viewport: Viewport` - Viewport objesi (yeni)

---

## 3. Favicon Yönetimi

### 3.1 Amaç
Uygulamanın tarayıcı sekmesinde ve bookmark'larda görünen favicon'u ayarlamak.

### 3.2 Mevcut Durum Kontrolü
- **Dosya Yolu**: `app/favicon.ico` veya `public/favicon.ico`
- Next.js App Router'da `app/favicon.ico` otomatik olarak favicon olarak kullanılır
- Eğer dosya yoksa, alternatif yöntemler kullanılmalı

### 3.3 Favicon Seçenekleri

#### 3.3.1 Emoji Favicon (Basit Çözüm)
- **Yöntem**: Layout.tsx içinde `<link>` tag'i ile emoji kullanımı
- **Emoji**: ⚡️ (yıldırım, elektrik temalı)
- **Avantaj**: Hızlı implementasyon, dosya gerektirmez
- **Dezavantaj**: Tüm tarayıcılarda mükemmel görünmeyebilir

#### 3.3.2 Icon Dosyası (Önerilen)
- **Dosya**: `app/icon.png` veya `app/icon.svg`
- Next.js App Router otomatik olarak `app/icon.*` dosyalarını favicon olarak kullanır
- **Format**: PNG (transparency destekli) veya SVG (vektörel)
- **Boyut**: 32x32 veya daha büyük (tarayıcılar otomatik resize eder)

#### 3.3.3 Metadata ile Favicon
- Layout.tsx metadata içinde `icons` objesi tanımlanabilir
- Farklı boyutlar için farklı icon'lar belirtilebilir
- Apple touch icon, Android icon gibi platform-specific icon'lar eklenebilir

### 3.4 Favicon Implementasyon Stratejisi
1. Önce `app/favicon.ico` veya `app/icon.png` dosyasının varlığını kontrol et
2. Yoksa, layout.tsx içinde emoji favicon kullan
3. Gelecekte özel icon dosyası eklenebilir

---

## 4. Teknik Detaylar

### 4.1 PWA Gereksinimleri
- **HTTPS**: PWA özellikleri sadece HTTPS üzerinde çalışır (localhost hariç)
- **Manifest**: Geçerli JSON formatında olmalı
- **Icon**: En az bir icon tanımlı olmalı
- **Service Worker**: Tam PWA için gerekli (Phase 4'te eklenebilir)

### 4.2 Tarayıcı Desteği
- **Chrome/Edge**: Tam PWA desteği
- **Safari (iOS)**: Standalone mod desteği (manifest + meta tag'ler)
- **Firefox**: PWA desteği mevcut
- **Samsung Internet**: PWA desteği mevcut

### 4.3 Test Senaryoları
- Manifest dosyası doğru yükleniyor mu?
- "Ana Ekrana Ekle" butonu görünüyor mu?
- Standalone modda açıldığında adres çubuğu gizleniyor mu?
- iOS Safari'de standalone mod çalışıyor mu?
- Viewport ayarları sayfa zoom'unu engelliyor mu?
- Favicon görüntüleniyor mu?

### 4.4 Performance Etkisi
- Manifest dosyası küçük bir JSON dosyasıdır (minimal etki)
- Icon dosyaları cache'lenir (tek seferlik yükleme)
- Viewport ayarları performansı etkilemez
- Metadata güncellemeleri build-time'da işlenir

---

## 5. Dosya Yapısı

Phase 3 tamamlandığında proje yapısı şöyle olmalı:

```
TRNC-Community-Based-Outage-Map/
├── app/
│   ├── page.tsx
│   ├── layout.tsx              # Güncellenmiş: Metadata + Viewport
│   ├── globals.css
│   ├── favicon.ico              # Varsa mevcut, yoksa emoji kullanılacak
│   └── icon.png                 # İsteğe bağlı: Next.js otomatik kullanır
├── public/
│   ├── manifest.json            # Yeni: PWA manifest
│   ├── icon.png                 # Yeni: 192x192 ve 512x512 icon
│   └── apple-touch-icon.png     # İsteğe bağlı: iOS için
├── components/
│   └── Map.tsx
├── utils/
│   └── supabaseClient.ts
└── docs/
    ├── PHASE_1.md
    ├── PHASE_2.md
    └── PHASE_3.md              # Bu dosya
```

---

## 6. Icon Oluşturma Rehberi

### 6.1 Icon Tasarım Önerileri
- **Tema**: Elektrik kesintisi, harita, yıldırım
- **Renk**: Kırmızı (#ef4444) veya sarı/turuncu (uyarı rengi)
- **Stil**: Basit, minimal, küçük boyutlarda okunabilir
- **Emoji Alternatifi**: ⚡️, 🗺️, 🔴

### 6.2 Icon Boyutları
- **192x192**: Android küçük icon
- **512x512**: Android büyük icon ve splash screen
- **180x180**: iOS apple-touch-icon (isteğe bağlı)
- **32x32**: Favicon (isteğe bağlı)

### 6.3 Icon Oluşturma Araçları
- Online icon generator'lar
- Figma, Adobe Illustrator gibi tasarım araçları
- Emoji'den icon oluşturma (basit çözüm)
- AI icon generator'lar

### 6.4 Icon Dosyası Yerleşimi
- **public/icon.png**: Manifest için
- **app/icon.png**: Next.js favicon için (otomatik)
- **public/apple-touch-icon.png**: iOS için (isteğe bağlı)

---

## 7. Test ve Doğrulama

### 7.1 Manifest Doğrulama
- Chrome DevTools > Application > Manifest sekmesi
- Manifest dosyası doğru parse ediliyor mu?
- Tüm gerekli alanlar mevcut mu?
- Icon'lar yükleniyor mu?

### 7.2 PWA Test Araçları
- **Lighthouse**: PWA audit yapılabilir
- **Chrome DevTools**: Application > Manifest
- **Web.dev PWA Checklist**: Online doğrulama

### 7.3 Mobil Test
- **Android Chrome**: "Ana Ekrana Ekle" butonu görünüyor mu?
- **iOS Safari**: Standalone mod çalışıyor mu?
- **Viewport**: Sayfa zoom engelleniyor mu?
- **Favicon**: Sekmede görünüyor mu?

### 7.4 Standalone Mod Testi
1. Uygulamayı mobil cihazda aç
2. "Ana Ekrana Ekle" butonuna tıkla
3. Ana ekrandan uygulamayı aç
4. Adres çubuğunun gizlendiğini doğrula
5. Native app gibi göründüğünü kontrol et

---

## 8. Notlar ve Önemli Hatırlatmalar

1. **HTTPS Gereksinimi**: PWA özellikleri production'da HTTPS gerektirir (localhost hariç)
2. **Manifest Yolu**: Mutlaka `/manifest.json` olmalı (public klasöründen)
3. **Icon Formatı**: PNG formatı önerilir (transparency desteği)
4. **Display Mode**: 'standalone' adres çubuğunu gizlemek için kritik
5. **Viewport**: maximumScale ve userScalable harita uygulamaları için önemli
6. **iOS Safari**: Meta tag'ler manifest'e ek olarak gerekli
7. **Favicon Fallback**: Emoji favicon basit ve etkili bir çözüm
8. **Cache**: Icon'lar tarayıcı cache'inde saklanır, değişiklikler için cache temizleme gerekebilir

---

## 9. Tamamlanma Kriterleri

Phase 3 aşağıdaki kriterler sağlandığında tamamlanmış sayılır:

- ✅ `public/manifest.json` dosyası oluşturuldu
- ✅ Manifest'te name: 'Kıbrıs Kesinti Haritası' tanımlandı
- ✅ Manifest'te short_name: 'Kesinti Yok' tanımlandı
- ✅ Manifest'te start_url: '/' tanımlandı
- ✅ Manifest'te display: 'standalone' ayarlandı
- ✅ Manifest'te background_color: '#ffffff' tanımlandı
- ✅ Manifest'te theme_color: '#ef4444' tanımlandı
- ✅ Manifest'te icons dizisi eklendi (192x192 ve 512x512)
- ✅ `app/layout.tsx` içinde manifest: '/manifest.json' eklendi
- ✅ iOS için apple-mobile-web-app-capable: 'yes' meta tag'i eklendi
- ✅ iOS için apple-mobile-web-app-status-bar-style: 'default' meta tag'i eklendi
- ✅ Viewport'ta maximumScale: 1 ayarlandı
- ✅ Viewport'ta userScalable: false ayarlandı
- ✅ Favicon ayarlandı (dosya veya emoji)
- ✅ Icon dosyaları public klasöründe mevcut (veya placeholder)
- ✅ Mobil cihazlarda "Ana Ekrana Ekle" butonu görünüyor
- ✅ Standalone modda adres çubuğu gizleniyor
- ✅ Sayfa zoom'u engelleniyor (harita zoom çalışıyor)

---

## 10. Sonraki Adımlar (Phase 4+)

Phase 3 tamamlandıktan sonra düşünülebilecek özellikler:

- **Service Worker**: Offline desteği ve cache stratejileri
- **Push Notifications**: Kesinti bildirimleri
- **App Install Prompt**: Kullanıcıları PWA'yı yüklemeye teşvik etme
- **Splash Screen Özelleştirme**: Özel splash screen tasarımı
- **Share Target API**: Diğer uygulamalardan paylaşım desteği
- **File System Access**: Offline veri saklama
- **Background Sync**: Offline işlemleri senkronize etme

---

## 11. Sorun Giderme

### 11.1 Manifest Yüklenmiyor
- Dosya yolu doğru mu? (`/manifest.json`)
- JSON formatı geçerli mi?
- Public klasöründe mi?

### 11.2 Icon'lar Görünmüyor
- Dosya yolu doğru mu?
- Icon boyutları doğru mu?
- Dosya formatı destekleniyor mu? (PNG önerilir)

### 11.3 Standalone Mod Çalışmıyor
- Manifest'te display: 'standalone' var mı?
- iOS için meta tag'ler eklendi mi?
- HTTPS kullanılıyor mu? (localhost hariç)

### 11.4 Viewport Zoom Engellenmiyor
- Viewport export edildi mi?
- maximumScale: 1 ayarlandı mı?
- userScalable: false ayarlandı mı?

### 11.5 Favicon Görünmüyor
- Dosya yolu doğru mu?
- Next.js App Router'da `app/icon.*` veya `app/favicon.ico` kullanılıyor mu?
- Metadata'da icons tanımlandı mı?

---

**Son Güncelleme**: Phase 3 Planlama Dokümanı
**Durum**: Planlama Aşaması
**Önkoşul**: Phase 1 ve Phase 2 tamamlanmış olmalı
**Sonraki**: Implementation

