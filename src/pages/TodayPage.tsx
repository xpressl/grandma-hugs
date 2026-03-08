import { getTodaysBirthdays, getUpcomingBirthdays } from "@/data/familyData";
import BirthdayCard from "@/components/BirthdayCard";
import grandmaHero from "@/assets/grandma-hero.png";

const TodayPage = () => {
  const todaysBirthdays = getTodaysBirthdays();
  const upcoming = getUpcomingBirthdays(4);

  return (
    <div className="min-h-screen pb-28 px-4 pt-6 max-w-lg mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <img
          src={grandmaHero}
          alt="GrandmaJoy"
          className="w-32 h-32 mx-auto mb-4 rounded-full object-cover shadow-lg border-4 border-primary/30"
        />
        <h1 className="font-display text-grandma-2xl text-foreground mb-2">
          GrandmaJoy
        </h1>
        <p className="text-grandma-base text-muted-foreground">
          Your family, one tap away 💛
        </p>
      </div>

      {/* Today's Birthdays */}
      {todaysBirthdays.length > 0 && (
        <section className="mb-8">
          <h2 className="font-display text-grandma-xl text-foreground mb-4 text-center">
            🎉 Today's Celebration!
          </h2>
          <div className="space-y-4">
            {todaysBirthdays.map((member) => (
              <BirthdayCard key={member.id} member={member} isToday />
            ))}
          </div>

          <button className="grandma-button w-full bg-primary text-primary-foreground mt-6 rounded-2xl shadow-lg hover:shadow-xl">
            🎵 Sing Happy Birthday!
          </button>

          <button className="grandma-button w-full bg-secondary text-secondary-foreground mt-3 rounded-2xl shadow-md">
            💌 Send a Message
          </button>
        </section>
      )}

      {todaysBirthdays.length === 0 && (
        <section className="mb-8">
          <div className="bg-card rounded-3xl p-8 text-center shadow-md border border-border">
            <p className="text-grandma-xl mb-2">☀️</p>
            <h2 className="font-display text-grandma-lg text-foreground mb-2">
              Good {getGreeting()}!
            </h2>
            <p className="text-grandma-base text-muted-foreground">
              No birthdays today, but your family loves you!
            </p>
          </div>
        </section>
      )}

      {/* Upcoming */}
      <section>
        <h2 className="font-display text-grandma-lg text-foreground mb-4">
          Coming Up Soon
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {upcoming.map((member) => (
            <BirthdayCard key={member.id} member={member} />
          ))}
        </div>
      </section>
    </div>
  );
};

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Morning";
  if (hour < 17) return "Afternoon";
  return "Evening";
}

export default TodayPage;
