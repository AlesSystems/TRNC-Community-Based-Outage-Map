# Phase 6: Elektrik Geri Geldi Bildirimi Özelliği

## Genel Bakış

Bu doküman, kullanıcıların elektriğin geri geldiğini bildirebilmeleri için yeni bir özellik eklenmesini içermektedir. Phase 6, kullanıcıların kesinti bildirimi yaptıktan sonra elektriğin geri geldiğini bildirebilmelerini sağlayarak haritadaki ısı yoğunluğunun (heatmap) dinamik olarak azalmasını ve gerçek zamanlı güncellenmesini sağlar.

## Hedefler

- Elektrik geri geldi bildirimi butonu eklenmesi
- Dinamik UI durumu yönetimi (bildirim yapıldıktan sonra buton değişimi)
- Supabase'den kullanıcının kendi bildirimlerini silme mekanizması
- Troll ve spam koruması
- Zaman aşımı kontrolü
- Harita güncellemesi ve ısı yoğunluğu azaltma

---

## 1. UI Güncellemesi (app/page.tsx)

### 1.1 Amaç
Kullanıcıların elektrik kesintisi bildirdikten sonra, elektriğin geri geldiğini bildirebilmeleri için ikinci bir buton eklenmesi.

### 1.2 Sorun
Mevcut implementasyonda, kullanıcılar sadece elektrik kesintisi bildirebiliyor ancak elektriğin geri geldiğini bildiremiyor. Bu durum:
- Haritada eski/geçersiz verilerin kalmasına neden olur
- Isı haritasında gereksiz yoğunluk birikimine yol açar
- Kullanıcıların geri bildirim vermesini engeller
- Haritanın gerçek zamanlı doğruluğunu azaltır

### 1.3 Çözüm
İki butonlu dinamik UI sistemi:
- **"Elektrik Yok ⚡️"** butonu: Varsayılan durum
- **"Elektrik Geldi 💡"** butonu: Kullanıcı bildirim yaptıktan sonra görünür

---

## 2. Buton Durumu Yönetimi

### 2.1 State Yönetimi
```typescript
const [hasReported, setHasReported] = useState(false);

useEffect(() => {
  // Component mount olduğunda kontrol et
  const lastReportTime = localStorage.getItem('last_report_time');
  const deviceId = localStorage.getItem('device_id');
  
  if (lastReportTime && deviceId) {
    // Son bildirim zamanını kontrol et (2 saat içinde mi?)
    const reportTime = Number(lastReportTime);
    const currentTime = Date.now();
    const timeWindowMs = TIME_WINDOW_HOURS * 60 * 60 * 1000;
    
    if (currentTime - reportTime <= timeWindowMs) {
      setHasReported(true);
    } else {
      // Zaman aşımına uğramış, temizle
      localStorage.removeItem('last_report_time');
      setHasReported(false);
    }
  }
}, []);
```

### 2.2 Buton Görünürlük Mantığı
- **hasReported = false**: "Elektrik Yok ⚡️" butonu görünür, "Elektrik Geldi 💡" butonu gizli
- **hasReported = true**: "Elektrik Yok ⚡️" butonu gizli, "Elektrik Geldi 💡" butonu görünür

### 2.3 Zaman Aşımı Kontrolü
- `last_report_time` kontrolü yapılır
- Eğer son bildirim 2 saatten eskiyse, `hasReported` false yapılır
- localStorage'dan `last_report_time` temizlenir
- UI varsayılan duruma döner

---

## 3. "Elektrik Geldi 💡" Butonu Tasarımı

### 3.1 Görsel Özellikler
- **Renk**: Yeşil gradient (`from-green-600 to-emerald-600`)
- **Hover Renk**: `hover:from-green-500 hover:to-emerald-500`
- **İkon**: `Zap` ikonu (aynı ikon, farklı stil)
- **Metin**: "Elektrik Geldi 💡"
- **Gölge**: Yeşil tonlu (`rgba(34, 197, 94, 0.5)`)
- **Pulse Efekti**: Yeşil renkli pulse animasyonu

### 3.2 Tasarım Detayları
```typescript
<button
  onClick={handleRestore}
  className="relative group bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold py-4 px-8 rounded-full shadow-[0_0_40px_rgba(34,197,94,0.5)] transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center gap-3 border border-green-400/30"
  aria-label="Elektrik geri geldi bildir"
>
  <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
    <Zap className="w-6 h-6 text-white fill-white" />
  </div>
  <span className="text-lg tracking-wide text-shadow-sm">Elektrik Geldi 💡</span>
</button>
```

