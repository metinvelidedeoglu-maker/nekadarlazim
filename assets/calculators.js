import { addShoppingItem } from "./shopping-list.js";

const trNumber = new Intl.NumberFormat("tr-TR", {
  maximumFractionDigits: 2,
});

const tools = {
  boya: {
    title: "Duvar Boyası Hesaplama",
    subtitle: "Odanızın duvarları ve tavanı için gereken yaklaşık boya miktarını hesaplayın.",
    button: "Boyayı hesapla",
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
    fields: [
      { key: "length", label: "Oda uzunluğu", unit: "m", value: 5, min: 0.1, step: 0.1 },
      { key: "width", label: "Oda genişliği", unit: "m", value: 4, min: 0.1, step: 0.1 },
      { key: "packArea", label: "Bir paketin kapladığı alan", unit: "m²", value: 1.84, min: 0.1, step: 0.01 },
      { key: "waste", label: "Kesim ve fire payı", unit: "%", value: 10, min: 0, max: 50, step: 1 },
      { key: "packPrice", label: "Paket fiyatı (isteğe bağlı)", unit: "TL", value: 0, min: 0, step: 0.01 },
    ],
    calculate: calculateParquet,
  },
  seramik: {
    title: "Seramik Hesaplama",
    subtitle: "Zemin veya duvar için gereken seramik adedini hesaplayın.",
    button: "Seramiği hesapla",
    fields: [
      { key: "length", label: "Uygulama uzunluğu", unit: "m", value: 4, min: 0.1, step: 0.1 },
      { key: "width", label: "Uygulama genişliği", unit: "m", value: 3, min: 0.1, step: 0.1 },
      { key: "tileWidth", label: "Seramik genişliği", unit: "cm", value: 60, min: 1, step: 1 },
      { key: "tileHeight", label: "Seramik yüksekliği", unit: "cm", value: 60, min: 1, step: 1 },
      { key: "piecesPerBox", label: "Kutudaki seramik adedi", unit: "adet", value: 4, min: 1, step: 1 },
      { key: "boxArea", label: "Kutunun kapladığı alan", unit: "m²", value: 1.44, min: 0, step: 0.01 },
      { key: "waste", label: "Kesim ve fire payı", unit: "%", value: 10, min: 0, max: 50, step: 1 },
      { key: "boxPrice", label: "Kutu fiyatı (isteğe bağlı)", unit: "TL", value: 0, min: 0, step: 0.01 },
    ],
    calculate: calculateTile,
  },
  "duvar-kagidi": {
    title: "Duvar Kâğıdı Hesaplama",
    subtitle: "Duvar ölçülerine göre gereken rulo sayısını hesaplayın.",
    button: "Ruloyu hesapla",
    fields: [
      { key: "totalWallWidth", label: "Kaplanacak toplam duvar genişliği", unit: "m", value: 18, min: 0.1, step: 0.1 },
      { key: "wallHeight", label: "Duvar yüksekliği", unit: "m", value: 2.7, min: 0.1, step: 0.1 },
      { key: "rollWidth", label: "Rulo genişliği", unit: "cm", value: 53, min: 1, step: 1 },
      { key: "rollLength", label: "Rulo uzunluğu", unit: "m", value: 10, min: 0.1, step: 0.1 },
      { key: "patternRepeat", label: "Desen tekrarı", unit: "cm", value: 0, min: 0, step: 1 },
      { key: "trim", label: "Şerit başına kesim payı", unit: "cm", value: 10, min: 0, step: 1 },
      { key: "rollPrice", label: "Rulo fiyatı (isteğe bağlı)", unit: "TL", value: 0, min: 0, step: 0.01 },
    ],
    calculate: calculateWallpaper,
  },
  "duvar-paneli": {
    title: "Duvar Paneli Hesaplama",
    subtitle: "Duvarınız için gereken panel adedini kolayca bulun.",
    button: "Paneli hesapla",
    fields: [
      { key: "wallWidth", label: "Duvar genişliği", unit: "m", value: 4, min: 0.1, step: 0.1 },
      { key: "wallHeight", label: "Duvar yüksekliği", unit: "m", value: 2.7, min: 0.1, step: 0.1 },
      { key: "panelWidth", label: "Panel genişliği", unit: "cm", value: 60, min: 1, step: 1 },
      { key: "panelHeight", label: "Panel yüksekliği", unit: "cm", value: 280, min: 1, step: 1 },
      { key: "waste", label: "Yedek ve fire payı", unit: "%", value: 5, min: 0, max: 50, step: 1 },
      { key: "piecePrice", label: "Panel fiyatı (isteğe bağlı)", unit: "TL", value: 0, min: 0, step: 0.01 },
    ],
    calculate: calculateWallPanel,
  },
  beton: {
    title: "Beton Hacmi Hesaplama",
    subtitle: "Döşeme veya temel için gereken beton hacmini hesaplayın.",
    button: "Betonu hesapla",
    fields: [
      { key: "length", label: "Uzunluk", unit: "m", value: 5, min: 0.1, step: 0.1 },
      { key: "width", label: "Genişlik", unit: "m", value: 3, min: 0.1, step: 0.1 },
      { key: "thickness", label: "Kalınlık", unit: "cm", value: 10, min: 1, step: 1 },
      { key: "bagYield", label: "Hazır karışım torbası verimi", unit: "L", value: 12, min: 1, step: 0.5 },
      { key: "waste", label: "Fire payı", unit: "%", value: 8, min: 0, max: 50, step: 1 },
      { key: "pricePerM3", label: "Hazır beton fiyatı (isteğe bağlı)", unit: "TL/m³", value: 0, min: 0, step: 0.01 },
      { key: "bagPrice", label: "Torba fiyatı (isteğe bağlı)", unit: "TL", value: 0, min: 0, step: 0.01 },
    ],
    calculate: calculateConcrete,
  },
  tugla: {
    title: "Tuğla ve Blok Hesaplama",
    subtitle: "Duvar alanına göre gereken tuğla veya blok adedini bulun.",
    button: "Tuğlayı hesapla",
    fields: [
      { key: "wallWidth", label: "Duvar genişliği", unit: "m", value: 5, min: 0.1, step: 0.1 },
      { key: "wallHeight", label: "Duvar yüksekliği", unit: "m", value: 2.7, min: 0.1, step: 0.1 },
      { key: "openingArea", label: "Kapı ve pencere alanı", unit: "m²", value: 2, min: 0, step: 0.1 },
      { key: "blockWidth", label: "Tuğla/blok uzunluğu", unit: "cm", value: 19, min: 1, step: 0.5 },
      { key: "blockHeight", label: "Tuğla/blok yüksekliği", unit: "cm", value: 13.5, min: 1, step: 0.5 },
      { key: "joint", label: "Derz kalınlığı", unit: "mm", value: 10, min: 0, step: 1 },
      { key: "waste", label: "Kırılma ve fire payı", unit: "%", value: 8, min: 0, max: 50, step: 1 },
      { key: "piecePrice", label: "Tuğla/blok fiyatı (isteğe bağlı)", unit: "TL", value: 0, min: 0, step: 0.01 },
    ],
    calculate: calculateBrick,
  },
  supurgelik: {
    title: "Süpürgelik Hesaplama",
    subtitle: "Oda çevresine göre gereken süpürgelik boyunu hesaplayın.",
    button: "Süpürgeliği hesapla",
    fields: [
      { key: "length", label: "Oda uzunluğu", unit: "m", value: 5, min: 0.1, step: 0.1 },
      { key: "width", label: "Oda genişliği", unit: "m", value: 4, min: 0.1, step: 0.1 },
      { key: "doorWidth", label: "Toplam kapı genişliği", unit: "m", value: 0.9, min: 0, step: 0.1 },
      { key: "pieceLength", label: "Bir süpürgelik boyu", unit: "m", value: 2.4, min: 0.1, step: 0.1 },
      { key: "waste", label: "Kesim ve fire payı", unit: "%", value: 10, min: 0, max: 50, step: 1 },
      { key: "piecePrice", label: "Bir boyun fiyatı (isteğe bağlı)", unit: "TL", value: 0, min: 0, step: 0.01 },
    ],
    calculate: calculateSkirting,
  },
  perde: {
    title: "Perde Kumaşı Hesaplama",
    subtitle: "Pile oranına göre gereken yaklaşık perde kumaşını bulun.",
    button: "Kumaşı hesapla",
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
      { key: "sideHem", label: "Her parçada toplam yan kıvırma", unit: "cm", value: 20, min: 0, step: 1 },
      { key: "meterPrice", label: "Kumaş metre fiyatı (isteğe bağlı)", unit: "TL", value: 0, min: 0, step: 0.01 },
    ],
    calculate: calculateCurtain,
  },
  elektrik: {
    title: "Elektrik Tüketimi Hesaplama",
    subtitle: "Bir cihazın aylık elektrik tüketimini ve maliyetini hesaplayın.",
    button: "Tüketimi hesapla",
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

  return result(
    `${trNumber.format(rounded(totalLiters, 1))} litre toplam boya`,
    ceilingCoats > 0 ? "Duvar ve tavan için yaklaşık ihtiyaç" : "Duvar için yaklaşık ihtiyaç",
    [
      ["Boyanacak net duvar", `${trNumber.format(rounded(netArea))} m²`],
      ["Duvar kat sayısı", `${wallCoats} kat`],
      ["Önerinin nedeni", recommendation.reason],
      ["Duvar için gereken", `${trNumber.format(rounded(wallLiters, 1))} L`],
      ["Tavan uygulaması", ceilingStatus],
      ["Tavan için gereken", ceilingAmount],
      ["Astar önerisi", recommendation.primerLabel],
      ["Duvar astarı", primerAmount],
      ["Toplam boya ihtiyacı", `${trNumber.format(rounded(totalLiters, 1))} L`],
    ],
    `${recommendation.warning} ${recommendation.primerNote} İstediğiniz renk tonunu mağazada markanın kartelasından seçip hazırlatabilirsiniz. Ambalaj seçeneklerine göre miktarı yukarı tamamlayın.`.trim()
  );
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
  };
}

