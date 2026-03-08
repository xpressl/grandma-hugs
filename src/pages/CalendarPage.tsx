import { useState } from "react";
import { useFamilyMembers, getAge } from "@/hooks/useFamilyData";
import type { FamilyMember } from "@/hooks/useFamilyData";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { toJewishDate, formatJewishDateInHebrew, toHebrewJewishDate } from "jewish-date";

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

  // Build calendar grid
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  // Map birthdays to day numbers for this month
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

  const isToday = (day: number) =>
    day === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const selectedMembers = selectedDay ? birthdayMap.get(selectedDay) || [] : [];

  return (
    <div className="min-h-screen pb-28 px-4 pt-6 max-w-lg mx-auto">
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={prevMonth} className="p-4 rounded-2xl bg-card border border-border" aria-label="Previous month">
          <ChevronLeft size={28} className="text-foreground" />
        </button>
        <div className="text-center">
          <h1 className="font-display text-grandma-xl text-foreground">
            {MONTH_NAMES[month]}
          </h1>
          <p className="text-grandma-sm text-muted-foreground">{year}</p>
        </div>
        <button onClick={nextMonth} className="p-4 rounded-2xl bg-card border border-border" aria-label="Next month">
          <ChevronRight size={28} className="text-foreground" />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {DAY_NAMES.map((d) => (
          <div key={d} className="text-center text-sm font-bold text-muted-foreground py-2">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (day === null) return <div key={`empty-${i}`} />;
          const hasBirthday = birthdayMap.has(day);
          const todayClass = isToday(day);
          const isSelected = selectedDay === day;

          // Hebrew date
          const gregDate = new Date(year, month, day);
          const jewishDate = toJewishDate(gregDate);
          const hebrewDate = toHebrewJewishDate(jewishDate);
          const hebrewDay = hebrewDate.day;

          return (
            <button
              key={day}
              onClick={() => setSelectedDay(isSelected ? null : day)}
              className={`
                relative aspect-square rounded-2xl flex flex-col items-center justify-center transition-all
                ${todayClass ? "bg-primary text-primary-foreground shadow-md" : ""}
                ${isSelected && !todayClass ? "bg-primary/20 border-2 border-primary" : ""}
                ${!todayClass && !isSelected ? "bg-card border border-border" : ""}
              `}
            >
              <span className="text-grandma-sm font-bold leading-none">{day}</span>
              <span className={`text-[9px] leading-none mt-0.5 font-medium ${todayClass ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                {hebrewDay}
              </span>
              {hasBirthday && (
                <span className="text-[8px] leading-none">🎂</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected day detail */}
      {selectedDay !== null && (
        <div className="mt-6">
          <h2 className="font-display text-grandma-lg text-foreground mb-3">
            {MONTH_NAMES[month]} {selectedDay}
          </h2>

          {selectedMembers.length > 0 ? (
            <div className="space-y-3">
              {selectedMembers.map((m) => {
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
              })}
            </div>
          ) : (
            <div className="bg-card rounded-2xl p-6 border border-border text-center">
              <p className="text-grandma-base text-muted-foreground">No events on this day</p>
            </div>
          )}
        </div>
      )}

      {/* This month's birthdays summary */}
      {birthdayMap.size > 0 && selectedDay === null && (
        <div className="mt-6">
          <h2 className="font-display text-grandma-lg text-foreground mb-3">
            🎉 This Month
          </h2>
          <div className="space-y-3">
            {Array.from(birthdayMap.entries())
              .sort(([a], [b]) => a - b)
              .map(([day, people]) =>
                people.map((m) => (
                  <div key={m.id} className="bg-card rounded-2xl p-4 border border-border shadow-sm flex items-center gap-4">
                    {m.photo_url ? (
                      <img src={m.photo_url} alt={m.name} className="w-14 h-14 rounded-full object-cover border-2 border-primary/20" />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="text-grandma-base font-display text-primary">{m.name[0]}</span>
                      </div>
                    )}
                    <div>
                      <p className="text-grandma-base font-bold text-foreground">{m.name}</p>
                      <p className="text-grandma-sm text-muted-foreground">
                        {MONTH_NAMES[month]} {day} • {m.relationship}
                      </p>
                    </div>
                  </div>
                ))
              )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarPage;
