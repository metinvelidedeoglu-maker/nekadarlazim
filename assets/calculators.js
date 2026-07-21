import { addShoppingItem } from "./shopping-list.js";

const trNumber = new Intl.NumberFormat("tr-TR", {
  maximumFractionDigits: 2,
});

const tools = {
  boya: {
    title: "Duvar Boyası Hesaplama",
    subtitle: "Odanızın duvarları ve tavanı için gereken yaklaşık boya miktarını hesaplayın.",
    button: "Boyayı hesapla",
    showInterpretation: true,
    formGuidance: [
      "Mevcut rengi, lekeleri, çatlakları ve yüzeyin yeni sıva ya da alçı olup olmadığını yazın.",
      "İstenen yeni rengi özellikle açık veya koyu olarak tarif edin.",
      "Rutubet, nem veya kabarma varsa açıklamada mutlaka belirtin.",
    ],
    fields: [
      { key: "length", label: "Oda uzunluğu", unit: "m", value: 5, min: 0.1, step: 0.1 },
      { key: "width", label: "Oda genişliği", unit: "m", value: 4, min: 0.1, step: 0.1 },
      { key: "height", label: "Duvar yüksekliği", unit: "m", value: 2.7, min: 0.1, step: 0.1 },
      { key: "doorArea", label: "Toplam kapı alanı", unit: "m²", value: 2, min: 0, step: 0.1 },
      { key: "windowArea", label: "Toplam pencere alanı", unit: "m²", value: 3, min: 0, step: 0.1 },
      { key: "paintCeiling", label: "Tavan da boyanacak", type: "checkbox", value: true },
      {
        key: "currentCondition",
        label: "Mevcut durumu tarif edin",
        type: "textarea",
        value: "",
        placeholder: "Örn. Duvarlar koyu lacivert, yüzey düzgün ve temiz.",
      },
      {
        key: "desiredCondition",
        label: "İstenen durumu tarif edin",
        type: "textarea",
        value: "",
        placeholder: "Örn. Açık kırık beyaz renge boyamak istiyorum.",
      },
    ],
    calculate: calculatePaint,
  },
  parke: {
    title: "Parke Hesaplama",
    subtitle: "Odanız için gereken parke alanını ve paket sayısını bulun.",
    button: "Parkeyi hesapla",
    formGuidance: ["Paketin kapladığı m² bilgisini ürün ambalajından alın.", "Parkenin düz mü, çapraz mı döşeneceğini seçin; uygun kesim payını sistem ekler."],
    fields: [
      { key: "length", label: "Oda uzunluğu", unit: "m", value: 5, min: 0.1, step: 0.1 },
      { key: "width", label: "Oda genişliği", unit: "m", value: 4, min: 0.1, step: 0.1 },
      { key: "packArea", label: "Bir paketin kapladığı alan", unit: "m²", value: 1.84, min: 0.1, step: 0.01 },
      { key: "sameProduct", label: "Tüm odalarda aynı parke kullanılacak", type: "checkbox", value: true },
      {
        key: "layoutWaste",
        label: "Döşeme biçimi",
        type: "select",
        value: 10,
        options: [
          { value: 10, label: "Düz döşeme" },
          { value: 15, label: "Çapraz döşeme" },
        ],
      },
    ],
    calculate: calculateParquet,
  },
  seramik: {
    title: "Seramik Hesaplama",
    subtitle: "Zemin veya duvar için gereken seramik alanını ve kutu sayısını hesaplayın.",
    button: "Seramiği hesapla",
    formGuidance: ["Kutu üzerindeki toplam m² bilgisini esas alın.", "Uygulama yeri ve döşeme biçimine göre kesim payını sistem otomatik ekler.", "Kaplanmayacak alan yoksa boşluk değerini 0 bırakın.", "Aynı alan için ton ve kalibre kodlarını eşleştirin."],
    fields: [
      {
        key: "applicationType",
        label: "Uygulama yeri",
        type: "select",
        value: 1,
        options: [
          { value: 1, label: "Zemin" },
          { value: 2, label: "Duvar" },
        ],
      },
      { key: "length", label: "Uygulama uzunluğu", unit: "m", value: 4, min: 0.1, step: 0.1 },
      { key: "width", label: "Uygulama genişliği", unit: "m", value: 3, min: 0.1, step: 0.1 },
      { key: "excludedArea", label: "Kaplanmayacak toplam alan", unit: "m²", value: 0, min: 0, step: 0.1 },
      {
        key: "layoutStyle",
        label: "Döşeme biçimi",
        type: "select",
        value: 10,
        options: [
          { value: 10, label: "Düz döşeme" },
          { value: 15, label: "Çapraz döşeme" },
          { value: 16, label: "Desenli / yönlü döşeme" },
        ],
      },
      { key: "boxArea", label: "Bir kutunun kapladığı alan", unit: "m²", value: 1.44, min: 0.01, step: 0.01 },
      { key: "sameProduct", label: "Tüm alanlarda aynı seramik kullanılacak", type: "checkbox", value: true },
    ],
    calculate: calculateTile,
  },
  "duvar-kagidi": {
    title: "Duvar Kâğıdı Hesaplama",
    subtitle: "Duvar ölçülerine göre gereken rulo sayısını hesaplayın.",
    button: "Ruloyu hesapla",
    formGuidance: ["Tüm duvarların genişliğini toplayın ve en yüksek noktayı kullanın.", "Desen yoksa desen tekrarını 0 bırakın.", "Rulo ölçülerini ürün etiketinden doğrulayın."],
    fields: [
      { key: "totalWallWidth", label: "Kaplanacak toplam duvar genişliği", unit: "m", value: 18, min: 0.1, step: 0.1 },
      { key: "wallHeight", label: "Duvar yüksekliği", unit: "m", value: 2.7, min: 0.1, step: 0.1 },
      { key: "rollWidth", label: "Rulo genişliği", unit: "cm", value: 53, min: 1, step: 1 },
      { key: "rollLength", label: "Rulo uzunluğu", unit: "m", value: 10, min: 0.1, step: 0.1 },
      { key: "patternRepeat", label: "Desen tekrarı", unit: "cm", value: 0, min: 0, step: 1 },
    ],
    calculate: calculateWallpaper,
  },
  "duvar-paneli": {
    title: "Duvar Paneli Hesaplama",
    subtitle: "Duvarınız için gereken panel adedini kolayca bulun.",
    button: "Paneli hesapla",
    formGuidance: ["Panelin gerçek kaplama ölçüsünü kullanın.", "Hesap panellerin dikey yerleşimine göredir.", "Priz, köşe ve tesisat kesimlerini uygulama öncesinde planlayın."],
    fields: [
      { key: "wallWidth", label: "Duvar genişliği", unit: "m", value: 4, min: 0.1, step: 0.1 },
      { key: "wallHeight", label: "Duvar yüksekliği", unit: "m", value: 2.7, min: 0.1, step: 0.1 },
      { key: "panelWidth", label: "Panel genişliği", unit: "cm", value: 60, min: 1, step: 1 },
      { key: "panelHeight", label: "Panel yüksekliği", unit: "cm", value: 280, min: 1, step: 1 },
    ],
    calculate: calculateWallPanel,
  },
  beton: {
    title: "Beton Hacmi Hesaplama",
    subtitle: "Döşeme veya temel için gereken beton hacmini hesaplayın.",
    button: "Betonu hesapla",
    formGuidance: ["Kalınlığı santimetre olarak girin.", "Torba verimini ürün ambalajından kontrol edin.", "Taşıyıcı uygulamalarda beton sınıfı ve donatı için uzman görüşü alın."],
    fields: [
      { key: "length", label: "Uzunluk", unit: "m", value: 5, min: 0.1, step: 0.1 },
      { key: "width", label: "Genişlik", unit: "m", value: 3, min: 0.1, step: 0.1 },
      { key: "thickness", label: "Kalınlık", unit: "cm", value: 10, min: 1, step: 1 },
      { key: "bagYield", label: "Hazır karışım torbası verimi", unit: "L", value: 12, min: 1, step: 0.5 },
    ],
    calculate: calculateConcrete,
  },
  tugla: {
    title: "Tuğla ve Blok Hesaplama",
    subtitle: "Duvar alanına göre gereken tuğla veya blok adedini bulun.",
    button: "Tuğlayı hesapla",
    formGuidance: ["Ürünün duvar yüzünde görülen uzunluk ve yüksekliğini girin.", "Kapı ve pencerelerin toplam alanını çıkarın.", "Derz ve kırılma payını sistem otomatik uygular."],
    fields: [
      { key: "wallWidth", label: "Duvar genişliği", unit: "m", value: 5, min: 0.1, step: 0.1 },
      { key: "wallHeight", label: "Duvar yüksekliği", unit: "m", value: 2.7, min: 0.1, step: 0.1 },
      { key: "openingArea", label: "Kapı ve pencere alanı", unit: "m²", value: 2, min: 0, step: 0.1 },
      { key: "blockWidth", label: "Tuğla/blok uzunluğu", unit: "cm", value: 19, min: 1, step: 0.5 },
      { key: "blockHeight", label: "Tuğla/blok yüksekliği", unit: "cm", value: 13.5, min: 1, step: 0.5 },
    ],
    calculate: calculateBrick,
  },
  supurgelik: {
    title: "Süpürgelik Hesaplama",
    subtitle: "Oda çevresine göre gereken süpürgelik boyunu hesaplayın.",
    button: "Süpürgeliği hesapla",
    formGuidance: ["Süpürgelik uygulanmayacak kapı açıklıklarının toplamını girin.", "Ürün boyunu ambalaj veya ürün bilgisinden kontrol edin.", "Standart kesim payını sistem otomatik ekler."],
    fields: [
      { key: "length", label: "Oda uzunluğu", unit: "m", value: 5, min: 0.1, step: 0.1 },
      { key: "width", label: "Oda genişliği", unit: "m", value: 4, min: 0.1, step: 0.1 },
      { key: "doorWidth", label: "Toplam kapı genişliği", unit: "m", value: 0.9, min: 0, step: 0.1 },
      { key: "pieceLength", label: "Bir süpürgelik boyu", unit: "m", value: 2.4, min: 0.1, step: 0.1 },
    ],
    calculate: calculateSkirting,
  },
  perde: {
    title: "Perde Kumaşı Hesaplama",
    subtitle: "Pile oranına göre gereken yaklaşık perde kumaşını bulun.",
    button: "Kumaşı hesapla",
    formGuidance: ["Kornişin tamamını soldan sağa ölçün.", "Hesap, yüksekliği pencereye yeten boydan kumaş içindir.", "Desen tekrarı ve alt-üst kıvırmayı terzinizle ayrıca doğrulayın."],
    fields: [
      { key: "railWidth", label: "Korniş veya ray genişliği", unit: "m", value: 3, min: 0.1, step: 0.1 },
      {
        key: "fullness",
        label: "Pile sıklığı",
        unit: "kat",
        value: 2.5,
        type: "select",
        options: [
          { value: 1.5, label: "Seyrek pile — 1,5 kat" },
          { value: 2, label: "Orta pile — 2 kat" },
          { value: 2.5, label: "Sık pile — 2,5 kat" },
          { value: 3, label: "Çok sık pile — 3 kat" },
        ],
      },
      { key: "panelCount", label: "Perde parçası", unit: "adet", value: 2, min: 1, step: 1 },
    ],
    calculate: calculateCurtain,
  },
  elektrik: {
    title: "Elektrik Tüketimi Hesaplama",
    subtitle: "Bir cihazın aylık elektrik tüketimini ve maliyetini hesaplayın.",
    button: "Tüketimi hesapla",
    formGuidance: ["Cihaz gücünü ürün etiketindeki watt değerinden alın.", "Termostatlı cihazlar sürekli tam güçte çalışmayabilir.", "Maliyet için faturanızdaki güncel kWh birim fiyatını kullanın."],
    fields: [
      { key: "watts", label: "Cihaz gücü", unit: "W", value: 1500, min: 0, step: 1 },
      { key: "count", label: "Cihaz adedi", unit: "adet", value: 1, min: 1, step: 1 },
      { key: "hoursPerDay", label: "Günlük kullanım", unit: "saat", value: 3, min: 0, max: 24, step: 0.1 },
      { key: "daysPerMonth", label: "Aylık kullanım", unit: "gün", value: 30, min: 1, max: 31, step: 1 },
      { key: "pricePerKwh", label: "Faturanızdaki birim fiyat (isteğe bağlı)", unit: "₺/kWh", value: 0, min: 0, step: 0.01 },
    ],
    calculate: calculateElectricity,
  },
};

