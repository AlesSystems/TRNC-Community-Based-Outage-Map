# Phase 2: Gelişmiş Özellikler ve Optimizasyonlar

## Genel Bakış

Bu doküman, Phase 1'de oluşturulan temel yapının üzerine gelişmiş özellikler ve optimizasyonlar eklenmesi için gerekli adımları içermektedir. Phase 2, gerçek zamanlı güncellemeler, zaman filtreleme, kullanıcı deneyimi iyileştirmeleri ve görsel optimizasyonlar üzerine odaklanmaktadır.

## Hedefler

- Zaman bazlı veri filtreleme (Time-Decay)
- Gerçek zamanlı veri senkronizasyonu (Supabase Realtime)
- Profesyonel toast bildirimleri (sonner)
- Optimize edilmiş heatmap görselleştirmesi

---

## 1. Zaman Filtresi (Time-Decay)

### 1.1 Amaç
Haritada sadece güncel ve anlamlı verilerin görüntülenmesini sağlamak. Eski kesinti raporları otomatik olarak haritadan kaldırılacak, böylece kullanıcılar yalnızca aktif kesintileri görecek.

### 1.2 Güncellenecek Dosya
- **Dosya**: `app/page.tsx`
- **Bölüm**: Veri çekme (fetch) sorgusu

### 1.3 Gereksinimler
- Supabase sorgusuna zaman filtresi eklenmeli
- Sadece son 2 saat içinde oluşturulan (`created_at`) kayıtlar getirilmeli
- PostgreSQL'in `NOW()` fonksiyonu veya JavaScript Date objesi kullanılabilir
- Timezone uyumluluğu sağlanmalı (UTC kullanımı önerilir)

### 1.4 Filtreleme Mantığı
- `created_at > NOW() - INTERVAL '2 hours'` (PostgreSQL sorgusu)
- Veya client-side: `created_at > new Date(Date.now() - 2 * 60 * 60 * 1000)`
- Veritabanı seviyesinde filtreleme daha performanslıdır (önerilen)

### 1.5 Avantajlar
- Harita performansı artar (daha az veri işlenir)
- Kullanıcı deneyimi iyileşir (sadece güncel bilgiler)
- Veritabanı yükü azalır
- Otomatik veri temizliği sağlanır

### 1.6 Dikkat Edilmesi Gerekenler
- 2 saatlik pencere değiştirilebilir olmalı (config veya constant olarak)
- Gelecekte farklı zaman pencereleri için farklı görünümler eklenebilir
- Veri yoksa kullanıcıya bilgi verilmeli

---

## 2. Gerçek Zamanlı (Realtime) Abonelik

### 2.1 Amaç
Başka kullanıcılar bildirim gönderdiğinde, sayfa yenilenmeden haritanın anlık olarak güncellenmesini sağlamak. Bu, uygulamanın canlı ve interaktif hissettirmesini sağlar.

### 2.2 Supabase Realtime Özelliği
- Supabase'in built-in realtime özelliği kullanılacak
- PostgreSQL değişikliklerini dinlemek için `.on('postgres_changes')` metodu kullanılacak
- WebSocket tabanlı çalışır, düşük latency sağlar

### 2.3 Güncellenecek Dosya
- **Dosya**: `app/page.tsx`
- **Bölüm**: Component lifecycle (useEffect hook)

### 2.4 Abonelik Yapılandırması
- **Tablo**: `reports`
- **Event**: `INSERT` (yeni kayıt eklendiğinde)
- **Filter**: İsteğe bağlı olarak zaman filtresi eklenebilir

### 2.5 State Yönetimi
- Mevcut `reports` state'ine yeni gelen veri eklenmeli
- Duplicate kontrolü yapılmalı (aynı kayıt birden fazla eklenmemeli)
- State güncellemesi React'in state update pattern'ine uygun olmalı

### 2.6 Cleanup ve Memory Leak Önleme
- Component unmount olduğunda abonelik kapatılmalı
- `useEffect` cleanup function'ında `.unsubscribe()` çağrılmalı
- Multiple subscription'ları önlemek için dikkatli olunmalı

