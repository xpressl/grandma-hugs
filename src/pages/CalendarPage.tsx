import { useState } from "react";
import { useFamilyMembers, getAge } from "@/hooks/useFamilyData";
import type { FamilyMember } from "@/hooks/useFamilyData";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { toJewishDate, toHebrewJewishDate } from "jewish-date";
import { getHolidayForDate, isShabbat } from "@/utils/jewishHolidays";
import type { JewishHoliday } from "@/utils/jewishHolidays";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const CalendarPage = () => {
  const { data: members = [] } = useFamilyMembers();
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear((y) => y - 1); }
    else setMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear((y) => y + 1); }
    else setMonth((m) => m + 1);
  };

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  // Map birthdays to day numbers
  const birthdayMap = new Map<number, FamilyMember[]>();
  members.forEach((m) => {
    if (!m.birthday_english) return;
    const bday = new Date(m.birthday_english);
    if (bday.getMonth() === month) {
      const day = bday.getDate();
      if (!birthdayMap.has(day)) birthdayMap.set(day, []);
      birthdayMap.get(day)!.push(m);
    }
  });

  // Map holidays to day numbers
  const holidayMap = new Map<number, JewishHoliday>();
  const shabbatDays = new Set<number>();
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d);
    const holiday = getHolidayForDate(date);
    if (holiday) holidayMap.set(d, holiday);
    if (isShabbat(date)) shabbatDays.add(d);
  }

  const isToday = (day: number) =>
    day === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const selectedMembers = selectedDay ? birthdayMap.get(selectedDay) || [] : [];
  const selectedHoliday = selectedDay ? holidayMap.get(selectedDay) || null : null;

  // Hebrew month labels
  const startJewish = toHebrewJewishDate(toJewishDate(new Date(year, month, 1)));
  const endJewish = toHebrewJewishDate(toJewishDate(new Date(year, month + 1, 0)));
  const hebrewMonthLabel = startJewish.monthName === endJewish.monthName
    ? `${startJewish.monthName} ${startJewish.year}`
    : `${startJewish.monthName} – ${endJewish.monthName} ${endJewish.year}`;

  // Collect this month's holidays for summary
  const monthHolidays = Array.from(holidayMap.entries()).sort(([a], [b]) => a - b);

  return (
    <div className="min-h-screen pb-28 px-2 pt-6 max-w-lg mx-auto">
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-6 animate-slide-up">
        <button onClick={prevMonth} className="p-4 rounded-2xl bg-card border border-border hover:scale-105 transition-transform" aria-label="Previous month">
          <ChevronLeft size={28} className="text-foreground" />
        </button>
        <div className="text-center">
          <h1 className="font-display text-grandma-xl text-foreground">
            {MONTH_NAMES[month]}
          </h1>
          <p className="text-grandma-sm text-muted-foreground">{year}</p>
          <p className="text-grandma-sm text-muted-foreground font-medium mt-1" dir="rtl">{hebrewMonthLabel}</p>
        </div>
        <button onClick={nextMonth} className="p-4 rounded-2xl bg-card border border-border hover:scale-105 transition-transform" aria-label="Next month">
          <ChevronRight size={28} className="text-foreground" />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1.5 mb-2">
        {DAY_NAMES.map((d) => (
          <div key={d} className="text-center text-sm font-bold text-muted-foreground py-2">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid — bigger boxes */}
      <div className="grid grid-cols-7 gap-1.5">
        {cells.map((day, i) => {
          if (day === null) return <div key={`empty-${i}`} className="min-h-[60px]" />;
          const hasBirthday = birthdayMap.has(day);
          const holiday = holidayMap.get(day);
          const isShabDay = shabbatDays.has(day);
          const todayClass = isToday(day);
          const isSelected = selectedDay === day;

          const gregDate = new Date(year, month, day);
          const jewishDate = toJewishDate(gregDate);
          const hebrewDate = toHebrewJewishDate(jewishDate);
          const hebrewDay = hebrewDate.day;

          return (
            <button
              key={day}
              onClick={() => setSelectedDay(isSelected ? null : day)}
              className={`
                relative min-h-[60px] rounded-xl flex flex-col items-center justify-center transition-all duration-200 hover:scale-[1.05]
                ${todayClass ? "bg-primary text-primary-foreground shadow-lg ring-2 ring-primary/30" : ""}
                ${isSelected && !todayClass ? "bg-primary/20 border-2 border-primary scale-[1.05]" : ""}
                ${holiday && !todayClass && !isSelected ? "bg-accent/30 border border-accent" : ""}
                ${isShabDay && !todayClass && !isSelected && !holiday ? "bg-muted/50 border border-border" : ""}
                ${!todayClass && !isSelected && !holiday && !isShabDay ? "bg-card border border-border" : ""}
              `}
            >
              <span className="text-base font-bold leading-none">{day}</span>
              <span className={`text-[10px] leading-none mt-1 font-medium ${todayClass ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                {hebrewDay}
              </span>
              {holiday && <span className="text-xs leading-none mt-0.5">{holiday.emoji}</span>}
              {hasBirthday && !holiday && <span className="text-xs leading-none mt-0.5">🎂</span>}
            </button>
          );
        })}
      </div>

      {/* Selected day detail */}
      {selectedDay !== null && (
        <div className="mt-6 space-y-3">
          <h2 className="font-display text-grandma-lg text-foreground">
            {MONTH_NAMES[month]} {selectedDay}
          </h2>

          {selectedHoliday && (
            <div className="bg-accent/20 rounded-2xl p-4 border border-accent shadow-sm">
              <p className="text-grandma-base font-bold text-foreground">
                {selectedHoliday.emoji} {selectedHoliday.name}
              </p>
              <p className="text-grandma-sm text-muted-foreground" dir="rtl">
                {selectedHoliday.hebrewName}
              </p>
            </div>
          )}

          {selectedMembers.length > 0 ? (
            selectedMembers.map((m) => {
              const age = getAge(m.birth_year);
              return (
                <div key={m.id} className="bg-card rounded-2xl p-4 border border-border shadow-sm flex items-center gap-4">
                  {m.photo_url ? (
                    <img src={m.photo_url} alt={m.name} className="w-16 h-16 rounded-full object-cover border-2 border-primary/20" />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-grandma-lg font-display text-primary">{m.name[0]}</span>
                    </div>
                  )}
                  <div>
                    <p className="text-grandma-base font-bold text-foreground">
                      🎂 {m.name}'s Birthday!
                    </p>
                    <p className="text-grandma-sm text-muted-foreground">
                      {m.relationship} {age !== null ? `• Turns ${age} in ${year}` : ""}
                    </p>
                    {m.birthday_hebrew && (
                      <p className="text-sm text-muted-foreground">{m.birthday_hebrew}</p>
                    )}
                  </div>
                </div>
              );
            })
          ) : !selectedHoliday ? (
            <div className="bg-card rounded-2xl p-6 border border-border text-center">
              <p className="text-grandma-base text-muted-foreground">No events on this day</p>
            </div>
          ) : null}
        </div>
      )}

      {/* This month's holidays & birthdays summary */}
      {selectedDay === null && (monthHolidays.length > 0 || birthdayMap.size > 0) && (
        <div className="mt-6 space-y-3">
          <h2 className="font-display text-grandma-lg text-foreground">
            🗓️ This Month
          </h2>

          {/* Holidays */}
          {monthHolidays.map(([day, holiday]) => (
            <button
              key={`hol-${day}`}
              onClick={() => setSelectedDay(day)}
              className="w-full bg-accent/20 rounded-2xl p-4 border border-accent shadow-sm flex items-center gap-4 text-left"
            >
              <span className="text-2xl">{holiday.emoji}</span>
              <div>
                <p className="text-grandma-base font-bold text-foreground">{holiday.name}</p>
                <p className="text-grandma-sm text-muted-foreground">
                  {MONTH_NAMES[month]} {day} • <span dir="rtl">{holiday.hebrewName}</span>
                </p>
              </div>
            </button>
          ))}

          {/* Birthdays */}
          {Array.from(birthdayMap.entries())
            .sort(([a], [b]) => a - b)
            .map(([day, people]) =>
              people.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setSelectedDay(day)}
                  className="w-full bg-card rounded-2xl p-4 border border-border shadow-sm flex items-center gap-4 text-left"
                >
                  {m.photo_url ? (
                    <img src={m.photo_url} alt={m.name} className="w-14 h-14 rounded-full object-cover border-2 border-primary/20" />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-grandma-base font-display text-primary">{m.name[0]}</span>
                    </div>
                  )}
                  <div>
                    <p className="text-grandma-base font-bold text-foreground">🎂 {m.name}</p>
                    <p className="text-grandma-sm text-muted-foreground">
                      {MONTH_NAMES[month]} {day} • {m.relationship}
                    </p>
                  </div>
                </button>
              ))
            )}
        </div>
      )}
    </div>
  );
};

export default CalendarPage;
