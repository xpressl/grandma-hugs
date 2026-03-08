import { useFamilyMembers } from "@/hooks/useFamilyData";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import grandmaHero from "@/assets/grandma-hero.png";

const PhotosPage = () => {
  const { data: members = [] } = useFamilyMembers();
  const photos = members
    .filter((m) => m.photo_url)
    .map((m) => ({ src: m.photo_url!, caption: `${m.name} — ${m.relationship} 💕` }));

  // Fallback if no photos yet
  const allPhotos = photos.length > 0 ? photos : [
    { src: grandmaHero, caption: "Add family photos to see them here! 📸" },
  ];

  const [current, setCurrent] = useState(0);
  const prev = () => setCurrent((c) => (c === 0 ? allPhotos.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === allPhotos.length - 1 ? 0 : c + 1));

  return (
    <div className="min-h-screen pb-28 px-4 pt-6 max-w-lg mx-auto">
      <h1 className="font-display text-grandma-xl text-foreground text-center mb-6">📸 Family Photos</h1>

      <div className="relative bg-card rounded-3xl overflow-hidden shadow-lg border border-border">
        <img src={allPhotos[current].src} alt={allPhotos[current].caption} className="w-full aspect-square object-cover" />

        {allPhotos.length > 1 && (
          <>
            <button onClick={prev} className="absolute left-0 inset-y-0 flex items-center bg-foreground/20 backdrop-blur-sm rounded-r-2xl p-4" aria-label="Previous">
              <ChevronLeft size={36} className="text-primary-foreground" />
            </button>
            <button onClick={next} className="absolute right-0 inset-y-0 flex items-center bg-foreground/20 backdrop-blur-sm rounded-l-2xl p-4" aria-label="Next">
              <ChevronRight size={36} className="text-primary-foreground" />
            </button>
          </>
        )}

        <div className="absolute bottom-0 left-0 right-0 bg-foreground/30 backdrop-blur-sm p-4">
          <p className="text-primary-foreground text-grandma-base text-center font-semibold">{allPhotos[current].caption}</p>
        </div>
      </div>

      <div className="flex justify-center gap-3 mt-4">
        {allPhotos.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)} className={`w-4 h-4 rounded-full transition-all ${i === current ? "bg-primary scale-125" : "bg-muted"}`} aria-label={`Photo ${i + 1}`} />
        ))}
      </div>
    </div>
  );
};

export default PhotosPage;