const multiTools = {
  boya: { label: "Oda", addLabel: "Oda ekle", repeat: ["length", "width", "height", "doorArea", "windowArea", "paintCeiling", "currentCondition", "desiredCondition"] },
  parke: { label: "Oda", addLabel: "Oda ekle", repeat: ["length", "width", "layoutWaste"] },
  seramik: { label: "Alan", addLabel: "Alan ekle", repeat: ["applicationType", "length", "width", "excludedArea", "layoutStyle"] },
  "duvar-kagidi": { label: "Duvar grubu", addLabel: "Duvar grubu ekle", repeat: ["totalWallWidth", "wallHeight"] },
  "duvar-paneli": { label: "Duvar", addLabel: "Duvar ekle", repeat: ["wallWidth", "wallHeight"] },
  beton: { label: "Bölüm", addLabel: "Beton bölümü ekle", repeat: ["length", "width", "thickness"] },
  tugla: { label: "Duvar", addLabel: "Duvar ekle", repeat: ["wallWidth", "wallHeight", "openingArea"] },
  supurgelik: { label: "Oda", addLabel: "Oda ekle", repeat: ["length", "width", "doorWidth"] },
  perde: { label: "Pencere", addLabel: "Pencere ekle", repeat: ["railWidth", "panelCount"] },
  elektrik: { label: "Cihaz", addLabel: "Cihaz ekle", repeat: ["watts", "count", "hoursPerDay", "daysPerMonth"] },
};

