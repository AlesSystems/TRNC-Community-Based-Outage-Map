# Phase 1: Frontend Bileşenleri Geliştirme

## Genel Bakış

Bu doküman, KKTC Topluluk Tabanlı Kesinti Haritası projesinin frontend bileşenlerinin geliştirilmesi için gerekli adımları içermektedir. Phase 1, harita görselleştirmesi ve kullanıcı bildirim sistemi üzerine odaklanmaktadır.

## Hedefler

- Supabase client yapılandırması
- İnteraktif harita bileşeni (react-leaflet)
- Heatmap görselleştirmesi (Leaflet.heat)
- Kullanıcı konum bildirimi sistemi
- Next.js SSR uyumluluğu

---

## 1. Supabase Client Yapılandırması

### 1.1 Dosya Oluşturma
- **Dosya Yolu**: `utils/supabaseClient.ts`
- **Amaç**: Supabase client instance'ını oluşturmak ve proje genelinde kullanılabilir hale getirmek

### 1.2 Gereksinimler
- `.env.local` dosyasından environment variable'ları okumak
- Supabase URL ve anonim key'i kullanarak client initialize etmek
- Singleton pattern kullanarak tek bir client instance'ı sağlamak
- TypeScript tip güvenliği sağlamak

### 1.3 Environment Variables
Aşağıdaki değişkenler `.env.local` dosyasında tanımlı olmalı:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## 2. Harita Bileşeni (Map Component)

### 2.1 Dosya Oluşturma
- **Dosya Yolu**: `components/Map.tsx`
- **Component Tipi**: Client Component (`'use client'` direktifi ile)
- **Amaç**: KKTC'yi kapsayan interaktif harita ve heatmap görselleştirmesi

### 2.2 Harita Yapılandırması
- **Kütüphane**: `react-leaflet` ve `leaflet`
- **Merkez Koordinatları**: 35.2 (lat), 33.4 (lng)
- **Zoom Seviyesi**: 9
- **Kapsam**: Tüm KKTC bölgesi

### 2.3 Heatmap Katmanı
- **Kütüphane**: `leaflet.heat`
- **Veri Kaynağı**: `reports` prop'undan gelen veri dizisi
- **Görselleştirme**: Kesinti yoğunluğuna göre renk gradyanı
- **Dinamik Güncelleme**: Veri değiştiğinde heatmap'in otomatik güncellenmesi

### 2.4 Component Props
- **reports**: Veritabanından gelen kesinti raporları dizisi
  - Her rapor: `lat`, `lng`, `intensity` (yoğunluk) içermeli
  - Tip güvenliği için TypeScript interface tanımlanmalı

### 2.5 CSS Import
- Leaflet'in kendi CSS dosyasını import etmek kritik öneme sahip
- Import yolu: `leaflet/dist/leaflet.css`
- Next.js'te global CSS olarak veya component içinde import edilebilir

### 2.6 SSR Uyumluluğu
- Client Component olarak işaretlendiği için SSR sorunları olmamalı
- Ancak Leaflet'in DOM manipülasyonları için `useEffect` kullanılmalı
- Harita container'ı mount olduktan sonra initialize edilmeli

---

## 3. Ana Sayfa Güncellemesi (app/page.tsx)

### 3.1 Veri Çekme Stratejisi
İki seçenek mevcuttur:

**Seçenek A: Server-Side Fetching**
- Next.js Server Component olarak kalabilir
- `async` function kullanarak Supabase'den veri çekme
- Avantaj: SEO dostu, ilk yükleme hızlı
- Dezavantaj: Real-time güncellemeler için ek mekanizma gerekir

**Seçenek B: Client-Side Fetching**
- `useEffect` hook'u ile component mount olduktan sonra veri çekme
- Avantaj: Real-time güncellemeler kolay
- Dezavantaj: İlk yükleme biraz daha yavaş olabilir

**Öneri**: İlk implementasyonda Client-Side Fetching kullanılabilir, daha sonra Server-Side'a geçilebilir.

### 3.2 Map Component Entegrasyonu
- `next/dynamic` kullanarak dynamic import yapılmalı
- `ssr: false` parametresi ile SSR devre dışı bırakılmalı
- Bu, Leaflet'in browser-only kütüphane olması nedeniyle gereklidir
- Loading state'i eklenebilir (isteğe bağlı)

### 3.3 Sabitlenmiş Bildirim Butonu
- **Pozisyon**: Fixed bottom (sayfanın altında sabit)
- **Metin**: "Elektrik Yok! ⚡️"
- **Stil**: Şık ve dikkat çekici tasarım
- **Responsive**: Mobil ve desktop uyumlu
- **Tailwind CSS**: Mevcut stil sistemi kullanılmalı

### 3.4 Buton İşlevselliği (handleReport)

#### 3.4.1 Konum Alma
- `navigator.geolocation.getCurrentPosition()` API'si kullanılmalı
- Error handling: Kullanıcı izin vermezse veya konum alınamazsa uygun mesaj gösterilmeli
- Timeout ve error callback'leri tanımlanmalı

#### 3.4.2 Device ID Yönetimi
- `localStorage` kullanarak device ID saklanmalı
- Eğer localStorage'da device ID varsa, o kullanılmalı
- Yoksa, yeni bir device ID oluşturulmalı ve localStorage'a kaydedilmeli
- Device ID formatı: UUID veya hash benzeri benzersiz string

