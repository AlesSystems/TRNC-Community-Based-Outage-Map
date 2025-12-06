# Phase 4: Güvenlik ve Yasal Uyumluluk

## Genel Bakış

Bu doküman, uygulamanın güvenlik ve yasal uyumluluk özelliklerini eklemek için gerekli adımları içermektedir. Phase 4, spam koruması (rate limiting) ve yasal feragatname (legal disclaimer) üzerine odaklanmaktadır. Bu özellikler, kullanıcı deneyimini korumak ve yasal sorumlulukları azaltmak için kritik öneme sahiptir.

## Hedefler

- Rate limiting ile spam koruması
- Yasal feragatname modal'ı
- Kullanıcı onayı yönetimi
- localStorage tabanlı durum takibi

---

## 1. Rate Limiting (Spam Koruması)

### 1.1 Amaç
Kullanıcıların çok sık bildirim göndermesini engelleyerek spam'i önlemek ve veritabanı yükünü azaltmak. Ayrıca, kullanıcıların yanlışlıkla birden fazla bildirim göndermesini engellemek.

### 1.2 Güncellenecek Dosya
- **Dosya**: `app/page.tsx`
- **Fonksiyon**: `handleReport`
- **Bölüm**: Fonksiyonun başında rate limiting kontrolü

### 1.3 Rate Limiting Mantığı

#### 1.3.1 Zaman Kontrolü
- **Süre**: 10 dakika (600 saniye)
- **Kontrol Noktası**: Fonksiyonun başında, konum alma işleminden önce
- **Kayıt Yeri**: localStorage
- **Key**: `last_report_time`

#### 1.3.2 İşleyiş
1. Kullanıcı bildirim butonuna tıklar
2. `handleReport` fonksiyonu çalışır
3. localStorage'dan `last_report_time` değeri okunur
4. Eğer değer varsa:
   - Mevcut zaman ile karşılaştırılır
   - Fark 10 dakikadan azsa → İşlem durdurulur, uyarı gösterilir
   - Fark 10 dakika veya daha fazlaysa → İşlem devam eder
5. Eğer değer yoksa (ilk bildirim):
   - İşlem devam eder
6. Bildirim başarılı olduğunda:
   - Mevcut zamanı `last_report_time` olarak localStorage'a kaydet

#### 1.3.3 Zaman Hesaplama
- **Mevcut Zaman**: `Date.now()` veya `new Date().getTime()`
- **Kayıtlı Zaman**: localStorage'dan string olarak okunur, number'a çevrilir
- **Fark Hesaplama**: `currentTime - lastReportTime`
- **Milisaniye Cevirme**: 10 dakika = 10 * 60 * 1000 = 600000 ms

### 1.4 Uyarı Mesajı
- **Kütüphane**: sonner (zaten mevcut)
- **Tip**: `toast.warning()` veya `toast.error()`
- **Mesaj**: 'Çok hızlı gidiyorsun! Bildirimler arasında 10 dakika beklemelisin.'
- **Pozisyon**: Mevcut toast pozisyonu (bottom-right)
- **Süre**: Varsayılan toast süresi

### 1.5 localStorage Yönetimi