const toolTips = {
  boya: ["Duvarları metre cinsinden ölçün.", "Kapı ve pencerelerin toplam alanını yaklaşık girebilirsiniz.", "Yeni sıva, rutubet ve koyu renk geçişini açıklamada belirtin.", "Tavan boyanmayacaksa işareti kaldırın.", "Aynı boya kullanılacak odaları tek projede toplayın.", "Son kat rengini küçük bir alanda denemek faydalıdır."],
  parke: ["Paket m² bilgisini ürün ambalajından alın.", "Düz ve çapraz döşemeyi doğru seçin.", "Sabit dolap altında parke olmayacaksa o alanı ölçüden çıkarın.", "Tüm paketlerde aynı üretim serisini tercih edin.", "Artan birkaç parçayı ilerideki onarımlar için saklayın.", "Çok girintili odalarda uygulayıcıyla miktarı doğrulayın."],
  seramik: ["Kutu üzerindeki toplam m² bilgisini esas alın.", "Duvar ve zemini ayrı alanlar olarak ekleyin.", "Kapı, pencere veya kaplanmayacak büyük bölümleri boşluk alanına yazın.", "Ton ve kalibre kodları aynı kutuları seçin.", "Desenli veya çapraz döşemeyi doğru seçin.", "Niş, kolon ve girintileri ayrı alan olarak ekleyebilirsiniz.", "Islak hacimlerde kaymazlık sınıfını kullanım yerine göre seçin.", "Yedek birkaç seramiği ilerideki onarımlar için saklayın."],
  "duvar-kagidi": ["Aynı yükseklikteki duvarların genişliklerini toplayabilirsiniz.", "Desen tekrarını rulo etiketinden alın.", "Kapı ve pencereleri çoğu küçük uygulamada düşmemek güvenlidir.", "Farklı parti rulolarda renk tonu değişebilir.", "İlk ve son şeritlerde ek kesim gerekebilir.", "Duvarın en yüksek noktasını ölçün."],
  "duvar-paneli": ["Nominal değil gerçek kaplama ölçüsünü kullanın.", "Her duvarı ayrı eklemek köşe kesimlerini daha doğru gösterir.", "Priz ve anahtar yerlerini önceden işaretleyin.", "Köşe profillerini ayrıca planlayın.", "Panelleri montajdan önce ortamda dinlendirin.", "Kesim yönünü ürün desenine göre belirleyin."],
  beton: ["Kalınlığı santimetre olarak girin.", "Farklı kalınlıktaki bölümleri ayrı ekleyin.", "Zemindeki kot farklarını ölçün.", "Torba verimini ambalajdan doğrulayın.", "Taşıyıcı işlerde mühendis görüşü alın.", "Pompa ve taşıma kayıplarını tedarikçiyle konuşun."],
  tugla: ["Her duvarı ayrı ölçmek hata riskini azaltır.", "Kapı ve pencere boşluklarını çıkarın.", "Ürünün duvar yüzünde görünen ölçülerini kullanın.", "Derz kalınlığını uygulama sistemine göre seçin.", "Kırılma için yedek ürün bulundurun.", "Harç veya yapıştırıcı ihtiyacını ayrıca planlayın."],
  supurgelik: ["Her odayı ayrı ekleyin.", "Süpürgelik gelmeyecek kapı genişliklerini çıkarın.", "Ürünün gerçek boyunu ambalajdan alın.", "Çok köşeli odalarda kesim artar.", "Köşe ve bitiş aksesuarlarını ayrıca sayın.", "Parke ile uyumlu seriyi önceden kontrol edin."],
  perde: ["Kornişi duvardan duvara değil, gerçek ray boyunca ölçün.", "Her pencereyi ayrı ekleyin.", "Pile oranı arttıkça kumaş ihtiyacı artar.", "Desen tekrarlı kumaşlarda ek pay gerekebilir.", "Kumaş yüksekliğinin pencereye yettiğini kontrol edin.", "Kesimden önce ölçüyü terzinizle doğrulayın."],
  elektrik: ["Her farklı cihazı ayrı ekleyin.", "Watt değerini cihaz etiketinden alın.", "Termostatlı cihazların sürekli tam güç çekmediğini unutmayın.", "Bekleme tüketimi gerçek sonucu artırabilir.", "Güncel birim fiyatı faturanızdan alın.", "Kademeli tarife ve vergiler faturayı değiştirebilir."],
};

export function parseLocaleNumber(value) {
  if (typeof value === "number") return Number.isFinite(value) ? value : Number.NaN;

  let normalized = String(value ?? "").trim().replace(/\s/g, "");
  if (!normalized) return Number.NaN;

  if (normalized.includes(",") && normalized.includes(".")) {
    if (normalized.lastIndexOf(",") > normalized.lastIndexOf(".")) {
      normalized = normalized.replaceAll(".", "").replace(",", ".");
    } else {
      normalized = normalized.replaceAll(",", "");
    }
  } else {
    normalized = normalized.replace(",", ".");
  }

  const number = Number(normalized);
  return Number.isFinite(number) ? number : Number.NaN;
}

function positive(value) {
  const number = parseLocaleNumber(value);
  return Number.isFinite(number) ? number : 0;
}

function withWaste(value, waste) {
  return value * (1 + positive(waste) / 100);
}