#### 3.4.3 Supabase Insert İşlemi
- Supabase `reports` tablosuna insert yapılmalı
- Gerekli alanlar:
  - `lat`: Kullanıcının enlemi
  - `lng`: Kullanıcının boylamı
  - `device_id`: localStorage'dan alınan veya yeni oluşturulan ID
- `created_at` otomatik olarak timestamp ile doldurulacak

#### 3.4.4 Kullanıcı Geri Bildirimi
- İşlem başarılı olduğunda kullanıcıya bilgi verilmeli
- **Seçenek 1**: Browser `alert()` kullanımı (basit)
- **Seçenek 2**: Toast notification (daha profesyonel)
- Hata durumunda da uygun hata mesajı gösterilmeli

---

## 4. Teknik Detaylar

### 4.1 TypeScript Tipleri
- `Report` interface'i tanımlanmalı
- Supabase client tipleri kullanılabilir (isteğe bağlı)
- Component prop tipleri açıkça belirtilmeli

### 4.2 Error Handling
- Tüm async işlemlerde try-catch blokları kullanılmalı
- Kullanıcı dostu hata mesajları gösterilmeli
- Console'a detaylı hata logları yazılabilir (development için)

### 4.3 Performance Optimizasyonları
- Harita render optimizasyonu (gereksiz re-render'ları önleme)
- Veri çekme işlemlerinde debouncing (isteğe bağlı)
- Component memoization (React.memo, useMemo, useCallback)

### 4.4 Accessibility
- Buton için uygun ARIA label'ları
- Keyboard navigation desteği
- Screen reader uyumluluğu

---

## 5. Dosya Yapısı

Phase 1 tamamlandığında proje yapısı şöyle olmalı:

```
TRNC-Community-Based-Outage-Map/
├── app/
│   ├── page.tsx              # Güncellenmiş ana sayfa
│   ├── layout.tsx
│   ├── globals.css
│   └── favicon.ico
├── components/
│   └── Map.tsx                # Yeni: Harita bileşeni
├── utils/
│   └── supabaseClient.ts      # Yeni: Supabase client
├── .env.local                 # Environment variables
└── docs/
    └── PHASE_1.md            # Bu dosya
```

---

## 6. Test Senaryoları

### 6.1 Harita Bileşeni
- Harita doğru koordinatlarda mı açılıyor?
- Heatmap verileri doğru şekilde görüntüleniyor mu?
- Veri güncellendiğinde heatmap yenileniyor mu?

### 6.2 Bildirim Butonu
- Buton sayfanın altında sabit mi?
- Tıklandığında konum izni isteniyor mu?
- Konum alındığında Supabase'e kaydediliyor mu?
- Device ID localStorage'da saklanıyor mu?
- Başarılı işlem sonrası kullanıcıya mesaj gösteriliyor mu?

### 6.3 Hata Senaryoları
- Konum izni reddedildiğinde ne oluyor?
- Supabase bağlantı hatası durumunda ne oluyor?
- Network hatası durumunda ne oluyor?

---

## 7. Bağımlılıklar

Aşağıdaki paketler `package.json`'da mevcut olmalı:
- `@supabase/supabase-js` (mevcut)
- `react-leaflet` (mevcut)
- `leaflet` (mevcut)
- `leaflet.heat` (mevcut)
- `next` (mevcut)
- `react` (mevcut)
- `react-dom` (mevcut)

---

## 8. Sonraki Adımlar (Phase 2+)

Phase 1 tamamlandıktan sonra:
- Real-time veri güncellemeleri (Supabase Realtime)
- PWA özellikleri
- Offline desteği
- Gelişmiş filtreleme ve görselleştirme seçenekleri
- Kullanıcı istatistikleri ve analitikler

---

## 9. Notlar ve Önemli Hatırlatmalar

1. **Leaflet CSS**: Mutlaka import edilmeli, aksi halde harita görünmeyebilir
2. **SSR**: Map component'i mutlaka `next/dynamic` ile SSR devre dışı import edilmeli
3. **Environment Variables**: `.env.local` dosyası `.gitignore`'da olmalı, asla commit edilmemeli
4. **Device ID**: Gizlilik için hash'lenmiş veya UUID formatında olmalı
5. **Error Handling**: Tüm kullanıcı etkileşimlerinde hata yönetimi yapılmalı
6. **Mobile Responsive**: Harita ve buton mobil cihazlarda düzgün çalışmalı

---

## 10. Tamamlanma Kriterleri

Phase 1 aşağıdaki kriterler sağlandığında tamamlanmış sayılır:

- ✅ `utils/supabaseClient.ts` dosyası oluşturuldu ve çalışıyor
- ✅ `components/Map.tsx` dosyası oluşturuldu ve harita görüntüleniyor
- ✅ Harita KKTC'yi kapsıyor (merkez: 35.2, 33.4, zoom: 9)
- ✅ Heatmap katmanı eklendi ve veriler görselleştiriliyor
- ✅ `app/page.tsx` güncellendi ve Supabase'den veri çekiyor
- ✅ Map component `next/dynamic` ile SSR devre dışı import ediliyor
- ✅ Sabitlenmiş "Elektrik Yok! ⚡️" butonu eklendi
- ✅ Buton tıklandığında konum alınıyor ve Supabase'e kaydediliyor
- ✅ Device ID localStorage'da yönetiliyor
- ✅ Başarılı işlem sonrası kullanıcıya geri bildirim gösteriliyor
- ✅ Hata durumlarında uygun mesajlar gösteriliyor

---

**Son Güncelleme**: Phase 1 Planlama Dokümanı
**Durum**: Planlama Aşaması
**Sonraki**: Implementation

