# Next.js Project Setup - Tamamlandı ✅

## Kurulum Özeti

Next.js projesi başarıyla kuruldu ve yapılandırıldı. Aşağıda yapılan işlemler ve sonraki adımlar yer almaktadır.

## ✅ Tamamlanan Adımlar

### 1. Next.js Projesi Oluşturuldu
- **Framework**: Next.js 16.0.7 (App Router)
- **Dil**: TypeScript
- **Stil**: Tailwind CSS 4.x
- **Import Alias**: `@/*` yapılandırıldı

### 2. Gerekli Paketler Kuruldu

#### Ana Bağımlılıklar:
- ✅ `next` (16.0.7)
- ✅ `react` (19.2.0)
- ✅ `react-dom` (19.2.0)
- ✅ `react-leaflet` (5.0.0) - OpenStreetMap entegrasyonu için
- ✅ `leaflet` (1.9.4) - Harita kütüphanesi
- ✅ `lucide-react` (0.556.0) - İkonlar
- ✅ `@supabase/supabase-js` (2.86.2) - Backend/Veritabanı

#### Dev Bağımlılıkları:
- ✅ `typescript` (5.x)
- ✅ `@types/node`, `@types/react`, `@types/react-dom`
- ✅ `@types/leaflet` - Leaflet TypeScript tipleri
- ✅ `tailwindcss` (4.x)
- ✅ `eslint` + `eslint-config-next`

### 3. Proje Yapısı
```
TRNC-Community-Based-Outage-Map/
├── app/                    # Next.js App Router
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── docs/                   # Dokümantasyon
│   └── SET_UP.md
├── public/                 # Statik dosyalar
├── .env.local.example      # Çevre değişkenleri şablonu
├── .gitignore             # Git ignore yapılandırması
├── next.config.ts         # Next.js yapılandırması
├── package.json           # Proje bağımlılıkları
├── tsconfig.json          # TypeScript yapılandırması
└── tailwind.config.js     # Tailwind CSS yapılandırması
```

### 4. Çevre Değişkenleri
`.env.local.example` dosyası oluşturuldu. Kullanım için:
1. `.env.local.example` dosyasını `.env.local` olarak kopyalayın
2. Supabase proje bilgilerinizi doldurun

## 🚀 Çalıştırma

Development server'ı başlatmak için:
```bash
npm run dev
```
Tarayıcıda: http://localhost:3000

## 📋 Sonraki Adımlar

### 1. Supabase Kurulumu
- [ ] Supabase hesabı oluşturun (https://supabase.com)
- [ ] Yeni proje oluşturun
- [ ] `.env.local` dosyasına credentials ekleyin
- [ ] Veritabanı tablolarını oluşturun (SET_UP.md'deki SQL'i çalıştırın)

### 2. Veritabanı Tabloları (Supabase SQL Editor)
```sql
-- ÖNEMLİ: PostGIS extension'ı önce etkinleştirin
CREATE EXTENSION IF NOT EXISTS postgis;

-- reports tablosu
CREATE TABLE reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id text NOT NULL,
  lat float NOT NULL,
  lng float NOT NULL,
  created_at timestamp DEFAULT now(),
  location geography(Point) GENERATED ALWAYS AS (ST_SetSRID(ST_MakePoint(lng, lat), 4326)) STORED
);

-- Index oluştur (performans için)
CREATE INDEX idx_reports_location ON reports USING GIST (location);
CREATE INDEX idx_reports_created_at ON reports (created_at);

-- get_verified_outages fonksiyonu (Truth Consensus algoritması)
CREATE OR REPLACE FUNCTION get_verified_outages()
RETURNS TABLE (lat float, lng float, intensity int) AS $$
BEGIN
  RETURN QUERY
  SELECT
    AVG(r.lat)::float as lat,
    AVG(r.lng)::float as lng,
    COUNT(*)::int as intensity
  FROM reports r
  WHERE r.created_at > NOW() - INTERVAL '30 minutes'
  GROUP BY ST_SnapToGrid(r.location, 0.005) -- Yaklaşık 500m gridleme
  HAVING COUNT(DISTINCT r.device_id) > 3; -- 3'ten fazla farklı cihaz = doğrulanmış kesinti
END;
$$ LANGUAGE plpgsql;
```

### 3. Uygulama Geliştirme
- [ ] Harita komponenti oluşturun (`react-leaflet`)
- [ ] Isı haritası (heatmap) entegrasyonu
- [ ] Kullanıcı bildirim formu
- [ ] Device ID hash'leme sistemi
- [ ] PWA manifest ve service worker

### 4. Özellikler (SET_UP.md'ye göre)
- [ ] **Gizlilik**: Tam konum gösterilmeyecek, sadece heatmap
- [ ] **Crowdsourced**: Tüm veriler kullanıcılardan gelecek
- [ ] **Truth Consensus**: 500m içinde 3+ farklı kullanıcı = Doğrulanmış kesinti
- [ ] **PWA**: Mobil cihazlarda app gibi çalışacak

### 5. Deployment (Vercel)
```bash
npm run build   # Production build test
```
Vercel'e deploy için: https://vercel.com

## 🧪 Test

Proje çalışıyor mu kontrol et:
```bash
npm run dev
```
✅ Server başarıyla çalıştı: http://localhost:3000

## 📦 Paket Komutları

```bash
npm run dev      # Development server
npm run build    # Production build
npm run start    # Production server
npm run lint     # ESLint
```

## 🔧 Tech Stack Özeti

| Kategori | Teknoloji |
|----------|-----------|
| Framework | Next.js 14+ (App Router) |
| Dil | TypeScript |
| Stil | Tailwind CSS |
| Harita | Leaflet + react-leaflet + OpenStreetMap |
| İkonlar | Lucide React |
| Backend | Supabase (PostgreSQL + PostGIS) |
| Deployment | Vercel (önerilen) |

## 📝 Notlar

1. **NODE_ENV Uyarısı**: Development ortamında görülen NODE_ENV uyarısı normal ve çalışmayı etkilemez.
2. **Leaflet CSS**: `react-leaflet` kullanırken `leaflet.css` dosyasını import etmeyi unutmayın.
3. **PWA**: `next-pwa` paketi eklenebilir (isteğe bağlı).
4. **Vercel Deployment**: Otomatik olarak Git push'ta deploy olur.

## ✨ Başarıyla Kuruldu!

Proje hazır! Şimdi uygulama geliştirmesine başlayabilirsiniz. 🎉
