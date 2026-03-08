import { useFamilyMembers, getTodaysBirthdays, getUpcomingBirthdays, getAge } from "@/hooks/useFamilyData";
import type { FamilyMember } from "@/hooks/useFamilyData";
import grandmaHero from "@/assets/grandma-hero.png";
import birthdayCake from "@/assets/birthday-cake.png";
import { useNavigate } from "react-router-dom";
import { Settings, TreePine, LogOut } from "lucide-react";
import { useAccessCode } from "@/hooks/useAccessCode";
import FamilySlideshow from "@/components/FamilySlideshow";

const TodayPage = () => {
  const navigate = useNavigate();
  const { data: members = [], isLoading } = useFamilyMembers();
  const { session, isAdmin, logout } = useAccessCode();
  const todaysBirthdays = getTodaysBirthdays(members);
  const upcoming = getUpcomingBirthdays(members, 4);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-grandma-lg text-muted-foreground animate-warm-pulse">Loading your family...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-28 px-4 pt-6 max-w-lg mx-auto">
      {/* Header */}
      <div className="text-center mb-4 animate-slide-up">
        <img src={grandmaHero} alt="GrandmaJoy" className="w-28 h-28 mx-auto mb-3 rounded-full object-cover shadow-lg border-4 border-primary/30" />
        <h1 className="font-display text-grandma-2xl text-foreground mb-1">GrandmaJoy</h1>
        <p className="text-grandma-base text-muted-foreground">
          Welcome, {session?.name || "Family"} 💛
        </p>
      </div>

      {/* Family Slideshow */}
      <div className="animate-slide-up stagger-1">
        <FamilySlideshow />
      </div>

      {/* Quick actions */}
      <div className="flex gap-3 mb-6 animate-slide-up stagger-2">
        <button onClick={() => navigate("/tree")} className="flex-1 grandma-button bg-accent text-accent-foreground rounded-2xl flex items-center justify-center gap-2 shadow-md hover:scale-[1.02] transition-transform">
          <TreePine size={22} /> Family Tree
        </button>
        {isAdmin ? (
          <button onClick={() => navigate("/admin")} className="flex-1 grandma-button bg-card text-foreground border border-border rounded-2xl flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform">
            <Settings size={22} /> Manage
          </button>
        ) : (
          <button onClick={() => { logout(); navigate("/login"); }} className="flex-1 grandma-button bg-card text-foreground border border-border rounded-2xl flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform">
            <LogOut size={22} /> Sign Out
          </button>
        )}
      </div>

      {/* Today's Birthdays */}
      {todaysBirthdays.length > 0 && (
        <section className="mb-8">
          <h2 className="font-display text-grandma-xl text-foreground mb-4 text-center">🎉 Today's Celebration!</h2>
          {todaysBirthdays.map((member) => (
            <BirthdayCard key={member.id} member={member} isToday />
          ))}
          <button className="grandma-button w-full bg-primary text-primary-foreground mt-4 rounded-2xl shadow-lg">
            🎵 Sing Happy Birthday!
          </button>
          <button className="grandma-button w-full bg-secondary text-secondary-foreground mt-3 rounded-2xl shadow-md">
            💌 Send a Message
          </button>
        </section>
      )}

      {todaysBirthdays.length === 0 && (
        <section className="mb-6">
          <div className="bg-card rounded-3xl p-6 text-center shadow-md border border-border">
            <p className="text-grandma-xl mb-2">☀️</p>
            <h2 className="font-display text-grandma-lg text-foreground mb-2">Good {getGreeting()}!</h2>
            <p className="text-grandma-base text-muted-foreground">
              {members.length === 0 ? "Add your family to get started!" : "No birthdays today, but your family loves you!"}
            </p>
            {members.length === 0 && isAdmin && (
              <button onClick={() => navigate("/admin")} className="grandma-button bg-primary text-primary-foreground rounded-2xl mt-4">
                Add Family Members
              </button>
            )}
          </div>
        </section>
      )}

      {/* Upcoming */}
      {upcoming.length > 0 && (
        <section>
          <h2 className="font-display text-grandma-lg text-foreground mb-4">Coming Up Soon</h2>
          <div className="grid grid-cols-2 gap-3">
            {upcoming.map((member) => (
              <BirthdayCard key={member.id} member={member} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

function BirthdayCard({ member, isToday }: { member: FamilyMember; isToday?: boolean }) {
  const age = getAge(member.birth_year);

  return (
    <div className={`rounded-3xl p-5 text-center transition-all ${isToday ? "bg-primary/15 border-2 border-primary shadow-xl" : "bg-card border border-border shadow-sm"}`}>
      {isToday && <img src={birthdayCake} alt="Cake" className="w-16 h-16 mx-auto mb-2 animate-gentle-float" />}

      {member.photo_url ? (
        <img src={member.photo_url} alt={member.name} className="w-20 h-20 rounded-full object-cover mx-auto mb-3 border-2 border-primary/20" />
      ) : (
        <div className="w-20 h-20 rounded-full bg-primary/20 mx-auto mb-3 flex items-center justify-center">
          <span className="text-grandma-xl font-display text-primary">{member.name[0]}</span>
        </div>
      )}

      <h3 className="font-display text-grandma-base text-foreground">{member.name}</h3>
      {member.hebrew_name && <p className="text-sm text-muted-foreground">{member.hebrew_name}</p>}
      <p className="text-sm text-muted-foreground">{member.relationship}</p>

      {isToday && age !== null ? (
        <div className="bg-primary text-primary-foreground rounded-2xl py-2 px-4 mt-3">
          <p className="text-grandma-base font-bold">🎂 Turns {age} today!</p>
        </div>
      ) : (
        age !== null && <p className="text-sm text-muted-foreground mt-1">Age {age}</p>
      )}
    </div>
  );
}

function getGreeting(): string {
  const h = new Date().getHours();
  return h < 12 ? "Morning" : h < 17 ? "Afternoon" : "Evening";
}

export default TodayPage;