function rounded(value, digits = 2) {
  const factor = 10 ** digits;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

function estimatedCost(total, unitPrice) {
  return positive(unitPrice) > 0 ? `${trNumber.format(rounded(total, 2))} TL` : "Fiyat girilmedi";
}

export function calculatePaint(input) {
  const coverage = 10;
  const waste = 10;
  const primerCoverage = 10;
  const recommendation = recommendPaintCoats(input.currentCondition, input.desiredCondition);
  const wallCoats = recommendation.coats;
  const ceilingCoats = input.paintCeiling === false ? 0 : 2;
  const grossArea = 2 * (positive(input.length) + positive(input.width)) * positive(input.height);
  const netArea = Math.max(0, grossArea - positive(input.doorArea) - positive(input.windowArea));
  const ceilingArea = positive(input.length) * positive(input.width);
  const coatedWallArea = netArea * wallCoats;
  const coatedCeilingArea = ceilingArea * ceilingCoats;
  const wallLiters = withWaste(coatedWallArea / coverage, waste);
  const ceilingLiters = withWaste(coatedCeilingArea / coverage, waste);
  const totalLiters = wallLiters + ceilingLiters;
  const primerLiters = recommendation.primerRequired || recommendation.primerRecommended
    ? withWaste(netArea / primerCoverage, waste)
    : 0;
  const primerAmount = recommendation.moistureProblem
    ? "Sorun giderilmeden hesaplanmadı"
    : primerLiters > 0
      ? `${trNumber.format(rounded(primerLiters, 1))} L`
      : "Gerekli görünmüyor";
  const ceilingStatus = ceilingCoats > 0 ? `${ceilingCoats} kat` : "Boyanmayacak";
  const ceilingAmount = ceilingCoats > 0 ? `${trNumber.format(rounded(ceilingLiters, 1))} L` : "0 L";
  const ceilingAdvice = ceilingCoats > 0
    ? `Tavan için standart ${ceilingStatus} uygulama ve yaklaşık ${ceilingAmount} tavan boyası hesaplandı.`
    : "Tavanı boyamayacağınızı belirttiğiniz için tavan boyası ihtiyaca eklenmedi.";
  const primerAdvice = recommendation.moistureProblem
    ? "Aktif nem veya kabarma ihtimali nedeniyle astar miktarı vermedik; önce sorunun kaynağını giderin. Astar tek başına rutubet sorununu çözmez."
    : primerLiters > 0
      ? `${recommendation.primerLabel}; duvar için yaklaşık ${primerAmount} astar öngörüldü.`
      : "Tarifinizde astar gerektiren belirgin bir durum algılanmadı; uygulama öncesinde yüzeyin sağlam, temiz ve kuru olduğunu kontrol edin.";

  const output = result(
    `${trNumber.format(rounded(totalLiters, 1))} litre toplam boya`,
    ceilingCoats > 0 ? "Duvar ve tavan için yaklaşık ihtiyaç" : "Duvar için yaklaşık ihtiyaç",
    [
      ["Net Duvar Alanı", `${trNumber.format(rounded(netArea))} m²`],
      ["Duvar Boyası Kaç Kat Uygulanmalı", `${wallCoats} kat`],
      ["Duvar İçin Önerilen Boya Miktarı", `${trNumber.format(rounded(wallLiters, 1))} L`],
      ["Duvar İçin Astar Önerisi", recommendation.primerLabel],
      ["Duvar İçin Önerilen Astar Miktarı", primerAmount],
      ["Net Tavan Alanı", `${trNumber.format(rounded(ceilingArea))} m²`],
      ["Tavan Boyası Kaç Kat Uygulanmalı", ceilingStatus],
      ["Tavan İçin Önerilen Boya Miktarı", ceilingAmount],
    ],
    `${recommendation.warning} ${recommendation.reason} Duvar için ${wallCoats} kat ve yaklaşık ${trNumber.format(rounded(wallLiters, 1))} litre boya hesapladık. ${primerAdvice} ${ceilingAdvice} İstediğiniz renk tonunu mağazada markanın kartelasından seçip hazırlatabilir, ürünün ambalaj seçeneklerine göre miktarı yukarı tamamlayabilirsiniz.`.trim()
  );
  output.noteTitle = "Ne Kadar Lazım’ın önerisi";
  output.readyState = {
    title: "Hesabınız hazır",
    subtitle: "Duvar, astar ve tavan ihtiyacınız aşağıda.",
  };
  output.interpretation = recommendation.interpretation;
  return output;
}

function normalizedDescription(value) {
  return String(value ?? "")
    .toLocaleLowerCase("tr-TR")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replaceAll("ı", "i")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

export function recommendPaintCoats(currentCondition, desiredCondition) {
  const current = normalizedDescription(currentCondition);
  const desired = normalizedDescription(desiredCondition);
  const combined = `${current} ${desired}`;
  const mentions = (text, words) => words.some((word) => ` ${text} `.includes(` ${word} `));

  const currentIsDark = mentions(current, ["koyu", "siyah", "lacivert", "bordo", "kirmizi", "kahverengi", "antrasit"]);
  const desiredIsLight = mentions(desired, ["acik", "beyaz", "krem", "bej", "fildisi", "kirik beyaz"]);
  const stainedSurface = mentions(combined, ["lekeli", "leke", "nikotin", "isli", "is", "yagli", "yag lekesi"]);
  const unevenSurface = mentions(combined, ["yamali", "yama", "macunlu", "farkli emicilik", "catlak", "catlakli"]);
  const rawSurface = mentions(combined, ["yeni siva", "ham siva", "yeni alci", "ham alci", "alcili", "ham yuzey", "ciplak yuzey", "cok emici", "yeni beton"]);
  const moistureProblem = mentions(combined, ["rutubet", "rutubetli", "nem", "nemli", "islak", "su aliyor", "kabarma", "kabarmis", "dokulme", "dokuluyor"]);
  const colorTransition = currentIsDark && desiredIsLight;

  if (moistureProblem) {
    return {
      coats: 2,
      reason: "Aktif nem, rutubet veya kabarma olasılığı tarif edildi.",
      primerRequired: false,
      primerRecommended: false,
      primerLabel: "Şimdilik belirlenemez",
      primerNote: "Astar tek başına rutubet sorununu çözmez.",
      moistureProblem: true,
      warning: "Yüzeydeki nem veya su kaynağını giderip gevşek katmanları temizlemeden boyaya başlamayın.",
      interpretation: "Yüzeyde aktif nem, rutubet veya kabarma olabileceğini anladık; önce sorunun kaynağı giderilmeli.",
    };
  }

  if (stainedSurface) {
    return {
      coats: 3,
      reason: "Lekeli, isli veya nikotinli bir yüzey tarif edildi.",
      primerRequired: true,
      primerRecommended: false,
      primerLabel: "Leke önleyici astar gerekli",
      primerNote: "Ürünü lekenin türüne uygun seçin.",
      moistureProblem: false,
      warning: "",
      interpretation: `Yüzeyin lekeli, isli veya nikotinli olduğunu anladık${colorTransition ? "; ayrıca koyu renkten açık renge geçilecek" : ""}.`,
    };
  }

  if (rawSurface) {
    return {
      coats: 2,
      reason: "Yeni veya emici yüzey için astar sonrası iki kat boya önerildi.",
      primerRequired: true,
      primerRecommended: false,
      primerLabel: "Emicilik düzenleyici astar gerekli",
      primerNote: "Boyadan önce yüzeye uygun tek kat astar uygulayın.",
      moistureProblem: false,
      warning: "",
      interpretation: "Yüzeyin yeni sıva, alçı veya çok emici olduğunu anladık; astar sonrası 2 kat boya uygun görünüyor.",
    };
  }

  if (colorTransition || unevenSurface) {
    return {
      coats: colorTransition ? 3 : 2,
      reason: colorTransition ? "Koyu renkten açık renge geçiş tarif edildi." : "Yamalı veya farklı emicilikte bir yüzey tarif edildi.",
      primerRequired: false,
      primerRecommended: true,
      primerLabel: colorTransition ? "Geçiş astarı önerilir" : "Yüzey astarı önerilir",
      primerNote: "Astar, son kat rengin daha dengeli görünmesine yardımcı olabilir.",
      moistureProblem: false,
      warning: "",
      interpretation: colorTransition
        ? "Mevcut rengin koyu, istenen rengin açık olduğunu anladık; geçiş astarı ve 3 kat boya öneriyoruz."
        : "Yüzeyin yamalı, çatlaklı veya farklı emicilikte olduğunu anladık; yüzey astarı öneriyoruz.",
    };
  }

  return {
    coats: 2,
    reason: current || desired ? "Tarif edilen standart yenileme için iki kat önerildi." : "Yüzey tarifi girilmediği için standart iki kat esas alındı.",
    primerRequired: false,
    primerRecommended: false,
    primerLabel: "Gerekli görünmüyor",
    primerNote: "Yüzeyin sağlam, temiz ve kuru olduğunu uygulama öncesinde kontrol edin.",
    moistureProblem: false,
    warning: "",
    interpretation: current || desired
      ? "Belirgin bir yüzey sorunu veya zorlu renk geçişi algılamadık; standart 2 kat boya hesaplıyoruz."
      : "Henüz yüzey tarifi girilmedi; standart, sağlam ve kuru bir yüzey kabul ediyoruz.",
  };
}

export function calculateParquet(input) {
  const area = positive(input.length) * positive(input.width);
  const waste = positive(input.layoutWaste) === 15 ? 15 : 10;
  const layoutLabel = waste === 15 ? "Çapraz döşeme" : "Düz döşeme";
  const requiredArea = withWaste(area, waste);
  const packs = Math.ceil(requiredArea / Math.max(0.01, positive(input.packArea)));

  return completedResult(
    `${trNumber.format(packs)} paket parke`,
    [
      ["Net Zemin Alanı", `${trNumber.format(rounded(area))} m²`],
      ["Seçilen Döşeme Biçimi", layoutLabel],
      ["Fire Dahil Parke İhtiyacı", `${trNumber.format(rounded(requiredArea))} m²`],
      ["Önerilen Paket Sayısı", `${trNumber.format(packs)} paket`],
      ["Paketlerin Toplam Alanı", `${trNumber.format(rounded(packs * positive(input.packArea)))} m²`],
    ],
    `${layoutLabel} seçiminize uygun %${trNumber.format(waste)} kesim payı sistem tarafından eklendi ve ${trNumber.format(packs)} paket parke hesaplandı. Paket alanını satın alacağınız ürünün ambalajından doğrulayın; oda çok köşeliyse uygulayıcınıza danışın.`,
    "Zemin ve paket ihtiyacınız aşağıda."
  );
}

export function calculateTile(input) {
  const applicationLabel = positive(input.applicationType) === 2 ? "Duvar" : "Zemin";
  const layoutValue = positive(input.layoutStyle);
  const waste = layoutValue >= 15 ? 15 : 10;
  const layoutLabel = layoutValue === 15 ? "Çapraz döşeme" : layoutValue === 16 ? "Desenli / yönlü döşeme" : "Düz döşeme";
  const grossArea = positive(input.length) * positive(input.width);
  const excludedArea = Math.min(grossArea, positive(input.excludedArea));
  const area = Math.max(0, grossArea - excludedArea);
  const requiredArea = withWaste(area, waste);
  const statedBoxArea = positive(input.boxArea);
  const boxArea = statedBoxArea > 0 ? statedBoxArea : 1.44;
  const boxes = Math.ceil(requiredArea / Math.max(0.0001, boxArea));

  return completedResult(
    `${trNumber.format(boxes)} kutu seramik`,
    [
      ["Uygulama Yeri", applicationLabel],
      ["Net Uygulama Alanı", `${trNumber.format(rounded(area))} m²`],
      ["Seçilen Döşeme Biçimi", layoutLabel],
      ["Uygulama Payı Dahil İhtiyaç", `${trNumber.format(rounded(requiredArea))} m²`],
      ["Bir Kutunun Kapladığı Alan", `${trNumber.format(rounded(boxArea))} m²`],
      ["Önerilen Kutu Sayısı", `${trNumber.format(boxes)} kutu`],
      ["Satın Alınan Toplam Alan", `${trNumber.format(rounded(boxes * boxArea))} m²`],
    ],
    statedBoxArea > 0
      ? `${applicationLabel} için ${layoutLabel.toLocaleLowerCase("tr-TR")} seçiminize göre sistem %${trNumber.format(waste)} uygulama payı ekledi ve ambalajdaki kutu m² bilgisiyle ${trNumber.format(boxes)} kutu hesapladı. Kutuların ton ve kalibre kodlarını eşleştirin.`
      : `Kutu alanı girilmediği için standart 1,44 m² paket kabul edildi. Satın almadan önce ambalajdaki toplam m² bilgisini doğrulayın.`,
    "Alan ve kutu ihtiyacınız aşağıda."
  );
}

export function calculateWallpaper(input) {
  const rollWidthM = positive(input.rollWidth) / 100;
  const repeatM = positive(input.patternRepeat) / 100;
  const trimM = 0.1;
  const rawStrip = positive(input.wallHeight) + trimM;
  const stripLength = repeatM > 0 ? Math.ceil(rawStrip / repeatM) * repeatM : rawStrip;
  const stripsNeeded = Math.ceil(positive(input.totalWallWidth) / Math.max(0.01, rollWidthM));
  const stripsPerRoll = Math.floor(positive(input.rollLength) / Math.max(0.01, stripLength));

  if (stripsPerRoll < 1) {
    return completedResult(
      "Rulo uzunluğu yetersiz",
      [
        ["Gerekli Şerit Boyu", `${trNumber.format(rounded(stripLength))} m`],
        ["Girilen Rulo Uzunluğu", `${trNumber.format(rounded(positive(input.rollLength)))} m`],
      ],
      "Bir tam şerit girdiğiniz rulodan çıkmıyor. Daha uzun bir rulo seçin veya duvar ve rulo ölçülerini yeniden kontrol edin.",
      "Ölçülerinizi kontrol edin."
    );
  }
  const rolls = Math.ceil(stripsNeeded / stripsPerRoll);

  return completedResult(
    `${trNumber.format(rolls)} rulo duvar kâğıdı`,
    [
      ["Gerekli Şerit Sayısı", `${trNumber.format(stripsNeeded)} adet`],
      ["Bir Şeridin Kesim Boyu", `${trNumber.format(rounded(stripLength))} m`],
      ["Bir Rulodan Çıkan Şerit", `${trNumber.format(stripsPerRoll)} adet`],
      ["Önerilen Rulo Sayısı", `${trNumber.format(rolls)} rulo`],
    ],
    `Duvar yüksekliği, kesim payı ve desen tekrarına göre bir rulodan ${trNumber.format(stripsPerRoll)} tam şerit çıkıyor. Toplam ${trNumber.format(rolls)} rulo öneriyoruz; desen eşleştirme ve duvar girintileri ihtiyacı artırabilir.`,
    "Şerit ve rulo ihtiyacınız aşağıda."
  );
}

export function calculateWallPanel(input) {
  const waste = 5;
  const columns = Math.ceil(positive(input.wallWidth) / Math.max(0.01, positive(input.panelWidth) / 100));
  const rows = Math.ceil(positive(input.wallHeight) / Math.max(0.01, positive(input.panelHeight) / 100));
  const basePieces = columns * rows;
  const pieces = Math.ceil(withWaste(basePieces, waste));
  const wallArea = positive(input.wallWidth) * positive(input.wallHeight);

  return completedResult(
    `${trNumber.format(pieces)} adet panel`,
    [
      ["Net Duvar Alanı", `${trNumber.format(rounded(wallArea))} m²`],
      ["Yatayda Gereken Panel", `${trNumber.format(columns)} adet`],
      ["Dikeyde Gereken Sıra", `${trNumber.format(rows)} sıra`],
      ["Fire Dahil Önerilen Panel", `${trNumber.format(pieces)} adet`],
    ],
    `Panellerin dikey yerleşimine ve sistemin eklediği standart %${trNumber.format(waste)} yedek payına göre ${trNumber.format(pieces)} adet panel öneriyoruz. Geçme payları, prizler ve köşe kesimleri için ürünün gerçek kaplama ölçüsünü doğrulayın.`,
    "Duvar ve panel ihtiyacınız aşağıda."
  );
}

export function calculateConcrete(input) {
  const waste = 8;
  const netVolume = positive(input.length) * positive(input.width) * (positive(input.thickness) / 100);
  const orderVolume = withWaste(netVolume, waste);
  const bags = Math.ceil((orderVolume * 1000) / Math.max(0.1, positive(input.bagYield)));

  return completedResult(
    `${trNumber.format(rounded(orderVolume, 2))} m³ beton`,
    [
      ["Net Beton Hacmi", `${trNumber.format(rounded(netVolume, 2))} m³`],
      ["Fire Dahil Önerilen Beton", `${trNumber.format(rounded(orderVolume, 2))} m³`],
      ["Litre Karşılığı", `${trNumber.format(Math.ceil(orderVolume * 1000))} L`],
      ["Hazır Karışım Torbası", `${trNumber.format(bags)} adet`],
    ],
    `Ölçülerinize sistem tarafından standart %${trNumber.format(waste)} uygulama payı eklenerek yaklaşık ${trNumber.format(rounded(orderVolume, 2))} m³ beton hesaplandı. Torba hesabı girdiğiniz ürün verimine dayanır; taşıyıcı uygulamalarda beton sınıfı, donatı ve miktar için mutlaka uzman görüşü alın.`,
    "Hacim ve yaklaşık malzeme ihtiyacınız aşağıda."
  );
}

export function calculateBrick(input) {
  const waste = 8;
  const grossArea = positive(input.wallWidth) * positive(input.wallHeight);
  const netArea = Math.max(0, grossArea - positive(input.openingArea));
  const jointM = 0.01;
  const moduleArea = (positive(input.blockWidth) / 100 + jointM) * (positive(input.blockHeight) / 100 + jointM);
  const basePieces = netArea / Math.max(0.0001, moduleArea);
  const pieces = Math.ceil(withWaste(basePieces, waste));

  return completedResult(
    `${trNumber.format(pieces)} adet tuğla/blok`,
    [
      ["Brüt Duvar Alanı", `${trNumber.format(rounded(grossArea))} m²`],
      ["Net Örülecek Alan", `${trNumber.format(rounded(netArea))} m²`],
      ["Metrekare Başına Ürün", `${trNumber.format(rounded(1 / Math.max(0.0001, moduleArea), 1))} adet`],
      ["Fire Dahil Önerilen Adet", `${trNumber.format(pieces)} adet`],
    ],
    `Kapı ve pencere alanları çıkarıldı; standart 10 mm derz ve %${trNumber.format(waste)} kırılma payı sistem tarafından uygulandı. Yaklaşık ${trNumber.format(pieces)} adet ürün gerekir; özel uygulamalarda ürün ölçüsü ve derzi üretici tavsiyesine göre doğrulayın.`,
    "Duvar alanı ve ürün ihtiyacınız aşağıda."
  );
}

export function calculateSkirting(input) {
  const waste = 10;
  const perimeter = 2 * (positive(input.length) + positive(input.width));
  const netLength = Math.max(0, perimeter - positive(input.doorWidth));
  const requiredLength = withWaste(netLength, waste);
  const pieces = Math.ceil(requiredLength / Math.max(0.01, positive(input.pieceLength)));

  return completedResult(
    `${trNumber.format(pieces)} boy süpürgelik`,
    [
      ["Oda Çevresi", `${trNumber.format(rounded(perimeter))} m`],
      ["Kapılar Sonrası Net Uzunluk", `${trNumber.format(rounded(netLength))} m`],
      ["Fire Dahil Süpürgelik İhtiyacı", `${trNumber.format(rounded(requiredLength))} m`],
      ["Önerilen Ürün Boyu", `${trNumber.format(pieces)} boy`],
      ["Satın Alınan Toplam Uzunluk", `${trNumber.format(rounded(pieces * positive(input.pieceLength)))} m`],
    ],
    `Kapı açıklıkları çıkarılıp sistem tarafından standart %${trNumber.format(waste)} kesim payı eklendi. ${trNumber.format(pieces)} boy süpürgelik öneriyoruz; köşe sayısı arttıkça kesim kaybı da artabilir.`,
    "Çevre ve süpürgelik ihtiyacınız aşağıda."
  );
}

export function calculateCurtain(input) {
  const sideHem = 20;
  const finishedWidth = positive(input.railWidth) * positive(input.fullness);
  const hemAllowance = (sideHem / 100) * Math.max(1, positive(input.panelCount));
  const fabricMeters = finishedWidth + hemAllowance;

  return completedResult(
    `${trNumber.format(rounded(fabricMeters, 1))} metre kumaş`,
    [
      ["Korniş veya Ray Genişliği", `${trNumber.format(rounded(positive(input.railWidth), 1))} m`],
      ["Seçilen Pile Oranı", `${trNumber.format(positive(input.fullness))} kat`],
      ["Pileli Kumaş Genişliği", `${trNumber.format(rounded(finishedWidth, 1))} m`],
      ["Yan Kıvırma Payı", `${trNumber.format(rounded(hemAllowance, 1))} m`],
      ["Önerilen Kumaş Miktarı", `${trNumber.format(rounded(fabricMeters, 1))} m`],
    ],
    `Seçtiğiniz ${trNumber.format(positive(input.fullness))} kat pile ve yan kıvırma payıyla yaklaşık ${trNumber.format(rounded(fabricMeters, 1))} metre boydan kumaş gerekir. Kumaş yüksekliği, desen tekrarı ve alt-üst kıvırma payını terzinizle doğrulayın.`,
    "Pile ve kumaş ihtiyacınız aşağıda."
  );
}

export function calculateElectricity(input) {
  const monthlyKwh = (positive(input.watts) * positive(input.count) * positive(input.hoursPerDay) * positive(input.daysPerMonth)) / 1000;
  const monthlyCost = monthlyKwh * positive(input.pricePerKwh);
  const annualCost = monthlyCost * 12;
  const annualKwh = monthlyKwh * 12;

  const hasPrice = positive(input.pricePerKwh) > 0;

  return completedResult(
    hasPrice
      ? `${trNumber.format(rounded(monthlyCost, 2))} TL / ay`
      : `${trNumber.format(rounded(monthlyKwh, 2))} kWh / ay`,
    [
      ["Günlük Tüketim", `${trNumber.format(rounded(monthlyKwh / Math.max(1, positive(input.daysPerMonth)), 2))} kWh`],
      ["Aylık Tüketim", `${trNumber.format(rounded(monthlyKwh, 2))} kWh`],
      ["Yıllık Tüketim", `${trNumber.format(rounded(annualKwh, 2))} kWh`],
      ["Aylık Maliyet", hasPrice ? `${trNumber.format(rounded(monthlyCost, 2))} TL` : "Birim fiyat girilmedi"],
      ["Yıllık Maliyet", hasPrice ? `${trNumber.format(rounded(annualCost, 2))} TL` : "Birim fiyat girilmedi"],
    ],
    `Girdiğiniz güç ve kullanım süresine göre aylık yaklaşık ${trNumber.format(rounded(monthlyKwh, 2))} kWh tüketim hesapladık. ${hasPrice ? `Girdiğiniz birim fiyatla aylık maliyet yaklaşık ${trNumber.format(rounded(monthlyCost, 2))} TL olur.` : "Maliyet görmek için faturanızdaki güncel kWh birim fiyatını girebilirsiniz."} Termostat, bekleme tüketimi, tarife kademeleri ve vergiler gerçek faturayı değiştirebilir.`,
    "Tüketim ve maliyet tahmininiz aşağıda."
  );
}

function completedResult(headline, items, note, subtitle = "Önerilen miktarlar aşağıda.") {
  const output = result(headline, "Hesaplama tamamlandı", items, note);
  output.noteTitle = "Ne Kadar Lazım’ın önerisi";
  output.readyState = { title: "Hesabınız hazır", subtitle };
  return output;
}

function result(headline, eyebrow, items, note) {
  return { headline, eyebrow, items, note };
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderField(field, prefix = "") {
  const id = `field-${prefix}${field.key}`;
  const unit = field.unit ? `<span class="field-unit">${escapeHtml(field.unit)}</span>` : "";

  if (field.type === "select") {
    const options = field.options
      .map((option) => `<option value="${escapeHtml(option.value)}" ${Number(option.value) === Number(field.value) ? "selected" : ""}>${escapeHtml(option.label)}</option>`)
      .join("");
    return `<label class="field" for="${id}"><span>${escapeHtml(field.label)}</span><select id="${id}" name="${escapeHtml(field.key)}">${options}</select></label>`;
  }

  if (field.type === "textarea") {
    return `<label class="field description-field" for="${id}"><span>${escapeHtml(field.label)}</span><textarea id="${id}" name="${escapeHtml(field.key)}" rows="3" maxlength="500" placeholder="${escapeHtml(field.placeholder || "")}" autocomplete="off">${escapeHtml(field.value || "")}</textarea></label>`;
  }

  if (field.type === "checkbox") {
    return `<label class="field checkbox-field" for="${id}"><span>${escapeHtml(field.label)}</span><input id="${id}" name="${escapeHtml(field.key)}" type="checkbox" ${field.value ? "checked" : ""}></label>`;
  }

  const displayValue = String(field.value).replace(".", ",");
  return `<label class="field" for="${id}">
    <span>${escapeHtml(field.label)}</span>
    <span class="input-wrap">
      <input id="${id}" name="${escapeHtml(field.key)}" type="text" value="${escapeHtml(displayValue)}" inputmode="decimal" autocomplete="off" spellcheck="false" required>
      ${unit}
    </span>
  </label>`;
}

function renderResult(calculation) {
  const heading = calculation.readyState
    ? `<div class="result-ready"><span class="result-ready-icon" aria-hidden="true">✓</span><div><strong>${escapeHtml(calculation.readyState.title)}</strong><span>${escapeHtml(calculation.readyState.subtitle)}</span></div></div>`
    : `<div class="result-heading"><span>${escapeHtml(calculation.eyebrow)}</span><strong>${escapeHtml(calculation.headline)}</strong></div>`;

  const childResults = calculation.children
    ? `<div class="multi-results">${calculation.children.map(({ name, calculation: child }) => `<section class="multi-result"><h3>${escapeHtml(name)}</h3>${renderResult({ ...child, children: undefined, hideActions: true })}</section>`).join("")}</div>`
    : "";
  const actions = calculation.hideActions ? "" : `<div class="result-actions">
      <button class="result-action add-result" type="button">+ Listeme ekle</button>
      <button class="result-action share-result" type="button">Paylaş / kopyala</button>
    </div>`;

  return `${heading}
    <dl class="result-list">
      ${calculation.items.map(([label, value]) => `<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd></div>`).join("")}
    </dl>
    <div class="result-advice">
      ${calculation.noteTitle ? `<strong>${escapeHtml(calculation.noteTitle)}</strong>` : ""}
      <p class="result-note">${escapeHtml(calculation.note)}</p>
    </div>
    ${childResults}
    ${actions}`;
}

function calculationText(tool, calculation, projectName) {
  const title = projectName ? `${projectName} · ${tool.title}` : tool.title;
  return `${title}\n${calculation.headline}\n${calculation.items.map(([label, value]) => `${label}: ${value}`).join("\n")}\n\n${calculation.note}`;
}

function readFields(fields, scope) {
  let firstError = "";
  const values = {};

  fields.forEach((field) => {
    const input = scope.querySelector(`[name="${field.key}"]`);
    if (field.type === "checkbox") {
      values[field.key] = Boolean(input?.checked);
      return;
    }
    if (field.type === "textarea") {
      values[field.key] = input?.value.trim() || "";
      return;
    }
    const value = parseLocaleNumber(input?.value);
    let error = "";

    if (!Number.isFinite(value)) error = `${field.label} için geçerli bir sayı girin.`;
    else if (field.min !== undefined && value < field.min) error = `${field.label} en az ${String(field.min).replace(".", ",")} olmalı.`;
    else if (field.max !== undefined && value > field.max) error = `${field.label} en fazla ${String(field.max).replace(".", ",")} olmalı.`;

    input?.setAttribute("aria-invalid", String(Boolean(error)));
    input?.closest(".field")?.classList.toggle("is-invalid", Boolean(error));
    if (error && !firstError) firstError = error;
    values[field.key] = value;
  });

  return { values, error: firstError };
}

export function combineMultiResults(toolId, tool, entries) {
  const calculations = entries.map((entry) => ({ name: entry.name, calculation: tool.calculate(entry.values) }));
  if (calculations.length === 1) return calculations[0].calculation;

  if (toolId === "parke" && entries.every((entry) => entry.values.sameProduct !== false)) {
    const totalNetArea = entries.reduce((sum, entry) => sum + positive(entry.values.length) * positive(entry.values.width), 0);
    const totalRequiredArea = entries.reduce((sum, entry) => {
      const area = positive(entry.values.length) * positive(entry.values.width);
      const waste = positive(entry.values.layoutWaste) === 15 ? 15 : 10;
      return sum + withWaste(area, waste);
    }, 0);
    const packArea = Math.max(0.01, positive(entries[0].values.packArea));
    const packs = Math.ceil(totalRequiredArea / packArea);

    return {
      headline: `${trNumber.format(packs)} paket parke`,
      eyebrow: "Birleştirilmiş paket hesabı",
      items: [
        ["Hesaplanan Oda Sayısı", `${entries.length} adet`],
        ["Toplam Net Zemin Alanı", `${trNumber.format(rounded(totalNetArea))} m²`],
        ["Uygulama Payı Dahil İhtiyaç", `${trNumber.format(rounded(totalRequiredArea))} m²`],
        ["Önerilen Toplam Paket", `${trNumber.format(packs)} paket`],
        ["Paketlerin Toplam Alanı", `${trNumber.format(rounded(packs * packArea))} m²`],
      ],
      note: "Tüm odalarda aynı parke kullanılacağı için artan parçaların diğer odalarda değerlendirilebileceği kabul edildi. Oda alanları kendi düz veya çapraz döşeme paylarıyla birleştirildi ve paket sayısı yalnızca bir kez yukarı yuvarlandı.",
      noteTitle: "Ne Kadar Lazım’ın önerisi",
      readyState: { title: "Toplu hesabınız hazır", subtitle: "Aynı parke için birleştirilmiş paket ihtiyacı aşağıda." },
      children: calculations,
    };
  }

  if (toolId === "seramik" && entries.every((entry) => entry.values.sameProduct !== false)) {
    const totals = entries.reduce((sum, entry) => {
      const grossArea = positive(entry.values.length) * positive(entry.values.width);
      const netArea = Math.max(0, grossArea - Math.min(grossArea, positive(entry.values.excludedArea)));
      const waste = positive(entry.values.layoutStyle) >= 15 ? 15 : 10;
      sum.net += netArea;
      sum.required += withWaste(netArea, waste);
      return sum;
    }, { net: 0, required: 0 });
    const boxArea = Math.max(0.01, positive(entries[0].values.boxArea));
    const boxes = Math.ceil(totals.required / boxArea);

    return {
      headline: `${trNumber.format(boxes)} kutu seramik`,
      eyebrow: "Birleştirilmiş kutu hesabı",
      items: [
        ["Hesaplanan Alan Sayısı", `${entries.length} adet`],
        ["Toplam Net Uygulama Alanı", `${trNumber.format(rounded(totals.net))} m²`],
        ["Uygulama Payı Dahil İhtiyaç", `${trNumber.format(rounded(totals.required))} m²`],
        ["Önerilen Toplam Kutu", `${trNumber.format(boxes)} kutu`],
        ["Kutuların Toplam Alanı", `${trNumber.format(rounded(boxes * boxArea))} m²`],
      ],
      note: "Tüm alanlarda aynı seramik kullanılacağı için kesimden artan parçaların diğer alanlarda değerlendirilebileceği kabul edildi. Her alanın döşeme biçimine uygun payı ayrı hesaplandı, ihtiyaçlar birleştirildi ve kutu sayısı yalnızca bir kez yukarı yuvarlandı. Satın alırken tüm kutuların ton ve kalibre kodlarının aynı olmasına dikkat edin.",
      noteTitle: "Ne Kadar Lazım’ın önerisi",
      readyState: { title: "Toplu hesabınız hazır", subtitle: "Aynı seramik için birleştirilmiş kutu ihtiyacı aşağıda." },
      children: calculations,
    };
  }

  const headlineParts = calculations.map(({ calculation }) => calculation.headline.match(/^([\d.,]+)\s+(.+)$/)).filter(Boolean);
  let headline = `${calculations.length} bölüm hesaplandı`;
  if (headlineParts.length === calculations.length && headlineParts.every((part) => part[2] === headlineParts[0][2])) {
    const total = headlineParts.reduce((sum, part) => sum + positive(part[1]), 0);
    headline = `${trNumber.format(rounded(total, 2))} ${headlineParts[0][2]}`;
  }

  return {
    headline,
    eyebrow: "Toplu hesaplama",
    items: [["Hesaplanan Bölüm Sayısı", `${calculations.length} adet`]],
    note: `${calculations.length} bölüm ayrı ayrı hesaplandı. Aşağıdaki bölüm sonuçlarını kontrol edin; farklı ürün veya uygulama koşulları varsa miktarları ayrı değerlendirin.`,
    noteTitle: "Ne Kadar Lazım’ın önerisi",
    readyState: { title: "Toplu hesabınız hazır", subtitle: "Genel özet ve bölüm sonuçları aşağıda." },
    children: calculations,
  };
}

async function shareOrCopy(text) {
  if (navigator.share) {
    try {
      await navigator.share({ title: "Ne Kadar Lazım?", text });
      return "Paylaşıldı";
    } catch (error) {
      if (error?.name === "AbortError") return "Paylaş / kopyala";
    }
  }

  await navigator.clipboard.writeText(text);
  return "Kopyalandı";
}

function initCalculator(root) {
  const toolId = document.body.dataset.tool;
  const tool = tools[toolId];
  if (!tool) return;
  const multi = multiTools[toolId];
  const repeatFields = tool.fields.filter((field) => multi.repeat.includes(field.key));
  const sharedFields = tool.fields.filter((field) => !multi.repeat.includes(field.key));

  function renderEntry(index) {
    return `<section class="multi-entry" data-entry-index="${index}">
      <div class="multi-entry-heading"><h3>${escapeHtml(multi.label)} ${index + 1}</h3><button class="remove-entry" type="button" ${index === 0 ? "hidden" : ""} aria-label="Bu bölümü sil">Sil</button></div>
      <label class="field entry-name-field"><span>${escapeHtml(multi.label)} adı <small>(isteğe bağlı)</small></span><span class="input-wrap"><input name="entryName" type="text" maxlength="60" placeholder="Örn. ${escapeHtml(multi.label)} ${index + 1}" autocomplete="off"></span></label>
      <div class="form-grid entry-fields">${repeatFields.map((field) => renderField(field, `${index}-`)).join("")}</div>
      ${tool.showInterpretation ? `<p class="interpretation-preview" aria-live="polite"></p>` : ""}
    </section>`;
  }

  root.innerHTML = `<div class="calculator-title"><span class="calculator-badge">Ücretsiz araç</span><h2>${escapeHtml(tool.title)}</h2><p>${escapeHtml(tool.subtitle)}</p></div>
    <form class="calculator-form">
      <div class="form-grid">
        <label class="field project-field" for="field-project-name"><span>Alan / proje adı <small>(isteğe bağlı)</small></span><span class="input-wrap"><input id="field-project-name" name="projectName" type="text" maxlength="100" placeholder="Örn. Salon" autocomplete="off"></span></label>
        ${sharedFields.length ? `<div class="shared-fields form-grid">${sharedFields.map((field) => renderField(field, "shared-")).join("")}</div>` : ""}
        <div class="multi-entry-list">${renderEntry(0)}</div>
        <button class="add-entry" type="button">+ ${escapeHtml(multi.addLabel)}</button>
        ${tool.formGuidance ? `<div class="form-guidance"><strong>Doğru sonuç için</strong><ul>${tool.formGuidance.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></div>` : ""}
      </div>
      <button class="primary-button calculate-button" type="submit">${escapeHtml(tool.button)}</button>
      <p class="live-hint">Değerleri değiştirdikçe sonuç otomatik yenilenir.</p>
      <p class="form-message" role="alert" hidden></p>
    </form>
    <section class="calculator-result" aria-live="polite"></section>
    <section class="tool-tips"><h2>İşinizi kolaylaştıracak ipuçları</h2><ul>${toolTips[toolId].map((tip) => `<li>${escapeHtml(tip)}</li>`).join("")}</ul></section>`;

  const form = root.querySelector("form");
  const resultRoot = root.querySelector(".calculator-result");

  let liveTimer;

  function updateResult() {
    const sharedRead = readFields(sharedFields, form);
    let error = sharedRead.error;
    const entries = [...form.querySelectorAll(".multi-entry")].map((entry, index) => {
      const entryRead = readFields(repeatFields, entry);
      if (!error && entryRead.error) error = entryRead.error;
      const values = { ...sharedRead.values, ...entryRead.values };
      const singleCalculation = tool.calculate(values);
      const interpretation = entry.querySelector(".interpretation-preview");
      if (interpretation) interpretation.textContent = `Yazdığınızdan anladığımız: ${singleCalculation.interpretation}`;
      return {
        name: entry.querySelector('[name="entryName"]').value.trim() || `${multi.label} ${index + 1}`,
        values,
      };
    });
    const message = form.querySelector(".form-message");

    if (error) {
      message.textContent = error;
      message.hidden = false;
      resultRoot.innerHTML = `<p class="result-invalid">Sonucu yenilemek için işaretli alanı düzeltin.</p>`;
      return false;
    }

    message.hidden = true;
    const calculation = combineMultiResults(toolId, tool, entries);
    resultRoot.innerHTML = renderResult(calculation);
    const projectName = form.querySelector('[name="projectName"]').value.trim();
    const text = calculationText(tool, calculation, projectName);
    const shareButton = resultRoot.querySelector(".share-result");
    const addButton = resultRoot.querySelector(".add-result");

    shareButton.addEventListener("click", async () => {
      try {
        shareButton.textContent = await shareOrCopy(text);
        window.setTimeout(() => (shareButton.textContent = "Paylaş / kopyala"), 1800);
      } catch {
        shareButton.textContent = "Kopyalanamadı";
      }
    });

    addButton.addEventListener("click", () => {
      const items = addShoppingItem({
        toolId,
        title: tool.title,
        projectName,
        headline: calculation.headline,
        items: calculation.items,
        note: calculation.note,
        createdAt: new Date().toISOString(),
      });
      window.dispatchEvent(new CustomEvent("nkl:list-changed", { detail: { items } }));
      addButton.textContent = "✓ Listeye eklendi";
      window.setTimeout(() => (addButton.textContent = "+ Listeme ekle"), 1800);
    });

    return true;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    window.clearTimeout(liveTimer);
    if (updateResult()) resultRoot.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });

  form.addEventListener("input", (event) => {
    if (event.target.name === "projectName" || event.target.name === "entryName") return;
    window.clearTimeout(liveTimer);
    liveTimer = window.setTimeout(updateResult, 180);
  });

  form.querySelector(".add-entry").addEventListener("click", () => {
    const list = form.querySelector(".multi-entry-list");
    const index = list.children.length;
    list.insertAdjacentHTML("beforeend", renderEntry(index));
    updateResult();
  });

  form.addEventListener("click", (event) => {
    const removeButton = event.target.closest(".remove-entry");
    if (!removeButton) return;
    removeButton.closest(".multi-entry").remove();
    [...form.querySelectorAll(".multi-entry")].forEach((entry, index) => {
      entry.dataset.entryIndex = String(index);
      entry.querySelector("h3").textContent = `${multi.label} ${index + 1}`;
      entry.querySelector(".remove-entry").hidden = index === 0;
    });
    updateResult();
  });

  updateResult();
}

if (typeof document !== "undefined") {
  const root = document.querySelector("#calculator-root");
  if (root) initCalculator(root);
}

export { tools, multiTools, toolTips };
