export const SHOPPING_LIST_KEY = "ne-kadar-lazim:shopping-list:v1";
const MAX_ITEMS = 30;

function availableStorage(storage) {
  if (storage) return storage;
  try {
    return globalThis.localStorage;
  } catch {
    return null;
  }
}

function cleanText(value, maxLength = 240) {
  return String(value ?? "").trim().slice(0, maxLength);
}

function makeId() {
  try {
    return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  } catch {
    return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }
}

function normalizeItem(item) {
  if (!item || typeof item !== "object") return null;

  const title = cleanText(item.title, 100);
  const headline = cleanText(item.headline, 160);
  if (!title || !headline) return null;

  const details = Array.isArray(item.items)
    ? item.items
        .filter((detail) => Array.isArray(detail) && detail.length >= 2)
        .slice(0, 12)
        .map(([label, value]) => [cleanText(label, 100), cleanText(value, 120)])
        .filter(([label, value]) => label && value)
    : [];

  return {
    id: cleanText(item.id, 100) || makeId(),
    toolId: cleanText(item.toolId, 60),
    title,
    projectName: cleanText(item.projectName, 100),
    headline,
    items: details,
    note: cleanText(item.note, 300),
    createdAt: cleanText(item.createdAt, 40) || new Date().toISOString(),
  };
}

export function readShoppingList(storage) {
  const target = availableStorage(storage);
  if (!target) return [];

  try {
    const parsed = JSON.parse(target.getItem(SHOPPING_LIST_KEY) || "[]");
    if (!Array.isArray(parsed)) return [];
    return parsed.map(normalizeItem).filter(Boolean).slice(0, MAX_ITEMS);
  } catch {
    return [];
  }
}

export function writeShoppingList(items, storage) {
  const normalized = Array.isArray(items) ? items.map(normalizeItem).filter(Boolean).slice(0, MAX_ITEMS) : [];
  const target = availableStorage(storage);

  if (target) {
    try {
      target.setItem(SHOPPING_LIST_KEY, JSON.stringify(normalized));
    } catch {
      // Gizli gezinme veya dolu depolama durumunda sayfa çalışmaya devam eder.
    }
  }

  return normalized;
}

export function addShoppingItem(item, storage) {
  const normalized = normalizeItem(item);
  if (!normalized) return readShoppingList(storage);
  return writeShoppingList([normalized, ...readShoppingList(storage)], storage);
}

export function removeShoppingItem(id, storage) {
  return writeShoppingList(readShoppingList(storage).filter((item) => item.id !== id), storage);
}

export function clearShoppingList(storage) {
  return writeShoppingList([], storage);
}

export function formatShoppingListText(items) {
  const list = Array.isArray(items) ? items.map(normalizeItem).filter(Boolean) : [];
  if (!list.length) return "Ne Kadar Lazım? — Alışveriş listem boş.";

  const lines = ["NE KADAR LAZIM? — ALIŞVERİŞ LİSTEM", ""];
  list.forEach((item, index) => {
    const name = item.projectName ? `${item.projectName} · ${item.title}` : item.title;
    lines.push(`${index + 1}. ${name}`, item.headline);
    item.items.forEach(([label, value]) => lines.push(`- ${label}: ${value}`));
    lines.push("");
  });

  lines.push("Hesaplamalar yaklaşık ve bilgilendirme amaçlıdır.");
  return lines.join("\n");
}
