# Phase 6: Coğrafi Sınırlama ve Güvenlik Güncellemesi

## Genel Bakış

Bu doküman, uygulamanın kritik bir güvenlik güncellemesini içermektedir. Phase 6, bildirim gönderme işlemini sadece KKTC sınırları içinde kısıtlayarak sistemin bütünlüğünü korumak ve yanlış veri girişlerini önlemek üzerine odaklanmaktadır. Bu özellik, kullanıcıların dünyanın her yerinden bildirim göndermesini engelleyerek haritanın doğruluğunu ve güvenilirliğini artırır.

## Hedefler

- Coğrafi sınırlama (Geographic Boundary Restriction)
- KKTC bounding box kontrolü
- Kullanıcı geri bildirimi (hata mesajları)
- Veri bütünlüğü koruması

---

## 1. Coğrafi Sınırlama (Geographic Boundary Restriction)

### 1.1 Amaç
Kullanıcıların sadece KKTC sınırları içinde bildirim göndermesini sağlamak. Bu, haritanın doğruluğunu korur, spam'i azaltır ve sistemin sadece hedef bölge için çalıştığını garanti eder.

### 1.2 Sorun
Mevcut implementasyonda, dünyanın her yerinden kullanıcılar bildirim gönderebiliyor. Bu durum:
- Haritada yanlış verilerin görünmesine neden olur
- Sistemin amacından sapmasına yol açar
- Veritabanında gereksiz veri birikimine neden olur
- İstatistiklerin yanlış hesaplanmasına yol açar

### 1.3 Çözüm
Bounding box (sınır kutusu) kontrolü ile KKTC sınırları içinde olmayan konumları reddetmek.

---

## 2. Bounding Box Tanımlaması

### 2.1 KKTC Coğrafi Sınırları
Kuzey Kıbrıs Türk Cumhuriyeti'nin yaklaşık coğrafi sınırları:
- **Güney Ucu**: ~34.9° Kuzey (Güney Kıbrıs sınırı)
- **Kuzey Ucu**: ~35.8° Kuzey (Kuzey kıyı)
- **Batı Ucu**: ~32.2° Doğu (Güzelyurt bölgesi)
- **Doğu Ucu**: ~34.7° Doğu (Karpaz yarımadası)

### 2.2 Bounding Box Sabitleri
```typescript
const KKTC_BOUNDS = {
  minLat: 34.9,  // Güney ucu
  maxLat: 35.8,  // Kuzey ucu
  minLng: 32.2,  // Batı ucu (Güzelyurt tarafı)
  maxLng: 34.7   // Doğu ucu (Karpaz tarafı)
};
```

### 2.3 Sınır Seçimi Mantığı
- **Geniş Aralık**: Küçük GPS hatalarını ve yakın bölgelerdeki kullanıcıları kapsamak için biraz geniş tutulmuştur
- **Güvenli Kenarlık**: Sınırlarda yaşayan kullanıcıların bildirim gönderebilmesi için buffer alanı
- **Doğruluk**: KKTC'nin tüm bölgelerini kapsar (Lefkoşa, Girne, Gazimağusa, Güzelyurt, İskele, Lefke)

---

## 3. Güncellenecek Dosya

### 3.1 Dosya Bilgileri
- **Dosya**: `app/page.tsx`
- **Fonksiyon**: `handleReport`
- **Bölüm**: Konum alma işleminden sonra, Supabase'e göndermeden önce

### 3.2 Değişiklik Noktası
Bounding box kontrolü, `navigator.geolocation.getCurrentPosition` callback fonksiyonunun içinde, `latitude` ve `longitude` değerleri alındıktan sonra ve Supabase'e insert işleminden önce yapılmalıdır.

---

## 4. Kontrol Mantığı

### 4.1 Validasyon Algoritması
```typescript
// Konum alındıktan sonra kontrol
const { latitude, longitude } = position.coords;

// Bounding box kontrolü
if (
  latitude < KKTC_BOUNDS.minLat ||
  latitude > KKTC_BOUNDS.maxLat ||
  longitude < KKTC_BOUNDS.minLng ||
  longitude > KKTC_BOUNDS.maxLng
) {
  // İşlemi durdur
  // Hata mesajı göster
  return;
}
```

### 4.2 Kontrol Sırası
1. Konum başarıyla alındı (`getCurrentPosition` success callback)
2. `latitude` ve `longitude` değerleri extract edildi
3. **Bounding box kontrolü yapılır** (YENİ)
4. Eğer sınırlar dışındaysa → İşlem durdurulur, hata gösterilir
5. Eğer sınırlar içindeyse → İşlem devam eder (device ID, Supabase insert)

