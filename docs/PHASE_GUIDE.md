# Phase Guide - Kılavuz Sayfası Ekleme

Bu dokümantasyon, uygulamaya "Nasıl Kullanılır?" kılavuz sayfasının eklenmesi sürecini açıklar.

## Genel Bakış

Kullanıcıları eğitmek ve uygulamanın nasıl kullanılacağını açıklamak için bir kılavuz sayfası eklenecektir. Bu sayfa, sistemin nasıl çalıştığını ve uygulamanın PWA olarak nasıl yükleneceğini açıklayacaktır.

## Yapılacak Değişiklikler

### 1. Kılavuz Sayfası Oluşturulacak

**Dosya:** `app/guide/page.tsx`

**Özellikler:**
- Temiz, okunabilir blog yazısı formatı
- Tailwind CSS ile responsive tasarım
- Dark mode desteği
- Lucide React ikonları ile görselleştirme

**İçerik Yapısı:**

#### Bölüm A: Sistem Nasıl Çalışır?
- **Başlık:** "Harita Nasıl Çalışır?"
- **Adım 1:** Elektriğin mi kesildi? ⚡️ Butonuna bas.
- **Adım 2:** Sistemin çalışması için senin gibi 3 komşunun daha bildirim yapması gerekir. (Vurgulanmış)
- **Adım 3:** Doğrulanan bölgeler haritada kırmızı yoğunluk olarak belirir.

#### Bölüm B: Uygulamayı Telefonuna Yükle (PWA)
- **Başlık:** "Uygulamayı İndir (Kurulum Yapmadan)"
- **iPhone (iOS) İçin:**
  1. Safari tarayıcısında alt menüdeki 'Paylaş' butonuna bas (Share2 ikonu)
  2. Açılan listede aşağı in ve 'Ana Ekrana Ekle' seçeneğine tıkla (PlusSquare ikonu)
  3. Sağ üstten 'Ekle' de
- **Android İçin:**
  1. Chrome tarayıcısında sağ üstteki 3 Nokta menüsüne tıkla (MoreVertical ikonu)
  2. 'Uygulamayı Yükle' veya 'Ana Ekrana Ekle' seçeneğine bas

### 2. Navigasyon Menüsü Güncellenecek

**Dosya:** `app/page.tsx`

**Değişiklikler:**
- Ana sayfadaki navigasyon menüsüne "❓ Nasıl Kullanılır?" linki eklenecek
- Link yeşil renk teması ile eklenecek (bg-green-600)
- Menüde en üstte konumlandırılacak

### 3. Geri Dönüş Butonu

**Özellikler:**
- Kılavuz sayfasının en altına "Ana Sayfaya Dön" butonu eklenecek
- Home ikonu ile görselleştirilecek
- Mavi tema ile tutarlı tasarım

## Teknik Detaylar

### Kullanılacak Teknolojiler
- **Next.js 16:** App Router yapısı
- **React 19:** Client component
- **Tailwind CSS:** Styling
- **Lucide React:** İkonlar (Share2, PlusSquare, MoreVertical, Home)
- **Next.js Link:** Navigasyon için

### Dosya Yapısı
```
app/
  guide/
    page.tsx          # Kılavuz sayfası (oluşturulacak)
  page.tsx            # Ana sayfa (güncellenecek)
```

### Stil Özellikleri
- Responsive tasarım (mobil ve desktop uyumlu)
- Dark mode desteği
- Gradient arka plan
- Card-based layout
- Renkli adım numaraları
- Vurgulu uyarı kutuları
- İkon entegrasyonu

## Kullanım

### Kullanıcı Akışı
1. Kullanıcı ana sayfada "❓ Nasıl Kullanılır?" butonuna tıklar
2. Kılavuz sayfası açılır
3. Kullanıcı sistemin nasıl çalıştığını öğrenir
4. PWA kurulum talimatlarını görür
5. "Ana Sayfaya Dön" butonu ile ana sayfaya geri döner

### Erişim Yolu
- URL: `/guide`
- Navigasyon: Ana sayfa menüsünden veya doğrudan URL ile

## İçerik Detayları

### Bölüm A: Sistem Nasıl Çalışır?

#### Adım 1: Bildirim Yapma
- Kullanıcı elektrik kesintisi yaşadığında ana sayfadaki kırmızı "Elektrik Yok! ⚡️" butonuna tıklar
- Sistem konum bilgisini alır ve bildirimi kaydeder
- Rate limiting: Her kullanıcı 10 dakikada bir bildirim yapabilir

#### Adım 2: Doğrulama Süreci
- **ÖNEMLİ:** Bir bölgede en az 4 bildirim olması gerekiyor
- Bu, haritada kesintinin görünmesi için gereklidir
- Sistemin çalışması için senin gibi 3 komşunun daha bildirim yapması gerekir
- Bu bilgi vurgulu bir şekilde gösterilecek

#### Adım 3: Harita Görünümü
- Doğrulanan bölgeler haritada kırmızı yoğunluk (heatmap) olarak belirir
- Daha koyu kırmızı renkler, daha fazla bildirim alan bölgeleri gösterir
- Gerçek zamanlı güncelleme: Yeni bildirimler anında haritada görünür

### Bölüm B: PWA Kurulumu

#### iOS (iPhone) Kurulumu
1. **Paylaş Butonu:** Safari tarayıcısında alt menüdeki 'Paylaş' butonuna bas
   - İkon: Share2 (lucide-react)
   - Konum: Alt menü çubuğu
2. **Ana Ekrana Ekle:** Açılan listede aşağı in ve 'Ana Ekrana Ekle' seçeneğine tıkla
   - İkon: PlusSquare (lucide-react)
   - Konum: Paylaş menüsü içinde
3. **Onay:** Sağ üstten 'Ekle' de

#### Android Kurulumu
1. **Menü:** Chrome tarayıcısında sağ üstteki 3 Nokta menüsüne tıkla
   - İkon: MoreVertical (lucide-react)
   - Konum: Sağ üst köşe
2. **Yükleme:** 'Uygulamayı Yükle' veya 'Ana Ekrana Ekle' seçeneğine bas

## Gelecek İyileştirmeler

- [ ] Görsel ekran görüntüleri eklenebilir
- [ ] Video tutorial eklenebilir
- [ ] Çoklu dil desteği eklenebilir
- [ ] İnteraktif demo eklenebilir
- [ ] FAQ bölümü eklenebilir
- [ ] Animasyonlu adımlar eklenebilir

## Notlar

- Sayfa tamamen client-side render edilecek (`'use client'`)
- Tüm içerik Türkçe olarak hazırlanacaktır
- PWA kurulum talimatları iOS ve Android için ayrı ayrı verilecektir
- Sistemin çalışması için gereken minimum bildirim sayısı (4) vurgulanacaktır
- Rate limiting bilgisi (10 dakika) kullanıcıya açıklanabilir

## Tasarım Prensipleri

- **Okunabilirlik:** Temiz, okunabilir blog yazısı formatı
- **Görselleştirme:** İkonlar ve renkli adım numaraları ile görsel zenginlik
- **Vurgu:** Önemli bilgiler (4 bildirim gereksinimi) vurgulu kutularda gösterilecek
- **Responsive:** Mobil ve desktop uyumlu tasarım
- **Erişilebilirlik:** Aria-label'lar ve semantik HTML kullanılacak
