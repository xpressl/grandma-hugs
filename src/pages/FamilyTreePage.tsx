import { useFamilyMembers, type FamilyMember } from "@/hooks/useFamilyData";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const FamilyTreePage = () => {
  const navigate = useNavigate();
  const { data: members = [], isLoading } = useFamilyMembers();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-grandma-lg text-muted-foreground">Loading tree...</p>
      </div>
    );
  }

  // Build tree: roots are generation 0 or those without parent
  const roots = members.filter((m) => !m.parent_id);
  const getChildren = (parentId: string) => members.filter((m) => m.parent_id === parentId);
  const getSpouse = (spouseId: string | null) => spouseId ? members.find((m) => m.id === spouseId) : null;

  return (
    <div className="min-h-screen pb-28 px-4 pt-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate("/")} className="p-3 rounded-2xl bg-card border border-border">
          <ArrowLeft size={24} className="text-foreground" />
        </button>
        <h1 className="font-display text-grandma-xl text-foreground">
          🌳 Family Tree
        </h1>
      </div>

      {members.length === 0 ? (
        <div className="bg-card rounded-3xl p-8 text-center border border-border">
          <p className="text-grandma-xl mb-2">🌱</p>
          <p className="text-grandma-base text-muted-foreground">
            No family members yet. Go to Manage Family to add people!
          </p>
          <button onClick={() => navigate("/admin")} className="grandma-button bg-primary text-primary-foreground rounded-2xl mt-4">
            Add Family
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {roots.map((root) => (
            <TreeNode key={root.id} member={root} getChildren={getChildren} getSpouse={getSpouse} depth={0} />
          ))}
        </div>
      )}
    </div>
  );
};

function TreeNode({ member, getChildren, getSpouse, depth }: {
  member: FamilyMember;
  getChildren: (id: string) => FamilyMember[];
  getSpouse: (id: string | null) => FamilyMember | null | undefined;
  depth: number;
}) {
  const spouse = getSpouse(member.spouse_id);
  const children = getChildren(member.id);
  // Also get children linked to spouse
  const spouseChildren = spouse ? getChildren(spouse.id).filter((c) => !children.find((ch) => ch.id === c.id)) : [];
  const allChildren = [...children, ...spouseChildren];

  return (
    <div style={{ marginLeft: depth * 24 }}>
      <div className="flex items-center gap-3 mb-3">
        {depth > 0 && (
          <div className="flex flex-col items-center">
            <div className="w-0.5 h-6 bg-primary/30" />
            <div className="w-4 h-0.5 bg-primary/30" />
          </div>
        )}

        {/* Person card */}
        <div className="flex items-center gap-3 bg-card rounded-2xl p-3 border border-border shadow-sm flex-1">
          <PersonAvatar member={member} />
          <div className="flex-1 min-w-0">
            <p className="text-grandma-base font-bold text-foreground truncate">{member.name}</p>
            <p className="text-sm text-muted-foreground">{member.hebrew_name}</p>
            <p className="text-sm text-muted-foreground">{member.relationship}</p>
          </div>

          {spouse && (
            <>
              <span className="text-secondary text-xl">❤️</span>
              <PersonAvatar member={spouse} />
              <div className="min-w-0">
                <p className="text-grandma-base font-bold text-foreground truncate">{spouse.name}</p>
                <p className="text-sm text-muted-foreground">{spouse.hebrew_name}</p>
              </div>
            </>
          )}
        </div>
      </div>

      {allChildren.length > 0 && (
        <div className="space-y-2">
          {allChildren.map((child) => (
            <TreeNode key={child.id} member={child} getChildren={getChildren} getSpouse={getSpouse} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

function PersonAvatar({ member }: { member: FamilyMember }) {
  return member.photo_url ? (
    <img src={member.photo_url} alt={member.name} className="w-14 h-14 rounded-full object-cover border-2 border-primary/20 flex-shrink-0" />
  ) : (
    <div className="w-14 h-14 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0">
      <span className="text-grandma-lg font-display text-primary">{member.name[0]}</span>
    </div>
  );
}

export default FamilyTreePage;