### 3.3 Pulse Efekti
```typescript
<div className="absolute inset-0 bg-green-600 rounded-full animate-ping opacity-20 duration-1000"></div>
```

---

## 4. handleRestore Fonksiyonu

### 4.1 Fonksiyon Amacı
Kullanıcı "Elektrik Geldi 💡" butonuna bastığında:
1. Supabase'den kullanıcının son 2 saat içindeki bildirimlerini bul
2. Bu bildirimleri sil (DELETE)
3. localStorage'daki `last_report_time` değerini temizle
4. UI'ı varsayılan duruma döndür (`hasReported = false`)
5. Haritayı yenile
6. Başarı mesajı göster

### 4.2 Rate Limiting ve Spam Koruması
```typescript
const handleRestore = async () => {
  // Rate limiting kontrolü (aynı handleReport'daki gibi)
  try {
    const lastRestoreTime = localStorage.getItem('last_restore_time');
    if (lastRestoreTime) {
      const currentTime = Date.now();
      const timeDiff = currentTime - Number(lastRestoreTime);
      const rateLimitMs = RATE_LIMIT_MINUTES * 60 * 1000; // 10 dakika
      
      if (timeDiff < rateLimitMs) {
        toast.warning('Çok hızlı gidiyorsun! Bildirimler arasında 10 dakika beklemelisin.');
        return;
      }
    }
  } catch (error) {
    console.error('Rate limiting hatası:', error);
  }

  // Konum kontrolü (KKTC sınırları içinde mi?)
  if (!navigator.geolocation) {
    toast.error('Tarayıcınız konum özelliğini desteklemiyor');
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      try {
        const { latitude, longitude } = position.coords;

        // Bounding box kontrolü
        if (
          latitude < KKTC_BOUNDS.minLat ||
          latitude > KKTC_BOUNDS.maxLat ||
          longitude < KKTC_BOUNDS.minLng ||
          longitude > KKTC_BOUNDS.maxLng
        ) {
          toast.error('Bu hizmet sadece KKTC sınırları içinde kullanılabilir.');
          return;
        }

        // Device ID kontrolü
        const deviceId = localStorage.getItem('device_id');
        if (!deviceId) {
          toast.error('Bildirim bulunamadı. Önce kesinti bildirimi yapmalısınız.');
          return;
        }

        // Son 2 saat içindeki bildirimleri bul ve sil
        const timeThreshold = new Date(Date.now() - TIME_WINDOW_HOURS * 60 * 60 * 1000).toISOString();
        
        const { error } = await supabase
          .from('reports')
          .delete()
          .eq('device_id', deviceId)
          .gte('created_at', timeThreshold);

        if (error) throw error;

        // Başarılı işlem sonrası
        localStorage.removeItem('last_report_time');
        localStorage.setItem('last_restore_time', Date.now().toString());
        setHasReported(false);

        toast.success('Gözünüz aydın! Harita güncellendi.');
        
        // Haritayı yenile
        fetchReports();
      } catch (error) {
        console.error('Silme hatası:', error);
        toast.error('Bildirim silinemedi. Lütfen tekrar deneyin');
      }
    },
    (error) => {
      console.error('Konum hatası:', error);
      toast.error('Konumunuz alınamadı. Lütfen konum izni verin');
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    }
  );
};
```

### 4.3 Zaman Aşımı Kontrolü
- `last_restore_time` kontrolü ile spam koruması
- Aynı rate limiting mantığı (10 dakika)
- Kullanıcı çok hızlı tıklarsa uyarı mesajı

---

## 5. Supabase DELETE İşlemi

### 5.1 Silme Kriterleri
- **device_id**: Kullanıcının kendi bildirimleri
- **created_at**: Son 2 saat içindeki bildirimler
- **Konum**: KKTC sınırları içinde olmalı

### 5.2 SQL Sorgusu
```sql
DELETE FROM reports
WHERE device_id = :device_id
  AND created_at >= NOW() - INTERVAL '2 hours';
```

### 5.3 Supabase Client Kullanımı
```typescript
const timeThreshold = new Date(Date.now() - TIME_WINDOW_HOURS * 60 * 60 * 1000).toISOString();

const { error } = await supabase
  .from('reports')
  .delete()
  .eq('device_id', deviceId)
  .gte('created_at', timeThreshold);
```

---

## 6. UI Güncellemesi Detayları

