# Phase 5: SEO ve Analytics Yapılandırması

## Genel Bakış

Bu doküman, uygulamanın production'a hazırlanması için gerekli SEO (Search Engine Optimization) ve Analytics ayarlarını içermektedir. Phase 5, arama motoru optimizasyonu, sosyal medya paylaşımları için Open Graph ayarları ve site trafiği analizi üzerine odaklanmaktadır. Bu özellikler, uygulamanın keşfedilebilirliğini artırır ve kullanıcı davranışlarını anlamamıza yardımcı olur.

## Hedefler

- Vercel Analytics entegrasyonu
- SEO optimizasyonu (metadata güncellemeleri)
- Open Graph ayarları (sosyal medya paylaşımları)
- robots.txt yapılandırması

---

## 1. Vercel Analytics

### 1.1 Amaç
Site trafiğini izlemek, kullanıcı davranışlarını anlamak ve performans metriklerini takip etmek. Vercel Analytics, privacy-first bir yaklaşımla kullanıcı gizliliğini korurken detaylı analitik veriler sağlar.

### 1.2 Paket Kurulumu
- **Paket**: `@vercel/analytics`
- **Kurulum**: `npm install @vercel/analytics`
- **Tip**: Production dependency
- **Boyut**: Minimal bundle size impact

### 1.3 Entegrasyon

#### 1.3.1 Güncellenecek Dosya
- **Dosya**: `app/layout.tsx`
- **Bölüm**: Root layout component içine Analytics bileşeni ekleme

#### 1.3.2 Import
- `@vercel/analytics/react` paketinden `Analytics` component'i import edilmeli
- Next.js App Router ile uyumlu

#### 1.3.3 Yerleştirme
- `Analytics` component'i `<body>` içinde, `{children}` ve `<Toaster />` ile birlikte render edilmeli
- Component'in kendisi görünmez, sadece script enjekte eder
- SSR uyumludur, herhangi bir ek yapılandırma gerektirmez

#### 1.3.4 Çalışma Mantığı
- Vercel'de deploy edildiğinde otomatik olarak çalışır
- Development ortamında çalışmaz (sadece production)
- Veriler Vercel Dashboard'da görüntülenir
- Kullanıcı gizliliği korunur (GDPR uyumlu)

### 1.4 Özellikler
- **Sayfa Görüntülemeleri**: Her sayfa için görüntüleme sayısı
- **Benzersiz Ziyaretçiler**: Tekil kullanıcı sayısı
- **Coğrafi Dağılım**: Ziyaretçilerin konumları
- **Cihaz ve Tarayıcı**: Kullanılan cihaz ve tarayıcı türleri
- **Performans Metrikleri**: Sayfa yükleme süreleri
- **Referrer Bilgisi**: Trafik kaynakları

### 1.5 Gizlilik
- Cookie kullanmaz
- IP adresleri anonimleştirilir
- Kişisel veri toplamaz
- GDPR ve CCPA uyumlu
- Kullanıcı onayı gerektirmez

---

## 2. Metadata Güncellemeleri (SEO & Open Graph)

### 2.1 Amaç
Arama motorlarında daha iyi görünürlük sağlamak ve sosyal medya paylaşımlarında zengin önizleme kartları göstermek. Bu, organik trafik artışına ve daha iyi kullanıcı deneyimine katkıda bulunur.

### 2.2 Güncellenecek Dosya
- **Dosya**: `app/layout.tsx`
- **Bölüm**: `metadata` export objesi

### 2.3 Title (Başlık)

