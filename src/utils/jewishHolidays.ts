import { toJewishDate } from "jewish-date";

export type JewishHoliday = {
  name: string;
  hebrewName: string;
  emoji: string;
};

// Major Jewish holidays mapped by Hebrew month name and day
const HOLIDAY_MAP: Record<string, Record<number, JewishHoliday>> = {
  Tishrei: {
    1: { name: "Rosh Hashana", hebrewName: "ראש השנה", emoji: "🍎" },
    2: { name: "Rosh Hashana", hebrewName: "ראש השנה", emoji: "🍎" },
    10: { name: "Yom Kippur", hebrewName: "יום כיפור", emoji: "🕊️" },
    15: { name: "Sukkot", hebrewName: "סוכות", emoji: "🌿" },
    16: { name: "Sukkot", hebrewName: "סוכות", emoji: "🌿" },
    17: { name: "Sukkot", hebrewName: "סוכות", emoji: "🌿" },
    18: { name: "Sukkot", hebrewName: "סוכות", emoji: "🌿" },
    19: { name: "Sukkot", hebrewName: "סוכות", emoji: "🌿" },
    20: { name: "Sukkot", hebrewName: "סוכות", emoji: "🌿" },
    21: { name: "Hoshana Rabba", hebrewName: "הושענא רבה", emoji: "🌿" },
    22: { name: "Shmini Atzeret", hebrewName: "שמיני עצרת", emoji: "🎉" },
    23: { name: "Simchat Torah", hebrewName: "שמחת תורה", emoji: "📜" },
  },
  Kislev: {
    25: { name: "Chanukah", hebrewName: "חנוכה", emoji: "🕎" },
    26: { name: "Chanukah", hebrewName: "חנוכה", emoji: "🕎" },
    27: { name: "Chanukah", hebrewName: "חנוכה", emoji: "🕎" },
    28: { name: "Chanukah", hebrewName: "חנוכה", emoji: "🕎" },
    29: { name: "Chanukah", hebrewName: "חנוכה", emoji: "🕎" },
    30: { name: "Chanukah", hebrewName: "חנוכה", emoji: "🕎" },
  },
  Teves: {
    1: { name: "Chanukah", hebrewName: "חנוכה", emoji: "🕎" },
    2: { name: "Chanukah", hebrewName: "חנוכה", emoji: "🕎" },
    3: { name: "Chanukah", hebrewName: "חנוכה", emoji: "🕎" },
  },
  Shvat: {
    15: { name: "Tu Bishvat", hebrewName: "ט״ו בשבט", emoji: "🌳" },
  },
  Adar: {
    14: { name: "Purim", hebrewName: "פורים", emoji: "🎭" },
    15: { name: "Shushan Purim", hebrewName: "שושן פורים", emoji: "🎭" },
  },
  "Adar II": {
    14: { name: "Purim", hebrewName: "פורים", emoji: "🎭" },
    15: { name: "Shushan Purim", hebrewName: "שושן פורים", emoji: "🎭" },
  },
  Nissan: {
    15: { name: "Pesach", hebrewName: "פסח", emoji: "🍷" },
    16: { name: "Pesach", hebrewName: "פסח", emoji: "🍷" },
    17: { name: "Pesach", hebrewName: "פסח", emoji: "🍷" },
    18: { name: "Pesach", hebrewName: "פסח", emoji: "🍷" },
    19: { name: "Pesach", hebrewName: "פסח", emoji: "🍷" },
    20: { name: "Pesach", hebrewName: "פסח", emoji: "🍷" },
    21: { name: "Pesach", hebrewName: "פסח", emoji: "🍷" },
    22: { name: "Pesach", hebrewName: "פסח", emoji: "🍷" },
  },
  Iyar: {
    5: { name: "Yom Ha'atzmaut", hebrewName: "יום העצמאות", emoji: "🇮🇱" },
    18: { name: "Lag BaOmer", hebrewName: "ל״ג בעומר", emoji: "🔥" },
  },
  Sivan: {
    6: { name: "Shavuot", hebrewName: "שבועות", emoji: "🌾" },
    7: { name: "Shavuot", hebrewName: "שבועות", emoji: "🌾" },
  },
  Av: {
    9: { name: "Tisha B'Av", hebrewName: "תשעה באב", emoji: "😢" },
    15: { name: "Tu B'Av", hebrewName: "ט״ו באב", emoji: "❤️" },
  },
};

export function getHolidayForDate(date: Date): JewishHoliday | null {
  try {
    const jd = toJewishDate(date);
    const monthHolidays = HOLIDAY_MAP[jd.monthName];
    if (!monthHolidays) return null;
    return monthHolidays[jd.day] || null;
  } catch {
    return null;
  }
}

// Check if a date is Shabbat (Friday sundown to Saturday sundown - simplified as Saturday)
export function isShabbat(date: Date): boolean {
  return date.getDay() === 6;
}