export function calculateParquet(input) {
  const area = positive(input.length) * positive(input.width);
  const requiredArea = withWaste(area, input.waste);
  const packs = Math.ceil(requiredArea / Math.max(0.01, positive(input.packArea)));

  return result(
    `${trNumber.format(packs)} paket parke`,
    "Satın alınması önerilen miktar",
    [
      ["Net zemin alanı", `${trNumber.format(rounded(area))} m²`],
      ["Fire dahil ihtiyaç", `${trNumber.format(rounded(requiredArea))} m²`],
      ["Paketlerin toplam alanı", `${trNumber.format(rounded(packs * positive(input.packArea)))} m²`],
      ["Tahmini parke bedeli", estimatedCost(packs * positive(input.packPrice), input.packPrice)],
    ],
    "Çapraz döşeme veya çok girintili alanlarda fire oranını yükseltin."
  );
}

export function calculateTile(input) {
  const area = positive(input.length) * positive(input.width);
  const requiredArea = withWaste(area, input.waste);
  const tileArea = (positive(input.tileWidth) / 100) * (positive(input.tileHeight) / 100);
  const pieces = Math.ceil(requiredArea / Math.max(0.0001, tileArea));
  const piecesPerBox = Math.max(1, positive(input.piecesPerBox));
  const statedBoxArea = positive(input.boxArea);
  const calculatedBoxArea = tileArea * piecesPerBox;
  const boxArea = statedBoxArea > 0 ? statedBoxArea : calculatedBoxArea;
  const boxes = Math.ceil(requiredArea / Math.max(0.0001, boxArea));

  return result(
    `${trNumber.format(boxes)} kutu seramik`,
    `${trNumber.format(pieces)} adet yaklaşık ihtiyaç`,
    [
      ["Net uygulama alanı", `${trNumber.format(rounded(area))} m²`],
      ["Fire dahil alan", `${trNumber.format(rounded(requiredArea))} m²`],
      ["Kutunun kapladığı alan", `${trNumber.format(rounded(boxArea))} m²`],
      ["Kutudaki adet", `${trNumber.format(piecesPerBox)} adet`],
      ["Satın alınan toplam", `${trNumber.format(rounded(boxes * boxArea))} m²`],
      ["Tahmini seramik bedeli", estimatedCost(boxes * positive(input.boxPrice), input.boxPrice)],
    ],
    statedBoxArea > 0
      ? "Kutu hesabında ambalaj üzerindeki m² değeri esas alınır; ton ve kalibre kodlarını da kontrol edin."
      : "Kutu m² değeri girilmediği için ürün ölçüsü ve kutu içi adet kullanıldı."
  );
}