### 4.3 Hata Durumu İşleme
- **İşlem**: Supabase'e veri gönderme işlemi yapılmaz
- **Geri Dönüş**: Fonksiyon erken return ile sonlanır
- **Kullanıcı Geri Bildirimi**: `toast.error()` ile hata mesajı gösterilir

---

## 5. Kullanıcı Geri Bildirimi

### 5.1 Hata Mesajı
- **Metin**: 'Bu hizmet sadece KKTC sınırları içinde kullanılabilir. Konumunuz kapsama alanı dışında.'
- **Tip**: `toast.error()` (kırmızı toast bildirimi)
- **Dil**: Türkçe
- **Ton**: Açıklayıcı ve kullanıcı dostu

### 5.2 Mesaj İçeriği Analizi
- **Kısıtlama**: "Bu hizmet sadece KKTC sınırları içinde kullanılabilir"
- **Sebep**: "Konumunuz kapsama alanı dışında"
- **Açıklık**: Kullanıcıya neden bildirim gönderemediğini net bir şekilde açıklar

### 5.3 Görsel Geri Bildirim
- **Renk**: Kırmızı (hata durumu)
- **İkon**: Sonner toast kütüphanesinin varsayılan hata ikonu
- **Süre**: Varsayılan toast süresi (genellikle 4-5 saniye)
- **Konum**: Ekranın üst kısmında (toast konumu)

---

## 6. Implementasyon Detayları

### 6.1 Sabitlerin Yerleştirilmesi
- **Konum**: `handleReport` fonksiyonunun başında, diğer sabitlerin yanında
- **Kapsam**: Fonksiyon içinde erişilebilir olmalı
- **Tip**: `const` ile tanımlanmalı (değiştirilemez)

### 6.2 Kontrol Bloğunun Yerleştirilmesi
```typescript
navigator.geolocation.getCurrentPosition(
  async (position) => {
    try {
      const { latitude, longitude } = position.coords;

      // BOUNDING BOX KONTROLÜ (YENİ)
      if (
        latitude < KKTC_BOUNDS.minLat ||
        latitude > KKTC_BOUNDS.maxLat ||
        longitude < KKTC_BOUNDS.minLng ||
        longitude > KKTC_BOUNDS.maxLng
      ) {
        toast.error('Bu hizmet sadece KKTC sınırları içinde kullanılabilir. Konumunuz kapsama alanı dışında.');
        return;
      }

      // Mevcut kod devam eder (device ID, Supabase insert...)
      // ...
    }
  }
);
```

### 6.3 Rate Limiting ile İlişkisi
- Bounding box kontrolü, rate limiting kontrolünden **sonra** yapılır
- Rate limiting kontrolü → Konum alma → **Bounding box kontrolü** → Supabase insert
- Her iki kontrol de bağımsız çalışır ve kendi hata mesajlarını gösterir

---

## 7. Test Senaryoları

### 7.1 Başarılı Senaryo
- **Konum**: Lefkoşa (35.2, 33.4)
- **Beklenen**: Bildirim başarıyla gönderilir, toast.success gösterilir

### 7.2 Başarısız Senaryolar

#### 7.2.1 Kuzey Sınırı Dışı
- **Konum**: Türkiye (41.0, 28.9)
- **Beklenen**: Hata mesajı gösterilir, Supabase'e veri gönderilmez

#### 7.2.2 Güney Sınırı Dışı
- **Konum**: Güney Kıbrıs (34.5, 33.0)
- **Beklenen**: Hata mesajı gösterilir, Supabase'e veri gönderilmez

#### 7.2.3 Batı Sınırı Dışı
- **Konum**: Yunanistan (37.9, 23.7)
- **Beklenen**: Hata mesajı gösterilir, Supabase'e veri gönderilmez

#### 7.2.4 Doğu Sınırı Dışı
- **Konum**: Suriye (33.5, 36.3)
- **Beklenen**: Hata mesajı gösterilir, Supabase'e veri gönderilmez

### 7.3 Sınır Durumları

#### 7.3.1 Minimum Latitude (Güney)
- **Konum**: (34.9, 33.0) - Sınırda
- **Beklenen**: Bildirim gönderilir (sınır dahil)

