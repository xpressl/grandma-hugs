import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import grandmaHero from "@/assets/grandma-hero.png";

const demoPhotos = [
  { id: 1, src: grandmaHero, caption: "The whole family together 💕" },
  { id: 2, src: grandmaHero, caption: "Sunday dinner at Grandma's 🍽️" },
  { id: 3, src: grandmaHero, caption: "The grandkids playing 🎈" },
];

const PhotosPage = () => {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c === 0 ? demoPhotos.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === demoPhotos.length - 1 ? 0 : c + 1));

  return (
    <div className="min-h-screen pb-28 px-4 pt-6 max-w-lg mx-auto">
      <h1 className="font-display text-grandma-xl text-foreground text-center mb-6">
        📸 Family Photos
      </h1>

      {/* Slideshow */}
      <div className="relative bg-card rounded-3xl overflow-hidden shadow-lg border border-border">
        <img
          src={demoPhotos[current].src}
          alt={demoPhotos[current].caption}
          className="w-full aspect-square object-cover"
        />

        <div className="absolute inset-y-0 left-0 flex items-center">
          <button
            onClick={prev}
            className="bg-foreground/20 backdrop-blur-sm rounded-r-2xl p-4 ml-0"
            aria-label="Previous photo"
          >
            <ChevronLeft size={36} className="text-primary-foreground" />
          </button>
        </div>

        <div className="absolute inset-y-0 right-0 flex items-center">
          <button
            onClick={next}
            className="bg-foreground/20 backdrop-blur-sm rounded-l-2xl p-4 mr-0"
            aria-label="Next photo"
          >
            <ChevronRight size={36} className="text-primary-foreground" />
          </button>
        </div>

        <div className="absolute bottom-0 left-0 right-0 bg-foreground/30 backdrop-blur-sm p-4">
          <p className="text-primary-foreground text-grandma-base text-center font-semibold">
            {demoPhotos[current].caption}
          </p>
        </div>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-3 mt-4">
        {demoPhotos.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-4 h-4 rounded-full transition-all ${
              i === current ? "bg-primary scale-125" : "bg-muted"
            }`}
            aria-label={`Go to photo ${i + 1}`}
          />
        ))}
      </div>

      {/* Thumbnails */}
      <div className="grid grid-cols-3 gap-3 mt-6">
        {demoPhotos.map((photo, i) => (
          <button
            key={photo.id}
            onClick={() => setCurrent(i)}
            className={`rounded-2xl overflow-hidden border-2 transition-all ${
              i === current ? "border-primary shadow-md" : "border-border"
            }`}
          >
            <img
              src={photo.src}
              alt={photo.caption}
              className="w-full aspect-square object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default PhotosPage;