export function calculateWallpaper(input) {
  const rollWidthM = positive(input.rollWidth) / 100;
  const repeatM = positive(input.patternRepeat) / 100;
  const trimM = positive(input.trim) / 100;
  const rawStrip = positive(input.wallHeight) + trimM;
  const stripLength = repeatM > 0 ? Math.ceil(rawStrip / repeatM) * repeatM : rawStrip;
  const stripsNeeded = Math.ceil(positive(input.totalWallWidth) / Math.max(0.01, rollWidthM));
  const stripsPerRoll = Math.floor(positive(input.rollLength) / Math.max(0.01, stripLength));

  if (stripsPerRoll < 1) {
    return result(
      "Rulo uzunluğu yetersiz",
      "Ölçüleri kontrol edin",
      [
        ["Gerekli şerit boyu", `${trNumber.format(rounded(stripLength))} m`],
        ["Girilen rulo uzunluğu", `${trNumber.format(rounded(positive(input.rollLength)))} m`],
      ],
      "Bir tam şerit rulodan çıkmıyor. Daha uzun bir rulo seçin veya ölçüleri düzeltin."
    );
  }
  const rolls = Math.ceil(stripsNeeded / stripsPerRoll);

  return result(
    `${trNumber.format(rolls)} rulo duvar kâğıdı`,
    "Önerilen yaklaşık miktar",
    [
      ["Gereken şerit", `${trNumber.format(stripsNeeded)} adet`],
      ["Bir şeridin kesim boyu", `${trNumber.format(rounded(stripLength))} m`],
      ["Bir rulodan çıkan", `${trNumber.format(stripsPerRoll)} şerit`],
      ["Tahmini duvar kâğıdı bedeli", estimatedCost(rolls * positive(input.rollPrice), input.rollPrice)],
    ],
    "Desen eşleştirme ve duvar girintileri rulo ihtiyacını artırabilir."
  );
}