### 6.1 Koşullu Render
```typescript
{/* Main Action Button (Floating) */}
<div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-[1000]">
  {hasReported ? (
    // Elektrik Geldi butonu
    <>
      <div className="absolute inset-0 bg-green-600 rounded-full animate-ping opacity-20 duration-1000"></div>
      <button onClick={handleRestore} className="...">
        {/* Yeşil buton içeriği */}
      </button>
    </>
  ) : (
    // Elektrik Yok butonu
    <>
      <div className="absolute inset-0 bg-red-600 rounded-full animate-ping opacity-20 duration-1000"></div>
      <button onClick={handleReport} className="...">
        {/* Kırmızı buton içeriği */}
      </button>
    </>
  )}
</div>
```

### 6.2 State Güncellemesi
- `handleReport` başarılı olduğunda: `setHasReported(true)`
- `handleRestore` başarılı olduğunda: `setHasReported(false)`
- Component mount'ta localStorage kontrolü ile state başlatma

---

## 7. Güvenlik ve Spam Koruması

### 7.1 Rate Limiting
- **Süre**: 10 dakika (RATE_LIMIT_MINUTES)
- **Kontrol**: `last_restore_time` localStorage değeri
- **Mesaj**: "Çok hızlı gidiyorsun! Bildirimler arasında 10 dakika beklemelisin."

### 7.2 Coğrafi Sınırlama
- KKTC bounding box kontrolü
- Sınırlar dışındaysa işlem yapılmaz
- Hata mesajı gösterilir

### 7.3 Device ID Kontrolü
- `device_id` localStorage'da yoksa işlem yapılmaz
- "Bildirim bulunamadı" mesajı gösterilir
- Kullanıcı önce kesinti bildirimi yapmalı

### 7.4 Zaman Aşımı
- `last_report_time` 2 saatten eskiyse otomatik temizleme
- UI varsayılan duruma döner
- Gereksiz veri birikimi önlenir

---

## 8. Kullanıcı Deneyimi

### 8.1 Başarı Mesajı
- **Metin**: "Gözünüz aydın! Harita güncellendi."
- **Tip**: `toast.success()` (yeşil toast bildirimi)
- **Dil**: Türkçe
- **Ton**: Pozitif ve teşvik edici

### 8.2 Hata Mesajları
- **Rate Limiting**: "Çok hızlı gidiyorsun! Bildirimler arasında 10 dakika beklemelisin."
- **Konum Hatası**: "Konumunuz alınamadı. Lütfen konum izni verin"
- **Sınır Dışı**: "Bu hizmet sadece KKTC sınırları içinde kullanılabilir."
- **Device ID Yok**: "Bildirim bulunamadı. Önce kesinti bildirimi yapmalısınız."

### 8.3 Görsel Geri Bildirim
- Yeşil renkli buton (pozitif aksiyon)
- Pulse animasyonu (dikkat çekici)
- Smooth transition (buton değişimi)

---

## 9. Harita Güncellemesi

### 9.1 Otomatik Yenileme
- `handleRestore` başarılı olduğunda `fetchReports()` çağrılır
- Harita güncel verilerle yenilenir
- Isı haritası otomatik güncellenir

### 9.2 Real-time Güncelleme
- Supabase realtime subscription DELETE event'lerini yakalar
- Harita otomatik olarak güncellenir
- Kullanıcı manuel yenileme yapmaz

### 9.3 Isı Yoğunluğu Azalması
- Kullanıcı bildirimlerini sildikçe heatmap yoğunluğu azalır
- Haritadaki kırmızı alanlar kendiliğinden kaybolur
- Gerçek zamanlı doğruluk artar

---

## 10. Implementasyon Adımları

### 10.1 State Ekleme
```typescript
const [hasReported, setHasReported] = useState(false);
```

### 10.2 useEffect ile Başlangıç Kontrolü
```typescript
useEffect(() => {
  const lastReportTime = localStorage.getItem('last_report_time');
  const deviceId = localStorage.getItem('device_id');
  
  if (lastReportTime && deviceId) {
    const reportTime = Number(lastReportTime);
    const currentTime = Date.now();
    const timeWindowMs = TIME_WINDOW_HOURS * 60 * 60 * 1000;
    
    if (currentTime - reportTime <= timeWindowMs) {
      setHasReported(true);
    } else {
      localStorage.removeItem('last_report_time');
      setHasReported(false);
    }
  }
}, []);
```

### 10.3 handleRestore Fonksiyonu Ekleme
- Rate limiting kontrolü
- Konum alma
- Bounding box kontrolü
- Supabase DELETE işlemi
- State ve localStorage güncellemesi
- Harita yenileme

