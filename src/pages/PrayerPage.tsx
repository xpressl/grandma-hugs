import { useFamilyMembers } from "@/hooks/useFamilyData";
import { Heart } from "lucide-react";

const PrayerPage = () => {
  const { data: members = [] } = useFamilyMembers();

  return (
    <div className="min-h-screen pb-28 px-4 pt-6 max-w-lg mx-auto">
      <h1 className="font-display text-grandma-xl text-foreground text-center mb-2">🕊️ Prayer</h1>
      <p className="text-center text-grandma-base text-muted-foreground mb-8">Your family's Hebrew names for prayer</p>

      <div className="space-y-4 mb-8">
        {members.filter((m) => m.hebrew_name).map((member) => (
          <div key={member.id} className="bg-card rounded-3xl p-6 border border-border shadow-sm flex items-center gap-4">
            {member.photo_url ? (
              <img src={member.photo_url} alt={member.name} className="w-16 h-16 rounded-full object-cover border-2 border-accent/30 flex-shrink-0" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                <Heart size={24} className="text-accent" />
              </div>
            )}
            <div className="flex-1 text-left">
              <p className="font-display text-grandma-lg text-foreground leading-tight">{member.hebrew_name}</p>
              <p className="text-grandma-base text-muted-foreground">{member.name} • {member.relationship}</p>
            </div>
          </div>
        ))}

        {members.filter((m) => m.hebrew_name).length === 0 && (
          <div className="bg-card rounded-3xl p-8 text-center border border-border">
            <p className="text-grandma-xl mb-2">🕯️</p>
            <p className="text-grandma-base text-muted-foreground">Add Hebrew names in Manage Family to see them here.</p>
          </div>
        )}
      </div>

      <div className="bg-accent/10 rounded-3xl p-8 text-center border border-accent/30">
        <p className="text-grandma-xl mb-4">🕯️</p>
        <h2 className="font-display text-grandma-lg text-foreground mb-4">A Prayer for the Family</h2>
        <p className="text-grandma-base text-foreground leading-relaxed" dir="rtl">יְבָרֶכְךָ יְהוָה וְיִשְׁמְרֶךָ</p>
        <p className="text-grandma-base text-foreground leading-relaxed" dir="rtl">יָאֵר יְהוָה פָּנָיו אֵלֶיךָ וִיחֻנֶּךָּ</p>
        <p className="text-grandma-base text-foreground leading-relaxed" dir="rtl">יִשָּׂא יְהוָה פָּנָיו אֵלֶיךָ וְיָשֵׂם לְךָ שָׁלוֹם</p>
        <p className="text-grandma-sm text-muted-foreground mt-4 italic">May the Lord bless you and keep you...</p>
      </div>
    </div>
  );
};

export default PrayerPage;
