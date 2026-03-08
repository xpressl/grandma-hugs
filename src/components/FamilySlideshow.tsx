import { useState, useEffect } from "react";
import { useFamilyMembers } from "@/hooks/useFamilyData";

const FamilySlideshow = () => {
  const { data: members = [] } = useFamilyMembers();
  const photosMembers = members.filter((m) => m.photo_url);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (photosMembers.length <= 1) return;
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((i) => (i + 1) % photosMembers.length);
        setIsTransitioning(false);
      }, 600);
    }, 5000);
    return () => clearInterval(interval);
  }, [photosMembers.length]);

  if (photosMembers.length === 0) {
    return (
      <div className="relative w-full h-44 rounded-3xl overflow-hidden bg-gradient-to-br from-primary/30 via-secondary/20 to-accent/20 flex items-center justify-center mb-6">
        <div className="text-center animate-fade-in">
          <p className="text-4xl mb-2">👨‍👩‍👧‍👦</p>
          <p className="text-grandma-sm font-display text-foreground/70">Your family moments</p>
        </div>
      </div>
    );
  }

  const current = photosMembers[currentIndex];

  return (
    <div className="relative w-full h-48 rounded-3xl overflow-hidden mb-6 shadow-lg">
      {/* Background blur layer */}
      <div
        className="absolute inset-0 bg-cover bg-center scale-110 blur-xl opacity-60"
        style={{ backgroundImage: `url(${current?.photo_url})` }}
      />
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-foreground/10 to-transparent" />

      {/* Photo */}
      <div className="absolute inset-0 flex items-center justify-center">
        <img
          key={current?.id}
          src={current?.photo_url || ""}
          alt={current?.name || ""}
          className={`w-28 h-28 rounded-full object-cover border-4 border-primary-foreground/80 shadow-xl transition-all duration-600 ${
            isTransitioning ? "opacity-0 scale-90" : "opacity-100 scale-100"
          }`}
        />
      </div>

      {/* Name overlay */}
      <div className={`absolute bottom-3 left-0 right-0 text-center transition-all duration-500 ${
        isTransitioning ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
      }`}>
        <p className="font-display text-grandma-base text-primary-foreground drop-shadow-lg">
          {current?.name}
        </p>
        <p className="text-sm text-primary-foreground/80 drop-shadow">
          {current?.relationship}
        </p>
      </div>

      {/* Dots */}
      {photosMembers.length > 1 && (
        <div className="absolute top-3 right-3 flex gap-1.5">
          {photosMembers.map((_, i) => (
            <button
              key={i}
              onClick={() => { setIsTransitioning(true); setTimeout(() => { setCurrentIndex(i); setIsTransitioning(false); }, 300); }}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i === currentIndex ? "bg-primary-foreground w-5" : "bg-primary-foreground/40"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FamilySlideshow;