#### 2.3.1 Yeni Title
- **Değer**: 'Kıbrıs Elektrik Kesinti Haritası ⚡️'
- **Uzunluk**: ~40 karakter (optimal)
- **Emoji**: ⚡️ (elektrik/yıldırım emoji'si)
- **Açıklama**: Arama sonuçlarında görünen başlık

#### 2.3.2 SEO İpuçları
- Anahtar kelimeler içerir: "Kıbrıs", "Elektrik", "Kesinti", "Harita"
- Emoji dikkat çeker ve görsel olarak ayırt edicidir
- Kısa ve açıklayıcıdır
- Kullanıcı niyetini karşılar

### 2.4 Description (Açıklama)

#### 2.4.1 Yeni Description
- **Değer**: 'Mahallende elektrik mi kesildi? Haritadan kontrol et, jeneratör ihtiyacını hesapla. KKTC'nin ilk topluluk tabanlı kesinti takip sistemi.'
- **Uzunluk**: ~140 karakter (optimal)
- **Ton**: Soru-cevap formatı, kullanıcı odaklı

#### 2.4.2 İçerik Analizi
- **Sorun**: "Mahallende elektrik mi kesildi?" (kullanıcı sorunu)
- **Çözüm**: "Haritadan kontrol et" (çözüm)
- **Ek Değer**: "jeneratör ihtiyacını hesapla" (ek özellik)
- **Farklılaşma**: "KKTC'nin ilk topluluk tabanlı kesinti takip sistemi" (benzersizlik)

#### 2.4.3 SEO İpuçları
- Anahtar kelimeler doğal olarak kullanılmış
- Kullanıcı niyetini karşılar
- Call-to-action içerir
- Benzersiz değer önerisi sunar

### 2.5 Open Graph (OG) Metadata

#### 2.5.1 Amaç
Sosyal medya platformlarında (Facebook, Twitter, LinkedIn, WhatsApp vb.) paylaşıldığında zengin önizleme kartları göstermek.

#### 2.5.2 OG Title
- **Key**: `openGraph.title`
- **Değer**: 'Elektrik mi Kesildi? Haritaya Bak!'
- **Uzunluk**: ~35 karakter (sosyal medya için optimal)
- **Ton**: Daha kısa, dikkat çekici, action-oriented

#### 2.5.3 OG Description
- **Key**: `openGraph.description`
- **Değer**: 'Anlık kesinti bildirimleri ve jeneratör hesaplayıcı.'
- **Uzunluk**: ~50 karakter (kısa ve öz)
- **Ton**: Özellik odaklı, net ve anlaşılır

#### 2.5.4 OG Image
- **Key**: `openGraph.images`
- **Değer**: `['/og-image.png']`
- **Dosya Yolu**: `public/og-image.png`
- **Boyut**: 1200x630px (önerilen)
- **Format**: PNG veya JPG
- **İçerik**: Uygulamanın görsel temsili, başlık ve özellikler

#### 2.5.5 OG Image Gereksinimleri
- **Minimum Boyut**: 600x315px
- **Önerilen Boyut**: 1200x630px
- **Aspect Ratio**: 1.91:1
- **Format**: PNG, JPG veya WebP
- **Dosya Boyutu**: 8MB'dan küçük (önerilen: 1MB altı)
- **İçerik**: 
  - Uygulama adı
  - Ana özellikler
  - Görsel olarak çekici tasarım
  - Okunabilir metin

#### 2.5.6 Ek OG Metadata (İsteğe Bağlı)
- **og:type**: 'website' (varsayılan)
- **og:url**: Site URL'i
- **og:site_name**: 'Kıbrıs Elektrik Kesinti Haritası'
- **og:locale**: 'tr_TR' veya 'en_US'

### 2.6 Twitter Card Metadata (İsteğe Bağlı)
- **twitter:card**: 'summary_large_image'
- **twitter:title**: OG title ile aynı
- **twitter:description**: OG description ile aynı
- **twitter:image**: OG image ile aynı

### 2.7 Metadata Yapısı
Next.js 13+ App Router'da metadata objesi şu şekilde yapılandırılmalı:
- `title`: String veya object
- `description`: String
- `openGraph`: Object (title, description, images, vb.)
- `twitter`: Object (isteğe bağlı)
- `icons`: Object (zaten mevcut)
- `manifest`: String (zaten mevcut)

---

## 3. robots.txt Yapılandırması

### 3.1 Amaç
Arama motorlarına hangi sayfaların taranabileceğini ve hangilerinin taranamayacağını söylemek. Bu, SEO için kritik öneme sahiptir ve site indekslemesini kontrol eder.

### 3.2 Dosya Oluşturma
- **Dosya Yolu**: `public/robots.txt`
- **Format**: Plain text
- **Erişim**: Tarayıcılar bu dosyayı otomatik olarak `/robots.txt` yolundan okur

### 3.3 İçerik

#### 3.3.1 User-agent
- **Değer**: `*`
- **Açıklama**: Tüm arama motorları için geçerlidir
- **Alternatifler**: 
  - `Googlebot` (sadece Google)
  - `Bingbot` (sadece Bing)
  - `*` (tüm botlar)

#### 3.3.2 Allow
- **Değer**: `/`
- **Açıklama**: Tüm sayfaların taranmasına izin ver
- **Anlamı**: Site tamamen açık, hiçbir kısıtlama yok

#### 3.3.3 Tam İçerik
```
User-agent: *
Allow: /
```

### 3.4 Ek Direktifler (İsteğe Bağlı)

#### 3.4.1 Disallow (Gelecekte Kullanılabilir)
- Belirli sayfaları taramadan hariç tutmak için:
  - `/admin/*` (admin paneli)
  - `/api/*` (API endpoint'leri)
  - `/private/*` (özel sayfalar)

#### 3.4.2 Sitemap
- Sitemap dosyasının yerini belirtmek için:
  - `Sitemap: https://example.com/sitemap.xml`
  - Gelecekte sitemap oluşturulduğunda eklenebilir

#### 3.4.3 Crawl-delay
- Botların tarama hızını sınırlamak için:
  - `Crawl-delay: 1` (1 saniye bekleme)
  - Genellikle gerekli değildir

### 3.5 Test
- Tarayıcıda `/robots.txt` adresine giderek dosyanın erişilebilir olduğunu kontrol et
- Google Search Console'da robots.txt test aracını kullan
- Sitemap validator araçlarını kullan

---

## 4. OG Image Oluşturma

### 4.1 Amaç
Sosyal medya paylaşımlarında görünecek görseli oluşturmak. Bu görsel, uygulamanın ilk izlenimini oluşturur ve tıklama oranlarını artırır.

### 4.2 Tasarım Gereksinimleri

#### 4.2.1 Boyut
- **Önerilen**: 1200x630px
- **Minimum**: 600x315px
- **Aspect Ratio**: 1.91:1
- **Format**: PNG veya JPG

#### 4.2.2 İçerik Önerileri
- **Başlık**: "Kıbrıs Elektrik Kesinti Haritası" veya "Elektrik mi Kesildi?"
- **Alt Başlık**: "Anlık kesinti bildirimleri ve jeneratör hesaplayıcı"
- **Görsel**: Harita görüntüsü, yıldırım ikonu, veya uygulama ekran görüntüsü
- **Renkler**: Marka renkleri (kırmızı #ef4444, beyaz, siyah)
- **Logo**: İsteğe bağlı uygulama logosu

#### 4.2.3 Tasarım İpuçları
- Metin okunabilir olmalı (büyük font)
- Yüksek kontrast kullanılmalı
- Görsel olarak çekici olmalı
- Marka kimliğini yansıtmalı
- Mobil ve desktop'ta iyi görünmeli

### 4.3 Oluşturma Araçları
- **Canva**: Hazır şablonlar ve kolay kullanım
- **Figma**: Profesyonel tasarım
- **Adobe Photoshop/Illustrator**: Gelişmiş düzenleme
- **Online OG Image Generators**: Hızlı çözümler
- **Next.js OG Image Generation**: Programatik oluşturma (gelecekte)

### 4.4 Dosya Yerleşimi
- **Dosya**: `public/og-image.png`
- **Erişim**: `/og-image.png` URL'inden erişilebilir
- **Alternatif**: `public/og-image.jpg` (daha küçük dosya boyutu)

---

## 5. Teknik Detaylar

### 5.1 Vercel Analytics Entegrasyonu

#### 5.1.1 Import Syntax
```typescript
import { Analytics } from '@vercel/analytics/react';
```

#### 5.1.2 Component Kullanımı
```typescript
<Analytics />
```

#### 5.1.3 Yerleştirme
- `<body>` içinde, herhangi bir yerde olabilir
- Genellikle `{children}` ve diğer global component'lerle birlikte
- SSR uyumlu, ek yapılandırma gerektirmez

### 5.2 Metadata Yapısı

#### 5.2.1 Next.js Metadata API
Next.js 13+ App Router'da metadata şu şekilde tanımlanır:
```typescript
export const metadata: Metadata = {
  title: '...',
  description: '...',
  openGraph: {
    title: '...',
    description: '...',
    images: ['/og-image.png'],
  },
};
```

#### 5.2.2 TypeScript Tipleri
- `Metadata` tipi `next` paketinden import edilir
- Type-safe metadata tanımlaması
- Otomatik tamamlama desteği

### 5.3 robots.txt Formatı
- Plain text dosyası
- Her satır bir direktif
- Boş satırlar yok sayılır
- Yorumlar `#` ile başlar

---

## 6. Dosya Yapısı

Phase 5 tamamlandığında proje yapısı şöyle olmalı:

```
TRNC-Community-Based-Outage-Map/
├── app/
│   ├── page.tsx
│   ├── stats/
│   │   └── page.tsx
│   ├── calculator/
│   │   └── page.tsx
│   ├── layout.tsx              # Güncellenmiş: Analytics + Metadata
│   ├── globals.css
│   └── favicon.ico
├── components/
│   ├── Map.tsx
│   ├── LegalModal.tsx
│   └── Ticker.tsx
├── utils/
│   └── supabaseClient.ts
├── public/
│   ├── manifest.json
│   ├── icon.png
│   ├── og-image.png            # Yeni: Open Graph görseli
│   └── robots.txt              # Yeni: robots.txt
├── package.json                # Güncellenmiş: @vercel/analytics
└── docs/
    ├── PHASE_1.md
    ├── PHASE_2.md
    ├── PHASE_3.md
    ├── PHASE_4.md
    ├── PHASE_4.5.md
    └── PHASE_5.md              # Bu dosya
```

---

## 7. Test ve Doğrulama

### 7.1 Vercel Analytics Testi
- **Production Deploy**: Analytics sadece production'da çalışır
- **Vercel Dashboard**: Deploy sonrası Analytics sekmesini kontrol et
- **Veri Gecikmesi**: Veriler birkaç dakika içinde görünmeye başlar
- **Test Trafik**: Birkaç sayfa görüntüleme yaparak test et

### 7.2 SEO Metadata Testi
- **Google Rich Results Test**: https://search.google.com/test/rich-results
- **Google Search Console**: Metadata'yı doğrula
- **Tarayıcı DevTools**: `<head>` içinde metadata tag'lerini kontrol et
- **View Page Source**: HTML'de metadata tag'lerini görüntüle

### 7.3 Open Graph Testi
- **Facebook Debugger**: https://developers.facebook.com/tools/debug/
- **Twitter Card Validator**: https://cards-dev.twitter.com/validator
- **LinkedIn Post Inspector**: https://www.linkedin.com/post-inspector/
- **WhatsApp**: Paylaşım önizlemesini kontrol et

### 7.4 robots.txt Testi
- **Tarayıcı**: `/robots.txt` adresine git
- **Google Search Console**: robots.txt test aracı
- **Online Validators**: robots.txt doğrulama araçları
- **Curl**: Terminal'den `curl https://example.com/robots.txt`

---

## 8. Performans ve Optimizasyon

### 8.1 Analytics Performans
- **Bundle Size**: Minimal impact (~1-2KB)
- **Runtime**: Asenkron yükleme, sayfa performansını etkilemez
- **Privacy**: Cookie kullanmaz, GDPR uyumlu

### 8.2 OG Image Optimizasyonu
- **Dosya Boyutu**: 1MB altında tutulmalı
- **Format**: PNG (transparency) veya JPG (küçük boyut)
- **Compression**: Image optimization araçları kullanılabilir
- **CDN**: Vercel otomatik olarak optimize eder

### 8.3 Metadata Performans
- **Build Time**: Metadata build-time'da işlenir
- **Runtime Impact**: Yok (static)
- **SEO Benefit**: Arama motorları için kritik

---

## 9. Gizlilik ve Uyumluluk

### 9.1 Vercel Analytics Gizliliği
- **Cookie-Free**: Cookie kullanmaz
- **IP Anonymization**: IP adresleri anonimleştirilir
- **GDPR Uyumlu**: Kişisel veri toplamaz
- **Onay Gerektirmez**: Kullanıcı onayı gerekmez

### 9.2 Metadata Gizliliği
- **Public Information**: Metadata public bilgidir
- **No Tracking**: Metadata tracking yapmaz
- **SEO Only**: Sadece SEO amaçlıdır

### 9.3 robots.txt Gizliliği
- **Public File**: robots.txt public bir dosyadır
- **No Personal Data**: Kişisel veri içermez
- **Standard Practice**: Web standartıdır

---

## 10. Gelecek İyileştirmeler

### 10.1 Analytics İyileştirmeleri
- **Custom Events**: Özel event tracking eklenebilir
- **Conversion Tracking**: Dönüşüm takibi
- **A/B Testing**: Farklı versiyonları test etme
- **User Flow Analysis**: Kullanıcı akışı analizi

### 10.2 SEO İyileştirmeleri
- **Sitemap.xml**: Tüm sayfalar için sitemap oluşturma
- **Structured Data**: Schema.org markup ekleme
- **Canonical URLs**: Duplicate content önleme
- **Hreflang Tags**: Çoklu dil desteği için

### 10.3 Open Graph İyileştirmeleri
- **Dynamic OG Images**: Her sayfa için özel görsel
- **Video OG**: Video içerik için OG video
- **Article OG**: Blog yazıları için article type
- **Locale Support**: Farklı diller için locale

---

## 11. Notlar ve Önemli Hatırlatmalar

1. **Vercel Analytics**: Sadece Vercel'de deploy edildiğinde çalışır
2. **OG Image**: Mutlaka 1200x630px boyutunda olmalı
3. **robots.txt**: Public klasöründe olmalı, Next.js otomatik serve eder
4. **Metadata**: Build-time'da işlenir, runtime'da değiştirilemez
5. **SEO**: Metadata güncellemeleri arama motorlarında birkaç gün içinde görünür
6. **Analytics**: Veriler birkaç dakika gecikmeyle görünür
7. **OG Image**: Sosyal medya platformları cache kullanır, değişiklikler hemen görünmeyebilir
8. **Test**: Tüm özellikler production'da test edilmelidir

---

## 12. Tamamlanma Kriterleri

Phase 5 aşağıdaki kriterler sağlandığında tamamlanmış sayılır:

- ✅ `@vercel/analytics` paketi kuruldu
- ✅ `app/layout.tsx`'e `Analytics` component'i eklendi
- ✅ Analytics component'i doğru şekilde import edildi ve render edildi
- ✅ `metadata` objesi güncellendi
- ✅ Title: 'Kıbrıs Elektrik Kesinti Haritası ⚡️' olarak ayarlandı
- ✅ Description: Belirtilen metin olarak ayarlandı
- ✅ Open Graph title: 'Elektrik mi Kesildi? Haritaya Bak!' olarak ayarlandı
- ✅ Open Graph description: 'Anlık kesinti bildirimleri ve jeneratör hesaplayıcı.' olarak ayarlandı
- ✅ Open Graph images: ['/og-image.png'] olarak ayarlandı
- ✅ `public/og-image.png` dosyası oluşturuldu (1200x630px)
- ✅ `public/robots.txt` dosyası oluşturuldu
- ✅ robots.txt içeriği: 'User-agent: *' ve 'Allow: /' içeriyor
- ✅ Build başarılı (`npm run build`)
- ✅ Lint hataları yok (`npm run lint`)
- ✅ Production'da Analytics çalışıyor (Vercel Dashboard'da görünüyor)
- ✅ Metadata tag'leri HTML'de görünüyor
- ✅ OG image sosyal medya platformlarında görünüyor

---

## 13. Deployment Sonrası Kontrol Listesi

Phase 5 tamamlandıktan ve deploy edildikten sonra kontrol edilmesi gerekenler:

- [ ] Vercel Dashboard'da Analytics verileri görünüyor mu?
- [ ] Google Search Console'da site indeksleniyor mu?
- [ ] Metadata Google'da doğru görünüyor mu?
- [ ] Facebook Debugger'da OG image görünüyor mu?
- [ ] Twitter Card Validator'da görsel görünüyor mu?
- [ ] robots.txt erişilebilir mi? (`/robots.txt`)
- [ ] OG image erişilebilir mi? (`/og-image.png`)
- [ ] Tüm sayfalarda metadata doğru mu?
- [ ] Analytics verileri doğru toplanıyor mu?
- [ ] Performans metrikleri normal mi?

---

**Son Güncelleme**: Phase 5 Planlama Dokümanı
**Durum**: Planlama Aşaması
**Önkoşul**: Phase 1-4.5 tamamlanmış olmalı
**Sonraki**: Production Deployment