export function calculateWallPanel(input) {
  const columns = Math.ceil(positive(input.wallWidth) / Math.max(0.01, positive(input.panelWidth) / 100));
  const rows = Math.ceil(positive(input.wallHeight) / Math.max(0.01, positive(input.panelHeight) / 100));
  const basePieces = columns * rows;
  const pieces = Math.ceil(withWaste(basePieces, input.waste));
  const wallArea = positive(input.wallWidth) * positive(input.wallHeight);

  return result(
    `${trNumber.format(pieces)} adet panel`,
    "Yedek payı dahil önerilen miktar",
    [
      ["Duvar alanı", `${trNumber.format(rounded(wallArea))} m²`],
      ["Yatayda panel", `${trNumber.format(columns)} adet`],
      ["Dikeyde sıra", `${trNumber.format(rows)} sıra`],
      ["Tahmini panel bedeli", estimatedCost(pieces * positive(input.piecePrice), input.piecePrice)],
    ],
    "Hesap, panellerin dikey ve tam ölçülü yerleşimine göre yapılır."
  );
}

export function calculateConcrete(input) {
  const netVolume = positive(input.length) * positive(input.width) * (positive(input.thickness) / 100);
  const orderVolume = withWaste(netVolume, input.waste);
  const bags = Math.ceil((orderVolume * 1000) / Math.max(0.1, positive(input.bagYield)));

  return result(
    `${trNumber.format(rounded(orderVolume, 2))} m³ beton`,
    "Fire dahil yaklaşık sipariş hacmi",
    [
      ["Net hacim", `${trNumber.format(rounded(netVolume, 2))} m³`],
      ["Litre karşılığı", `${trNumber.format(Math.ceil(orderVolume * 1000))} L`],
      ["Hazır karışım torbası", `${trNumber.format(bags)} adet`],
      ["Hazır beton tahmini", estimatedCost(orderVolume * positive(input.pricePerM3), input.pricePerM3)],
      ["Torbalı karışım tahmini", estimatedCost(bags * positive(input.bagPrice), input.bagPrice)],
    ],
    "Taşıyıcı beton uygulamalarında sınıf ve miktar için mutlaka uzman görüşü alın."
  );
}

