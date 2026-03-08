export interface FamilyMember {
  id: string;
  name: string;
  hebrewName: string;
  relationship: string;
  birthdayEnglish: string; // MM-DD format
  birthdayHebrew: string;
  birthYear: number;
  photos: string[];
  occasionSongs: { title: string; occasion: string }[];
}

export const familyMembers: FamilyMember[] = [
  {
    id: "1",
    name: "Sarah",
    hebrewName: "שָׂרָה",
    relationship: "Granddaughter",
    birthdayEnglish: "03-08",
    birthdayHebrew: "8 Adar",
    birthYear: 2018,
    photos: [],
    occasionSongs: [{ title: "Happy Birthday", occasion: "birthday" }],
  },
  {
    id: "2",
    name: "David",
    hebrewName: "דָּוִד",
    relationship: "Grandson",
    birthdayEnglish: "06-15",
    birthdayHebrew: "15 Sivan",
    birthYear: 2015,
    photos: [],
    occasionSongs: [{ title: "Happy Birthday", occasion: "birthday" }],
  },
  {
    id: "3",
    name: "Rachel",
    hebrewName: "רָחֵל",
    relationship: "Daughter",
    birthdayEnglish: "09-22",
    birthdayHebrew: "22 Elul",
    birthYear: 1988,
    photos: [],
    occasionSongs: [{ title: "Happy Birthday", occasion: "birthday" }],
  },
  {
    id: "4",
    name: "Michael",
    hebrewName: "מִיכָאֵל",
    relationship: "Grandson",
    birthdayEnglish: "12-01",
    birthdayHebrew: "1 Kislev",
    birthYear: 2020,
    photos: [],
    occasionSongs: [{ title: "Happy Birthday", occasion: "birthday" }],
  },
  {
    id: "5",
    name: "Leah",
    hebrewName: "לֵאָה",
    relationship: "Granddaughter",
    birthdayEnglish: "04-10",
    birthdayHebrew: "10 Nisan",
    birthYear: 2016,
    photos: [],
    occasionSongs: [{ title: "Happy Birthday", occasion: "birthday" }],
  },
];

export function getTodaysBirthdays(): FamilyMember[] {
  const today = new Date();
  const todayStr = `${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  return familyMembers.filter((m) => m.birthdayEnglish === todayStr);
}

export function getUpcomingBirthdays(count = 3): FamilyMember[] {
  const today = new Date();
  const todayStr = `${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const sorted = [...familyMembers].sort((a, b) => {
    const aNext = getNextBirthday(a.birthdayEnglish, todayStr);
    const bNext = getNextBirthday(b.birthdayEnglish, todayStr);
    return aNext - bNext;
  });

  return sorted.slice(0, count);
}

function getNextBirthday(birthday: string, today: string): number {
  const [bm, bd] = birthday.split("-").map(Number);
  const [tm, td] = today.split("-").map(Number);
  const bDay = bm * 31 + bd;
  const tDay = tm * 31 + td;
  return bDay >= tDay ? bDay - tDay : 365 - tDay + bDay;
}

export function getAge(birthYear: number): number {
  return new Date().getFullYear() - birthYear;
}