### 10.4 handleReport Güncellemesi
```typescript
// Başarılı bildirim sonrası
setHasReported(true);
localStorage.setItem('last_report_time', Date.now().toString());
```

### 10.5 UI Koşullu Render
- `hasReported` durumuna göre buton değişimi
- Yeşil buton tasarımı
- Pulse efektleri

---

## 11. Test Senaryoları

### 11.1 Başarılı Senaryo
1. Kullanıcı "Elektrik Yok" butonuna basar
2. Bildirim başarıyla gönderilir
3. "Elektrik Geldi 💡" butonu görünür
4. Kullanıcı "Elektrik Geldi 💡" butonuna basar
5. Supabase'den bildirimler silinir
6. "Elektrik Yok ⚡️" butonu tekrar görünür
7. Harita güncellenir

### 11.2 Rate Limiting Senaryosu
1. Kullanıcı "Elektrik Geldi 💡" butonuna basar
2. İşlem başarılı olur
3. Kullanıcı 5 dakika sonra tekrar basar
4. Rate limiting uyarısı gösterilir
5. İşlem yapılmaz

### 11.3 Zaman Aşımı Senaryosu
1. Kullanıcı bildirim yapar
2. 3 saat sonra sayfayı yeniler
3. `last_report_time` 2 saatten eski olduğu için temizlenir
4. UI varsayılan duruma döner ("Elektrik Yok" butonu görünür)

### 11.4 Device ID Yok Senaryosu
1. Kullanıcı localStorage'ı temizler
2. "Elektrik Geldi 💡" butonuna basar
3. Device ID bulunamadı hatası gösterilir
4. İşlem yapılmaz

### 11.5 Coğrafi Sınır Senaryosu
1. Kullanıcı KKTC dışından "Elektrik Geldi 💡" butonuna basar
2. Bounding box kontrolü başarısız olur
3. Hata mesajı gösterilir
4. İşlem yapılmaz

---

## 12. Özet

### 12.1 Yapılan Değişiklikler
- ✅ `hasReported` state eklendi
- ✅ `handleRestore` fonksiyonu eklendi
- ✅ "Elektrik Geldi 💡" butonu eklendi
- ✅ Koşullu render implementasyonu yapıldı
- ✅ Rate limiting ve spam koruması eklendi
- ✅ Zaman aşımı kontrolü eklendi
- ✅ Supabase DELETE işlemi implementasyonu yapıldı
- ✅ Harita güncelleme mekanizması eklendi

### 12.2 Sonuç
Bu güncelleme ile:
- Kullanıcılar elektriğin geri geldiğini bildirebilir
- Haritadaki ısı yoğunluğu dinamik olarak azalır
- Troll ve spam koruması sağlanır
- Zaman aşımı ile gereksiz veri birikimi önlenir
- Kullanıcı deneyimi iyileştirilir

### 12.3 Kritik Notlar
- Rate limiting her iki buton için de geçerlidir
- Zaman aşımı kontrolü component mount'ta yapılır
- Supabase DELETE işlemi sadece kullanıcının kendi bildirimlerini siler
- Harita otomatik olarak güncellenir
- Real-time subscription DELETE event'lerini yakalar

---

## 13. Kod Özeti

### 13.1 State Ekleme
```typescript
const [hasReported, setHasReported] = useState(false);
```

### 13.2 useEffect ile Kontrol
```typescript
useEffect(() => {
  const lastReportTime = localStorage.getItem('last_report_time');
  const deviceId = localStorage.getItem('device_id');
  
  if (lastReportTime && deviceId) {
    const reportTime = Number(lastReportTime);
    const currentTime = Date.now();
    const timeWindowMs = TIME_WINDOW_HOURS * 60 * 60 * 1000;
    
    if (currentTime - reportTime <= timeWindowMs) {
      setHasReported(true);
    } else {
      localStorage.removeItem('last_report_time');
      setHasReported(false);
    }
  }
}, []);
```

### 13.3 handleRestore Fonksiyonu
```typescript
const handleRestore = async () => {
  // Rate limiting kontrolü
  // Konum alma
  // Bounding box kontrolü
  // Supabase DELETE işlemi
  // State ve localStorage güncellemesi
  // Harita yenileme
};
```

### 13.4 Koşullu Render
```typescript
{hasReported ? (
  <button onClick={handleRestore} className="...yeşil...">
    Elektrik Geldi 💡
  </button>
) : (
  <button onClick={handleReport} className="...kırmızı...">
    Elektrik Yok ⚡️
  </button>
)}
```

---

**Phase 6 Tamamlandı ✅**