### 2.7 Hata Yönetimi
- WebSocket bağlantı hatalarında kullanıcıya bilgi verilmeli
- Bağlantı koparsa otomatik yeniden bağlanma mekanizması düşünülebilir
- Fallback olarak polling mekanizması eklenebilir (isteğe bağlı)

### 2.8 Supabase Realtime Etkinleştirme
- Supabase Dashboard'da Realtime özelliğinin etkin olduğundan emin olunmalı
- `reports` tablosu için Realtime publication açık olmalı
- Row Level Security (RLS) politikaları Realtime ile uyumlu olmalı

---

## 3. Toast Bildirimleri (UI Polish)

### 3.1 Amaç
Tarayıcı `alert()` fonksiyonunu kaldırıp, modern ve kullanıcı dostu toast bildirimleri eklemek. Bu, uygulamanın profesyonel görünmesini sağlar.

### 3.2 Kütüphane Kurulumu
- **Kütüphane**: `sonner`
- **Kurulum**: `npm install sonner`
- **Tip Tanımları**: TypeScript desteği built-in

### 3.3 Layout Güncellemesi
- **Dosya**: `app/layout.tsx`
- **Değişiklik**: `<Toaster />` bileşenini eklemek
- **Pozisyon**: Root layout içinde, tüm sayfalarda erişilebilir olmalı

### 3.4 Toaster Yapılandırması
- Toast pozisyonu ayarlanabilir (örn: bottom-right, top-center)
- Toast süresi ayarlanabilir (default genellikle 4-5 saniye)
- Dark mode desteği (isteğe bağlı)
- Animasyon ayarları (isteğe bağlı)

### 3.5 Bildirim Senaryoları

#### 3.5.1 Başarılı Bildirim Gönderme
- **Eski Yöntem**: `alert()` kaldırılacak
- **Yeni Yöntem**: `toast.success('Bildirim alındı! Harita güncelleniyor...')`
- **Mesaj**: Kullanıcı dostu ve bilgilendirici
- **Durum**: Success (yeşil/pozitif)

#### 3.5.2 Hata Durumları
- Konum izni reddedildiğinde: `toast.error('Konum izni gerekli')`
- Supabase hatası: `toast.error('Bildirim gönderilemedi. Lütfen tekrar deneyin.')`
- Network hatası: `toast.error('Bağlantı hatası')`

#### 3.5.3 Bilgilendirme Mesajları
- Veri yüklenirken: `toast.loading('Harita güncelleniyor...')`
- Realtime bağlantısı kurulduğunda: `toast.info('Canlı güncellemeler aktif')` (isteğe bağlı)

### 3.6 Toast Stil Özelleştirmesi
- Tailwind CSS ile uyumlu
- Proje renk paletine uygun stil
- Responsive tasarım
- Accessibility (ARIA labels)

---

## 4. Heatmap Ayarı Optimizasyonu

### 4.1 Amaç
Heatmap görselleştirmesini optimize ederek, verilerin daha anlamlı ve bölgesel bir şekilde görüntülenmesini sağlamak. Tekil noktalar yerine "tehlike bulutu" görünümü hedeflenmektedir.

### 4.2 Güncellenecek Dosya
- **Dosya**: `components/Map.tsx`
- **Bölüm**: Leaflet.heat yapılandırması

### 4.3 Optimize Edilecek Parametreler

#### 4.3.1 Radius
- **Eski Değer**: Varsayılan (genellikle 20)
- **Yeni Değer**: `25`
- **Açıklama**: Her noktanın etki alanını genişletir, daha geniş bir alan kaplar
- **Etki**: Daha büyük "sıcak bölgeler" oluşturur

#### 4.3.2 Blur
- **Eski Değer**: Varsayılan (genellikle 15)
- **Yeni Değer**: `15` (zaten optimal, kontrol edilmeli)
- **Açıklama**: Noktalar arası geçişin yumuşaklığını kontrol eder
- **Etki**: Daha yumuşak ve doğal görünüm