export function calculateBrick(input) {
  const grossArea = positive(input.wallWidth) * positive(input.wallHeight);
  const netArea = Math.max(0, grossArea - positive(input.openingArea));
  const jointM = positive(input.joint) / 1000;
  const moduleArea = (positive(input.blockWidth) / 100 + jointM) * (positive(input.blockHeight) / 100 + jointM);
  const basePieces = netArea / Math.max(0.0001, moduleArea);
  const pieces = Math.ceil(withWaste(basePieces, input.waste));

  return result(
    `${trNumber.format(pieces)} adet tuğla/blok`,
    "Fire dahil yaklaşık miktar",
    [
      ["Brüt duvar alanı", `${trNumber.format(rounded(grossArea))} m²`],
      ["Net örülecek alan", `${trNumber.format(rounded(netArea))} m²`],
      ["Metrekare başına", `${trNumber.format(rounded(1 / Math.max(0.0001, moduleArea), 1))} adet`],
      ["Tahmini tuğla/blok bedeli", estimatedCost(pieces * positive(input.piecePrice), input.piecePrice)],
    ],
    "Ürün ölçüsü ve uygulama biçimi üretici tavsiyesine göre kontrol edilmelidir."
  );
}

export function calculateSkirting(input) {
  const perimeter = 2 * (positive(input.length) + positive(input.width));
  const netLength = Math.max(0, perimeter - positive(input.doorWidth));
  const requiredLength = withWaste(netLength, input.waste);
  const pieces = Math.ceil(requiredLength / Math.max(0.01, positive(input.pieceLength)));

  return result(
    `${trNumber.format(pieces)} boy süpürgelik`,
    "Satın alınması önerilen miktar",
    [
      ["Oda çevresi", `${trNumber.format(rounded(perimeter))} m`],
      ["Kapılar çıktıktan sonra", `${trNumber.format(rounded(netLength))} m`],
      ["Fire dahil ihtiyaç", `${trNumber.format(rounded(requiredLength))} m`],
      ["Satın alınan toplam", `${trNumber.format(rounded(pieces * positive(input.pieceLength)))} m`],
      ["Tahmini süpürgelik bedeli", estimatedCost(pieces * positive(input.piecePrice), input.piecePrice)],
    ],
    "Köşe sayısı arttıkça kesim firesi artabilir."
  );
}

export function calculateCurtain(input) {
  const finishedWidth = positive(input.railWidth) * positive(input.fullness);
  const hemAllowance = (positive(input.sideHem) / 100) * Math.max(1, positive(input.panelCount));
  const fabricMeters = finishedWidth + hemAllowance;

  return result(
    `${trNumber.format(rounded(fabricMeters, 1))} metre kumaş`,
    "Boydan kumaş için yaklaşık ihtiyaç",
    [
      ["Pileli toplam genişlik", `${trNumber.format(rounded(finishedWidth, 1))} m`],
      ["Yan kıvırma payı", `${trNumber.format(rounded(hemAllowance, 1))} m`],
      ["Pile oranı", `${trNumber.format(positive(input.fullness))} kat`],
      ["Tahmini kumaş bedeli", estimatedCost(fabricMeters * positive(input.meterPrice), input.meterPrice)],
    ],
    "Hesap, yüksekliği yeterli boydan perde kumaşı içindir; desen ve dikim payı ayrıca kontrol edilmelidir."
  );
}