#### 7.3.2 Maximum Latitude (Kuzey)
- **Konum**: (35.8, 33.0) - Sınırda
- **Beklenen**: Bildirim gönderilir (sınır dahil)

#### 7.3.3 Minimum Longitude (Batı)
- **Konum**: (35.2, 32.2) - Sınırda
- **Beklenen**: Bildirim gönderilir (sınır dahil)

#### 7.3.4 Maximum Longitude (Doğu)
- **Konum**: (35.2, 34.7) - Sınırda
- **Beklenen**: Bildirim gönderilir (sınır dahil)

---

## 8. Güvenlik Notları

### 8.1 Client-Side Kontrol
- **Sınırlama**: Bu kontrol client-side'da yapılmaktadır
- **Güvenlik Seviyesi**: Temel koruma sağlar, ancak bypass edilebilir
- **Gelecek İyileştirme**: Server-side validation (Supabase RLS veya Edge Function) eklenebilir

### 8.2 Veri Bütünlüğü
- **Amaç**: Yanlış verilerin veritabanına girmesini önlemek
- **Etkililik**: Çoğu kullanıcı için yeterli koruma sağlar
- **Ek Güvenlik**: Backend'de de kontrol yapılması önerilir

### 8.3 Kullanıcı Deneyimi
- **Hızlı Geri Bildirim**: Konum alındıktan hemen sonra kontrol yapılır
- **Net Mesaj**: Kullanıcıya neden bildirim gönderemediği açıklanır
- **Gereksiz İşlem Yok**: Supabase'e istek gönderilmez, kaynak tasarrufu

---

## 9. Gelecek İyileştirmeler

### 9.1 Server-Side Validation
- **Supabase RLS**: Row Level Security ile backend'de kontrol
- **Edge Function**: Supabase Edge Function ile validation
- **PostGIS**: PostGIS ile polygon kontrolü (daha hassas sınırlar)

### 9.2 Daha Hassas Sınırlar
- **Polygon Kullanımı**: Bounding box yerine gerçek KKTC polygon'u
- **PostGIS ST_Within**: PostGIS ile hassas sınır kontrolü
- **Harita Tabanlı**: OpenStreetMap verilerinden gerçek sınırlar

### 9.3 Kullanıcı Deneyimi İyileştirmeleri
- **Harita Gösterimi**: Kullanıcıya KKTC sınırlarını gösteren bir harita
- **Yakınlık Bilgisi**: "KKTC'ye X km uzaktasınız" mesajı
- **Yönlendirme**: "KKTC'ye nasıl gidilir" bilgisi

### 9.4 Analytics ve Monitoring
- **Reddedilen İstekler**: Kaç bildirim reddedildiğini takip etme
- **Coğrafi Dağılım**: Reddedilen bildirimlerin konumları
- **Hata Oranları**: Sınır dışı bildirim oranları

---

## 10. Özet

### 10.1 Yapılan Değişiklikler
- ✅ Bounding box sabitleri tanımlandı
- ✅ `handleReport` fonksiyonuna sınır kontrolü eklendi
- ✅ Hata mesajı implementasyonu yapıldı
- ✅ Kullanıcı geri bildirimi sağlandı

### 10.2 Sonuç
Bu güncelleme ile:
- Sadece KKTC sınırları içindeki kullanıcılar bildirim gönderebilir
- Haritanın doğruluğu korunur
- Veritabanında gereksiz veri birikimi önlenir
- Kullanıcılar net geri bildirim alır

### 10.3 Kritik Notlar
- Bu kontrol client-side'da yapılmaktadır
- Gelecekte server-side validation eklenmesi önerilir
- Bounding box değerleri ihtiyaca göre ayarlanabilir
- Test senaryoları mutlaka çalıştırılmalıdır

---

## 11. Kod Özeti

### 11.1 Eklenen Sabitler
```typescript
const KKTC_BOUNDS = {
  minLat: 34.9,
  maxLat: 35.8,
  minLng: 32.2,
  maxLng: 34.7
};
```

### 11.2 Eklenen Kontrol
```typescript
if (
  latitude < KKTC_BOUNDS.minLat ||
  latitude > KKTC_BOUNDS.maxLat ||
  longitude < KKTC_BOUNDS.minLng ||
  longitude > KKTC_BOUNDS.maxLng
) {
  toast.error('Bu hizmet sadece KKTC sınırları içinde kullanılabilir. Konumunuz kapsama alanı dışında.');
  return;
}
```

---

**Phase 6 Tamamlandı ✅**