#### 1.5.1 Key İsimleri
- **Rate Limiting**: `last_report_time`
- **Device ID**: `device_id` (zaten mevcut)
- **Legal Modal**: `has_seen_legal` (Phase 4.2'de kullanılacak)

#### 1.5.2 Veri Formatı
- **Tip**: Timestamp (number veya string)
- **Önerilen**: Number (milisaniye cinsinden)
- **Alternatif**: ISO string (parse edilmesi gerekir)

#### 1.5.3 Hata Yönetimi
- localStorage erişim hatalarında (ör. Private browsing):
  - Try-catch ile yakalanmalı
  - Hata durumunda işlem devam edebilir (graceful degradation)
  - Veya kullanıcıya bilgi verilebilir

### 1.6 Kullanıcı Deneyimi
- Rate limit'e takıldığında kullanıcıya net bir mesaj gösterilmeli
- Kalan süre gösterilebilir (isteğe bağlı, gelecekte eklenebilir)
- Buton disabled yapılabilir (isteğe bağlı)
- Visual feedback (buton animasyonu, vb.) eklenebilir

### 1.7 Güvenlik Notları
- **Client-Side Kontrol**: Bu kontrol client-side'da yapılır, kolayca bypass edilebilir
- **Server-Side Doğrulama**: Gelecekte Supabase RLS (Row Level Security) ile server-side kontrol eklenebilir
- **Device ID Bazlı**: Rate limiting device_id bazlıdır, farklı cihazlardan farklı kullanıcılar bildirim gönderebilir

---

## 2. Yasal Feragatname (Legal Disclaimer Modal)

### 2.1 Amaç
Kullanıcıları uygulamanın veri doğruluğu ve sorumlulukları hakkında bilgilendirmek. Yasal koruma sağlamak ve kullanıcıların verilerin resmi olmadığını anlamasını sağlamak.

### 2.2 Dosya Oluşturma
- **Dosya Yolu**: `components/LegalModal.tsx`
- **Component Tipi**: Client Component (`'use client'` direktifi ile)
- **Amaç**: Yasal feragatname modal'ını göstermek

### 2.3 Modal Özellikleri

#### 2.3.1 Görünüm
- **Tip**: Modal/Dialog overlay
- **Pozisyon**: Sayfanın ortasında, sabit
- **Arka Plan**: Yarı saydam overlay (backdrop)
- **Z-Index**: Yüksek değer (diğer elementlerin üstünde)
- **Responsive**: Mobil ve desktop uyumlu

#### 2.3.2 İçerik
- **Başlık**: 'Önemli Uyarı'
  - Büyük, dikkat çekici font
  - Kırmızı veya turuncu renk (uyarı rengi)
  - Bold veya semibold ağırlık

- **Metin**: 'Bu haritadaki veriler tamamen kullanıcı bildirimlerine dayanmaktadır. Resmi KIBTEK verisi değildir ve kesin doğruluk taahhüt etmez. Lütfen resmi duyuruları takip ediniz.'
  - Okunabilir font boyutu
  - Açık ve net dil
  - Yasal açıklama

- **Buton**: 'Anladım ve Kabul Ediyorum'
  - Primary button stili
  - Dikkat çekici renk (kırmızı veya mavi)
  - Hover efekti
  - Tıklanabilir ve erişilebilir

#### 2.3.3 Davranış
- **Açılış**: Sayfa ilk yüklendiğinde otomatik açılır
- **Kapanış**: Butona tıklandığında kapanır
- **Tekrar Açılmama**: localStorage ile kontrol edilir
- **Overlay Tıklama**: Modal dışına tıklanınca kapanmamalı (sadece buton ile)

### 2.4 localStorage Kontrolü

#### 2.4.1 Key
- **Key**: `has_seen_legal`
- **Değer**: Boolean string ('true' veya 'false') veya timestamp

#### 2.4.2 Kontrol Mantığı
1. Component mount olduğunda localStorage kontrol edilir
2. `has_seen_legal` key'i varsa ve 'true' ise:
   - Modal gösterilmez
3. `has_seen_legal` key'i yoksa veya 'false' ise:
   - Modal gösterilir
4. Kullanıcı "Anladım" butonuna tıkladığında:
   - `has_seen_legal` = 'true' olarak kaydedilir
   - Modal kapanır

#### 2.4.3 useEffect Kullanımı
- Component mount olduğunda localStorage kontrolü yapılmalı
- State ile modal görünürlüğü yönetilmeli
- Cleanup gerekmez (sadece okuma işlemi)

### 2.5 Modal Bileşen Yapısı

#### 2.5.1 State Yönetimi
- **isOpen**: Boolean state (modal açık/kapalı)
- **hasSeenLegal**: Boolean state (localStorage'dan okunan değer)
- **useState** ve **useEffect** kullanılmalı

#### 2.5.2 Stil
- **Tailwind CSS**: Mevcut stil sistemi kullanılmalı
- **Backdrop**: Yarı saydam siyah overlay
- **Modal Container**: Beyaz arka plan, rounded corners, shadow
- **Responsive**: Mobilde tam ekran veya merkezi küçük kutu

#### 2.5.3 Accessibility
- **ARIA Labels**: Modal için uygun ARIA attribute'ları
- **Focus Management**: Modal açıldığında focus modal içine alınmalı
- **Keyboard Navigation**: ESC tuşu ile kapanma (isteğe bağlı)
- **Screen Reader**: Başlık ve içerik okunabilir olmalı

### 2.6 Entegrasyon

#### 2.6.1 app/page.tsx'e Ekleme
- LegalModal component'i import edilmeli
- Sayfa içinde render edilmeli
- Conditional rendering kullanılabilir (state'e göre)

#### 2.6.2 Render Sırası
- LegalModal, harita ve butonun üstünde render edilmeli
- Z-index ile kontrol edilmeli
- Portal kullanılabilir (isteğe bağlı, daha iyi DOM yapısı için)

---

## 3. Teknik Detaylar

### 3.1 localStorage Kullanımı

#### 3.1.1 Browser Desteği
- Modern tarayıcılarda desteklenir
- Private/Incognito modda sınırlı olabilir
- Hata yönetimi gerekli

#### 3.1.2 Veri Formatı
- **String**: localStorage sadece string saklar
- **Number**: String'e çevrilmeli (toString())
- **Boolean**: 'true'/'false' string olarak saklanmalı
- **JSON**: JSON.stringify/parse kullanılabilir

#### 3.1.3 Hata Yönetimi
```javascript
try {
  localStorage.setItem('key', 'value');
} catch (error) {
  // Private browsing veya storage dolu
  console.error('localStorage error:', error);
}
```

### 3.2 Zaman Hesaplamaları

#### 3.2.1 Timestamp Formatları
- **Date.now()**: Milisaniye cinsinden number
- **new Date().getTime()**: Milisaniye cinsinden number
- **new Date().toISOString()**: ISO string formatı

#### 3.2.2 Zaman Farkı Hesaplama
- **Milisaniye**: `currentTime - lastTime`
- **Saniye**: `(currentTime - lastTime) / 1000`
- **Dakika**: `(currentTime - lastTime) / (1000 * 60)`

#### 3.2.3 Sabitler
- **10 Dakika**: `10 * 60 * 1000` = 600000 ms
- Constant olarak tanımlanmalı (RATE_LIMIT_MINUTES veya benzeri)

### 3.3 Modal Implementasyonu

#### 3.3.1 Portal Kullanımı (İsteğe Bağlı)
- React Portal ile modal body'ye render edilebilir
- DOM yapısını temiz tutar
- Next.js'te `react-dom` Portal kullanılabilir

#### 3.3.2 Animasyonlar
- Fade-in/fade-out animasyonları
- Tailwind CSS transition sınıfları
- CSS transitions veya Framer Motion (isteğe bağlı)

#### 3.3.3 Overlay (Backdrop)
- Yarı saydam siyah arka plan
- Modal'ın arkasında, tüm ekranı kaplar
- Tıklanabilir olmamalı (sadece görsel)

---

## 4. Dosya Yapısı

Phase 4 tamamlandığında proje yapısı şöyle olmalı:

```
TRNC-Community-Based-Outage-Map/
├── app/
│   ├── page.tsx              # Güncellenmiş: Rate limiting + LegalModal
│   ├── layout.tsx
│   ├── globals.css
│   └── favicon.ico
├── components/
│   ├── Map.tsx
│   └── LegalModal.tsx        # Yeni: Yasal feragatname modal'ı
├── utils/
│   └── supabaseClient.ts
├── public/
│   ├── manifest.json
│   └── icon.png
└── docs/
    ├── PHASE_1.md
    ├── PHASE_2.md
    ├── PHASE_3.md
    └── PHASE_4.md            # Bu dosya
```

---

## 5. Kullanıcı Deneyimi Akışı

### 5.1 İlk Ziyaret Senaryosu
1. Kullanıcı siteye ilk kez gelir
2. Sayfa yüklenir
3. LegalModal otomatik açılır (has_seen_legal yok)
4. Kullanıcı uyarıyı okur
5. "Anladım ve Kabul Ediyorum" butonuna tıklar
6. Modal kapanır, has_seen_legal = 'true' kaydedilir
7. Kullanıcı haritayı kullanabilir

### 5.2 Bildirim Gönderme Senaryosu (Normal)
1. Kullanıcı "Elektrik Yok! ⚡️" butonuna tıklar
2. Rate limiting kontrolü yapılır (ilk bildirim, geçer)
3. Konum izni istenir
4. Konum alınır
5. Bildirim Supabase'e kaydedilir
6. last_report_time kaydedilir
7. Başarı toast'ı gösterilir

### 5.3 Bildirim Gönderme Senaryosu (Rate Limited)
1. Kullanıcı "Elektrik Yok! ⚡️" butonuna tıklar
2. Rate limiting kontrolü yapılır
3. Son bildirimden 5 dakika geçmiş (10 dakika limiti var)
4. İşlem durdurulur
5. Uyarı toast'ı gösterilir: "Çok hızlı gidiyorsun! Bildirimler arasında 10 dakika beklemelisin."
6. Konum alma işlemi başlamaz

### 5.4 Tekrar Ziyaret Senaryosu
1. Kullanıcı siteye tekrar gelir
2. Sayfa yüklenir
3. LegalModal açılmaz (has_seen_legal = 'true')
4. Kullanıcı direkt haritayı kullanabilir

---

## 6. Test Senaryoları

### 6.1 Rate Limiting Testleri
- İlk bildirim gönderildiğinde rate limit kontrolü geçiyor mu?
- 10 dakikadan az süre içinde ikinci bildirim engelleniyor mu?
- 10 dakika geçtikten sonra bildirim gönderilebiliyor mu?
- localStorage'dan last_report_time doğru kaydediliyor mu?
- localStorage'dan last_report_time doğru okunuyor mu?
- Uyarı mesajı doğru gösteriliyor mu?

### 6.2 Legal Modal Testleri
- İlk ziyarette modal açılıyor mu?
- Modal içeriği doğru görüntüleniyor mu?
- "Anladım" butonuna tıklandığında modal kapanıyor mu?
- has_seen_legal localStorage'a kaydediliyor mu?
- Tekrar ziyarette modal açılmıyor mu?
- localStorage temizlendiğinde modal tekrar açılıyor mu?

### 6.3 localStorage Hata Senaryoları
- Private browsing modunda hata oluşuyor mu?
- localStorage dolu olduğunda ne oluyor?
- localStorage erişimi engellendiğinde uygulama çalışıyor mu?

### 6.4 Entegrasyon Testleri
- Rate limiting ve LegalModal birlikte çalışıyor mu?
- Her iki özellik de aynı anda kullanılabilir mi?
- localStorage key'leri çakışmıyor mu?

---

## 7. Güvenlik ve Yasal Notlar

### 7.1 Rate Limiting Güvenlik
- **Client-Side Kontrol**: Kolayca bypass edilebilir
- **Server-Side Doğrulama**: Gelecekte Supabase RLS ile eklenebilir
- **Device ID Bazlı**: Farklı cihazlardan farklı kullanıcılar bildirim gönderebilir
- **IP Bazlı Kontrol**: Gelecekte server-side'da eklenebilir

### 7.2 Yasal Feragatname
- **Amaç**: Yasal sorumluluğu azaltmak
- **Etkililik**: Kullanıcı onayı alınması önemli
- **Güncellenebilirlik**: Gelecekte içerik güncellenebilir
- **Çoklu Dil**: Gelecekte farklı dillerde versiyonlar eklenebilir

### 7.3 Veri Doğruluğu
- Kullanıcı bildirimlerine dayalı veriler
- Resmi KIBTEK verisi değil
- Kesin doğruluk taahhüt edilmez
- Kullanıcılar resmi duyuruları takip etmeli

### 7.4 Gizlilik
- Device ID localStorage'da saklanır
- Konum verileri Supabase'de saklanır
- Kullanıcılar anonim olarak bildirim gönderebilir
- GDPR uyumluluğu için gelecekte gizlilik politikası eklenebilir

---

## 8. Gelecek İyileştirmeler

### 8.1 Rate Limiting İyileştirmeleri
- **Kalan Süre Göstergesi**: Kullanıcıya ne kadar bekleyeceğini göster
- **Buton Disable**: Rate limit aktifken butonu disable et
- **Server-Side Kontrol**: Supabase RLS ile server-side rate limiting
- **IP Bazlı Kontrol**: Aynı IP'den çok fazla istek engelleme
- **Cooldown Animasyonu**: Görsel geri bildirim

### 8.2 Legal Modal İyileştirmeleri
- **Çoklu Dil**: Türkçe ve İngilizce versiyonlar
- **Versiyon Kontrolü**: Yeni versiyonlarda tekrar göster
- **Detaylı Bilgi**: Daha fazla yasal bilgi içeren sayfa linki
- **Gizlilik Politikası**: Ayrı bir gizlilik politikası modal'ı
- **Kullanım Şartları**: Detaylı kullanım şartları sayfası

### 8.3 Güvenlik İyileştirmeleri
- **CAPTCHA**: Bot koruması için CAPTCHA ekleme
- **IP Rate Limiting**: Server-side IP bazlı kontrol
- **Device Fingerprinting**: Daha güvenilir cihaz tanıma
- **Verification**: Bildirim doğrulama sistemi

---

## 9. Notlar ve Önemli Hatırlatmalar

1. **Rate Limiting**: Client-side kontrol kolayca bypass edilebilir, server-side kontrol önerilir
2. **localStorage**: Private browsing modunda çalışmayabilir, hata yönetimi gerekli
3. **Zaman Hesaplamaları**: Timezone sorunları olabilir, UTC kullanımı önerilir
4. **Legal Modal**: Yasal açıklama net ve anlaşılır olmalı
5. **Kullanıcı Onayı**: Modal'ı kapatmak onay sayılır, kayıt tutulmalı
6. **Accessibility**: Modal erişilebilir olmalı (keyboard navigation, screen reader)
7. **Mobile UX**: Mobil cihazlarda modal düzgün görünmeli
8. **Performance**: localStorage işlemleri performansı etkilemez (minimal)

---

## 10. Tamamlanma Kriterleri

Phase 4 aşağıdaki kriterler sağlandığında tamamlanmış sayılır:

- ✅ `handleReport` fonksiyonunda rate limiting kontrolü eklendi
- ✅ localStorage'a `last_report_time` kaydediliyor
- ✅ 10 dakika kontrolü çalışıyor (son bildirimden 10 dakika geçmeli)
- ✅ Rate limit'e takıldığında işlem durduruluyor
- ✅ Rate limit uyarı mesajı gösteriliyor: 'Çok hızlı gidiyorsun! Bildirimler arasında 10 dakika beklemelisin.'
- ✅ `components/LegalModal.tsx` dosyası oluşturuldu
- ✅ LegalModal client component olarak işaretlendi ('use client')
- ✅ Modal içeriği doğru: Başlık 'Önemli Uyarı', metin yasal açıklama
- ✅ "Anladım ve Kabul Ediyorum" butonu eklendi
- ✅ localStorage'da `has_seen_legal` kontrolü yapılıyor
- ✅ İlk ziyarette modal otomatik açılıyor
- ✅ Butona tıklandığında modal kapanıyor ve tekrar açılmıyor
- ✅ LegalModal `app/page.tsx`'e eklendi
- ✅ Rate limiting ve LegalModal birlikte çalışıyor
- ✅ Hata yönetimi yapıldı (localStorage erişim hataları)
- ✅ Mobil ve desktop'ta düzgün çalışıyor

---

## 11. Deployment Öncesi Kontrol Listesi

Phase 4 tamamlandıktan sonra deployment öncesi kontrol edilmesi gerekenler:

- [ ] Rate limiting test edildi (farklı senaryolar)
- [ ] Legal modal test edildi (ilk ziyaret, tekrar ziyaret)
- [ ] localStorage hata senaryoları test edildi
- [ ] Mobil cihazlarda test edildi
- [ ] Farklı tarayıcılarda test edildi
- [ ] Accessibility test edildi (keyboard navigation, screen reader)
- [ ] Performance test edildi (localStorage işlemleri)
- [ ] Yasal metin gözden geçirildi
- [ ] Build başarılı (`npm run build`)
- [ ] Lint hataları yok (`npm run lint`)

---

**Son Güncelleme**: Phase 4 Planlama Dokümanı
**Durum**: Planlama Aşaması
**Önkoşul**: Phase 1, Phase 2 ve Phase 3 tamamlanmış olmalı
**Sonraki**: Deployment Hazırlığı