#### 4.3.3 MaxZoom
- **Eski Değer**: Varsayılan (genellikle 18)
- **Yeni Değer**: `10`
- **Açıklama**: Heatmap'in maksimum zoom seviyesinde görünmesini kontrol eder
- **Etki**: Yakınlaştırıldığında heatmap kaybolur, bölgesel görünüm korunur

### 4.4 Görsel Sonuç
- Veriler tekil noktalar değil, bölgesel "bulutlar" olarak görünecek
- Kesinti yoğunluğu daha net anlaşılacak
- Harita daha okunabilir ve anlamlı olacak
- Zoom yapıldığında detay seviyesi değişecek

### 4.5 Diğer Heatmap Parametreleri (İsteğe Bağlı)
- **Gradient**: Renk geçişleri özelleştirilebilir
- **MinOpacity**: Minimum görünürlük ayarlanabilir
- **Max**: Maksimum yoğunluk değeri ayarlanabilir

---

## 5. Teknik Detaylar

### 5.1 State Yönetimi Optimizasyonu
- Realtime güncellemelerinde state update pattern'i optimize edilmeli
- Gereksiz re-render'ları önlemek için `useMemo` ve `useCallback` kullanılabilir
- State güncellemeleri batch'lenebilir (performans için)

### 5.2 Performance İyileştirmeleri
- Realtime subscription'ları optimize edilmeli
- Heatmap render'ı optimize edilmeli (sadece gerektiğinde güncelle)
- Debouncing eklenebilir (çok sık güncellemeleri önlemek için)

### 5.3 Error Handling Geliştirmeleri
- Realtime bağlantı hatalarında kullanıcıya bilgi verilmeli
- Toast ile hata mesajları gösterilmeli
- Fallback mekanizmaları düşünülmeli

### 5.4 TypeScript Tip Güvenliği
- Realtime event tipleri tanımlanmalı
- Toast mesaj tipleri kontrol edilmeli
- Heatmap parametre tipleri doğrulanmalı

---

## 6. Dosya Yapısı

Phase 2 tamamlandığında proje yapısı şöyle olmalı:

```
TRNC-Community-Based-Outage-Map/
├── app/
│   ├── page.tsx              # Güncellenmiş: Time filter + Realtime
│   ├── layout.tsx             # Güncellenmiş: Toaster eklendi
│   ├── globals.css
│   └── favicon.ico
├── components/
│   └── Map.tsx                # Güncellenmiş: Optimize heatmap
├── utils/
│   └── supabaseClient.ts
├── .env.local
├── package.json               # Güncellenmiş: sonner eklendi
└── docs/
    ├── PHASE_1.md
    └── PHASE_2.md            # Bu dosya
```

---

## 7. Bağımlılıklar

### 7.1 Yeni Paket
- `sonner` - Toast bildirimleri için

### 7.2 Mevcut Paketler (Değişiklik Yok)
- `@supabase/supabase-js` - Realtime özelliği için
- `react-leaflet` - Harita için
- `leaflet` - Harita için
- `leaflet.heat` - Heatmap için

### 7.3 Kurulum Komutu
```bash
npm install sonner
```

---

## 8. Test Senaryoları

### 8.1 Zaman Filtresi
- Sadece son 2 saat içindeki veriler mi getiriliyor?
- Eski veriler haritada görünmüyor mu?
- Zaman penceresi doğru hesaplanıyor mu?

### 8.2 Realtime Abonelik
- Yeni bir bildirim geldiğinde harita güncelleniyor mu?
- Sayfa yenilenmeden veri ekleniyor mu?
- Component unmount olduğunda abonelik kapanıyor mu?
- Multiple subscription'lar oluşmuyor mu?

### 8.3 Toast Bildirimleri
- Başarılı bildirim gönderildiğinde toast gösteriliyor mu?
- Hata durumlarında uygun toast mesajları gösteriliyor mu?
- Alert() kaldırıldı mı?
- Toast'lar doğru pozisyonda görünüyor mu?

