import { Heart, Image, Music, BookOpen } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const tabs = [
  { path: "/", label: "Today", icon: Heart },
  { path: "/photos", label: "Photos", icon: Image },
  { path: "/music", label: "Music", icon: Music },
  { path: "/prayer", label: "Prayer", icon: BookOpen },
];

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t-2 border-border shadow-lg">
      <div className="flex justify-around items-center max-w-lg mx-auto">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          const Icon = tab.icon;
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className={`tab-button flex-1 ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              <Icon size={32} strokeWidth={isActive ? 2.5 : 1.5} />
              <span className="text-grandma-sm font-bold">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
