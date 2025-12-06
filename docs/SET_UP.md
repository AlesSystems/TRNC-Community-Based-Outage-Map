# SETUP.md - KKTC Topluluk Tabanlı Kesinti Haritası (Project A)

## 1. Proje Vizyonu ve Kısıtlamalar
Bu proje, Kuzey Kıbrıs (KKTC) için resmi kurumlardan bağımsız, kullanıcı bildirimlerine dayalı (Crowdsourced) bir elektrik kesinti takip sistemidir.

**Kritik Kurallar (Rapor Kaynaklı):**
1.  **Asla Scraping Yok:** KIBTEK veya başka bir kurum sitesinden veri çekilmeyecek. Veri %100 kullanıcıdan gelecek .
2.  **Gizlilik Odaklı:** Kullanıcının tam konumu asla gösterilmeyecek. Isı haritası (Heatmap) kullanılacak .
3.  **PWA (Progressive Web App):** App Store onay süreçlerine takılmamak için web tabanlı mobil uygulama olacak .
4.  **Maliyet Etkin:** Google Maps API kullanılmayacak (OpenStreetMap kullanılacak) .

---

## 2. Tech Stack (Teknoloji Yığını)

* **Framework:** Next.js 14+ (App Router)
* **Dil:** TypeScript
* **Stil:** Tailwind CSS
* **Harita:** `react-leaflet` (Leaflet.js) + OpenStreetMap
* **Veritabanı & Backend:** Supabase (PostgreSQL + PostGIS)
* **İkonlar:** Lucide React
* **Dağıtım:** Vercel

---

## 3. Veritabanı Mimarisi (Supabase)

AI Asistan, SQL Editor'de şu tabloları ve fonksiyonları oluşturmalı:

### A. Tablo: `reports`
Kullanıcı bildirimlerini tutar.
* `id` (uuid, primary key)
* `device_id` (text - anonim, hash'lenmiş cihaz kimliği)
* `lat` (float - enlem)
* `lng` (float - boylam)
* `created_at` (timestamp - default now())
* `location` (geography(Point) - PostGIS hesaplamaları için)

### B. Algoritma: "Truth Consensus" (Doğruluk Mutabakatı)
Tek bir bildirim haritayı kırmızıya boyamaz. Backend tarafında (Postgres Function) şu mantık çalışmalı :
1.  **Zaman Filtresi:** Sadece son 30 dakika içindeki raporları getir.
2.  **Mekansal Kümeleme (Clustering):** Birbirine 500 metre mesafedeki raporları grupla.
3.  **Eşik Değer (Threshold):** Eğer bir kümede **>3 farklı device_id** varsa, o bölgeyi "Doğrulanmış Kesinti" olarak işaretle.

```sql
-- Örnek SQL Mantığı (AI bunu geliştirmeli)
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
  GROUP BY ST_SnapToGrid(r.location, 0.005); -- Yaklaşık 500m gridleme
END;
$$ LANGUAGE plpgsql;