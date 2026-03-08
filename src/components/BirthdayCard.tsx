import { FamilyMember, getAge } from "@/data/familyData";
import birthdayCake from "@/assets/birthday-cake.png";

interface BirthdayCardProps {
  member: FamilyMember;
  isToday?: boolean;
}

const BirthdayCard = ({ member, isToday }: BirthdayCardProps) => {
  const age = getAge(member.birthYear);

  return (
    <div
      className={`rounded-3xl p-6 text-center transition-all duration-300 ${
        isToday
          ? "bg-primary/15 border-2 border-primary shadow-xl scale-105"
          : "bg-card border border-border shadow-md"
      }`}
    >
      {isToday && (
        <div className="mb-3">
          <img
            src={birthdayCake}
            alt="Birthday cake"
            className="w-20 h-20 mx-auto animate-gentle-float"
          />
        </div>
      )}

      <div className="w-24 h-24 rounded-full bg-primary/20 mx-auto mb-4 flex items-center justify-center">
        <span className="text-grandma-2xl font-display text-primary">
          {member.name[0]}
        </span>
      </div>

      <h3 className="font-display text-grandma-lg text-foreground mb-1">
        {member.name}
      </h3>
      <p className="text-grandma-sm text-muted-foreground mb-1">
        {member.hebrewName}
      </p>
      <p className="text-grandma-sm text-muted-foreground mb-2">
        {member.relationship}
      </p>

      {isToday ? (
        <div className="bg-primary text-primary-foreground rounded-2xl py-3 px-6 mt-4">
          <p className="text-grandma-lg font-bold">
            🎂 Turns {age} today!
          </p>
        </div>
      ) : (
        <div className="mt-2">
          <p className="text-grandma-sm text-muted-foreground">
            Age {age} • {member.birthdayHebrew}
          </p>
        </div>
      )}
    </div>
  );
};

export default BirthdayCard;