export function calculateElectricity(input) {
  const monthlyKwh = (positive(input.watts) * positive(input.count) * positive(input.hoursPerDay) * positive(input.daysPerMonth)) / 1000;
  const monthlyCost = monthlyKwh * positive(input.pricePerKwh);
  const annualCost = monthlyCost * 12;

  const hasPrice = positive(input.pricePerKwh) > 0;

  return result(
    hasPrice
      ? `${trNumber.format(rounded(monthlyCost, 2))} TL / ay`
      : `${trNumber.format(rounded(monthlyKwh, 2))} kWh / ay`,
    hasPrice ? "Tahmini aylık elektrik maliyeti" : "Tahmini aylık elektrik tüketimi",
    [
      ["Aylık tüketim", `${trNumber.format(rounded(monthlyKwh, 2))} kWh`],
      ["Günlük tüketim", `${trNumber.format(rounded(monthlyKwh / Math.max(1, positive(input.daysPerMonth)), 2))} kWh`],
      ["Aylık maliyet", hasPrice ? `${trNumber.format(rounded(monthlyCost, 2))} TL` : "Birim fiyat girilmedi"],
      ["Yıllık maliyet", hasPrice ? `${trNumber.format(rounded(annualCost, 2))} TL` : "Birim fiyat girilmedi"],
    ],
    "Tarifenizdeki güncel vergiler ve kademeler gerçek faturayı değiştirebilir."
  );
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

function renderField(field) {
  const id = `field-${field.key}`;
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
    return `<label class="field checkbox-field" for="${id}"><input id="${id}" name="${escapeHtml(field.key)}" type="checkbox" ${field.value ? "checked" : ""}><span>${escapeHtml(field.label)}</span></label>`;
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
  return `<div class="result-heading">
      <span>${escapeHtml(calculation.eyebrow)}</span>
      <strong>${escapeHtml(calculation.headline)}</strong>
    </div>
    <dl class="result-list">
      ${calculation.items.map(([label, value]) => `<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd></div>`).join("")}
    </dl>
    <p class="result-note">${escapeHtml(calculation.note)}</p>
    <div class="result-actions">
      <button class="result-action add-result" type="button">+ Listeme ekle</button>
      <button class="result-action share-result" type="button">Paylaş / kopyala</button>
    </div>`;
}

function calculationText(tool, calculation, projectName) {
  const title = projectName ? `${projectName} · ${tool.title}` : tool.title;
  return `${title}\n${calculation.headline}\n${calculation.items.map(([label, value]) => `${label}: ${value}`).join("\n")}\n\n${calculation.note}`;
}

function readValues(tool, form) {
  let firstError = "";
  const values = {};

  tool.fields.forEach((field) => {
    const input = form.elements.namedItem(field.key);
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

  root.innerHTML = `<div class="calculator-title"><span class="calculator-badge">Ücretsiz araç</span><h2>${escapeHtml(tool.title)}</h2><p>${escapeHtml(tool.subtitle)}</p></div>
    <form class="calculator-form">
      <div class="form-grid">
        <label class="field project-field" for="field-project-name"><span>Alan / proje adı <small>(isteğe bağlı)</small></span><span class="input-wrap"><input id="field-project-name" name="projectName" type="text" maxlength="100" placeholder="Örn. Salon" autocomplete="off"></span></label>
        ${tool.fields.map(renderField).join("")}
      </div>
      <button class="primary-button calculate-button" type="submit">${escapeHtml(tool.button)}</button>
      <p class="live-hint">Değerleri değiştirdikçe sonuç otomatik yenilenir.</p>
      <p class="form-message" role="alert" hidden></p>
    </form>
    <section class="calculator-result" aria-live="polite"></section>`;

  const form = root.querySelector("form");
  const resultRoot = root.querySelector(".calculator-result");

  let liveTimer;

  function updateResult() {
    const { values, error } = readValues(tool, form);
    const message = form.querySelector(".form-message");

    if (error) {
      message.textContent = error;
      message.hidden = false;
      resultRoot.innerHTML = `<p class="result-invalid">Sonucu yenilemek için işaretli alanı düzeltin.</p>`;
      return false;
    }

    message.hidden = true;
    const calculation = tool.calculate(values);
    resultRoot.innerHTML = renderResult(calculation);
    const projectName = form.elements.namedItem("projectName").value.trim();
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
    if (event.target.name === "projectName") return;
    window.clearTimeout(liveTimer);
    liveTimer = window.setTimeout(updateResult, 180);
  });

  updateResult();
}

if (typeof document !== "undefined") {
  const root = document.querySelector("#calculator-root");
  if (root) initCalculator(root);
}

export { tools };