### 8.4 Heatmap Optimizasyonu
- Radius 25 olarak ayarlandı mı?
- Blur 15 olarak ayarlandı mı?
- MaxZoom 10 olarak ayarlandı mı?
- Heatmap bölgesel "bulut" görünümünde mi?
- Zoom yapıldığında heatmap kayboluyor mu?

---

## 9. Supabase Yapılandırması

### 9.1 Realtime Etkinleştirme
Supabase Dashboard'da aşağıdaki adımlar izlenmeli:

1. **Database** > **Replication** bölümüne gidin
2. `reports` tablosunu bulun
3. Realtime publication'ı etkinleştirin
4. Veya SQL ile:
   ```sql
   ALTER PUBLICATION supabase_realtime ADD TABLE reports;
   ```

### 9.2 Row Level Security (RLS)
- Realtime çalışması için RLS politikaları kontrol edilmeli
- Anonim kullanıcılar INSERT yapabilmeli (mevcut)
- Anonim kullanıcılar SELECT yapabilmeli (mevcut)
- Realtime için gerekli izinler kontrol edilmeli

---

## 10. Notlar ve Önemli Hatırlatmalar

1. **Realtime Subscription**: Component unmount olduğunda mutlaka cleanup yapılmalı
2. **Time Filter**: 2 saatlik pencere değiştirilebilir olmalı (constant olarak tanımlanmalı)
3. **Toast Position**: Kullanıcı deneyimine göre ayarlanabilir
4. **Heatmap Performance**: Çok fazla veri olduğunda performans sorunları olabilir, optimize edilmeli
5. **Timezone**: Zaman filtrelemede UTC kullanımı önerilir
6. **Error Boundaries**: Realtime hatalarında uygulama çökmesin
7. **Network Status**: Offline durumunda kullanıcıya bilgi verilmeli (isteğe bağlı)

---

## 11. Tamamlanma Kriterleri

Phase 2 aşağıdaki kriterler sağlandığında tamamlanmış sayılır:

- ✅ `app/page.tsx` içindeki fetch sorgusu zaman filtresi içeriyor (son 2 saat)
- ✅ Eski veriler haritada görünmüyor
- ✅ Supabase Realtime aboneliği kuruldu (`.on('postgres_changes')`)
- ✅ Yeni INSERT işlemlerinde harita anlık güncelleniyor
- ✅ Component cleanup'ında abonelik kapatılıyor
- ✅ `sonner` paketi kuruldu
- ✅ `app/layout.tsx` içine `<Toaster />` eklendi
- ✅ `alert()` kaldırıldı, yerine `toast.success()` kullanılıyor
- ✅ Hata durumlarında uygun toast mesajları gösteriliyor
- ✅ `components/Map.tsx` içinde heatmap parametreleri optimize edildi
- ✅ Radius: 25, Blur: 15, MaxZoom: 10 olarak ayarlandı
- ✅ Heatmap bölgesel "bulut" görünümünde görüntüleniyor
- ✅ Supabase Dashboard'da Realtime etkinleştirildi

---

## 12. Sonraki Adımlar (Phase 3+)

Phase 2 tamamlandıktan sonra düşünülebilecek özellikler:

- **PWA Özellikleri**: Offline desteği, app-like deneyim
- **Gelişmiş Filtreleme**: Zaman penceresi seçimi, yoğunluk filtreleme
- **Kullanıcı İstatistikleri**: Toplam bildirim sayısı, aktif kesinti sayısı
- **Harita Kontrolleri**: Zoom seviyesi göstergesi, harita türü seçimi
- **Bildirim Geçmişi**: Kullanıcının gönderdiği bildirimlerin listesi
- **Analytics**: Kesinti trendleri, en çok etkilenen bölgeler
- **Push Notifications**: Yeni kesinti bildirimleri (PWA ile)

---

**Son Güncelleme**: Phase 2 Planlama Dokümanı
**Durum**: Planlama Aşaması
**Önkoşul**: Phase 1 tamamlanmış olmalı
**Sonraki**: Implementation

