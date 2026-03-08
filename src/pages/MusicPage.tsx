import { useState, useRef, useEffect } from "react";
import { Play, Pause, SkipForward, SkipBack, Music } from "lucide-react";
import { useOccasions } from "@/hooks/useFamilyData";
import type { Occasion } from "@/hooks/useFamilyData";

const MusicPage = () => {
  const { data: occasions = [], isLoading } = useOccasions();
  const songs = occasions.filter((o) => o.music_url);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentSong = songs[currentIndex] || null;

  useEffect(() => {
    // Stop audio when song changes or stops
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (playingId && currentSong?.music_url) {
      const audio = new Audio(currentSong.music_url);
      audio.play().catch(() => {});
      audio.onended = () => {
        if (currentIndex < songs.length - 1) {
          setCurrentIndex((i) => i + 1);
        } else {
          setPlayingId(null);
        }
      };
      audioRef.current = audio;
    }
    return () => {
      audioRef.current?.pause();
    };
  }, [playingId, currentIndex]);

  const togglePlay = (song: Occasion, index: number) => {
    if (playingId === song.id) {
      setPlayingId(null);
    } else {
      setCurrentIndex(index);
      setPlayingId(song.id);
    }
  };

  const skipNext = () => {
    if (songs.length === 0) return;
    const next = (currentIndex + 1) % songs.length;
    setCurrentIndex(next);
    setPlayingId(songs[next].id);
  };

  const skipPrev = () => {
    if (songs.length === 0) return;
    const prev = (currentIndex - 1 + songs.length) % songs.length;
    setCurrentIndex(prev);
    setPlayingId(songs[prev].id);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-grandma-lg text-muted-foreground">Loading music...</p>
      </div>
    );
  }

  if (songs.length === 0) {
    return (
      <div className="min-h-screen pb-28 px-4 pt-6 max-w-lg mx-auto">
        <h1 className="font-display text-grandma-xl text-foreground text-center mb-6">
          🎵 Music
        </h1>
        <div className="bg-card rounded-3xl p-8 text-center border border-border">
          <p className="text-grandma-xl mb-3">🎶</p>
          <p className="text-grandma-base text-muted-foreground">
            No music yet! Add songs in the Admin page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-28 px-4 pt-6 max-w-lg mx-auto">
      <h1 className="font-display text-grandma-xl text-foreground text-center mb-6">
        🎵 Music
      </h1>

      {/* Now Playing */}
      {currentSong && (
        <div className="bg-card rounded-3xl p-6 shadow-lg border border-border mb-6">
          <div className="flex items-center justify-center mb-4">
            <div
              className={`w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center ${
                playingId ? "animate-warm-pulse" : ""
              }`}
            >
              <Music size={40} className="text-primary" />
            </div>
          </div>

          <p className="text-center font-display text-grandma-lg text-foreground mb-1">
            {currentSong.music_title || currentSong.title}
          </p>
          <p className="text-center text-grandma-sm text-muted-foreground mb-6">
            {currentSong.occasion_type}
          </p>

          {/* Controls */}
          <div className="flex items-center justify-center gap-6">
            <button onClick={skipPrev} className="p-3 rounded-full bg-muted" aria-label="Previous">
              <SkipBack size={28} className="text-foreground" />
            </button>

            <button
              onClick={() => togglePlay(currentSong, currentIndex)}
              className="p-5 rounded-full bg-primary shadow-lg"
              aria-label={playingId ? "Pause" : "Play"}
            >
              {playingId === currentSong.id ? (
                <Pause size={36} className="text-primary-foreground" />
              ) : (
                <Play size={36} className="text-primary-foreground ml-1" />
              )}
            </button>

            <button onClick={skipNext} className="p-3 rounded-full bg-muted" aria-label="Next">
              <SkipForward size={28} className="text-foreground" />
            </button>
          </div>
        </div>
      )}

      {/* Song List */}
      <div className="space-y-3">
        {songs.map((song, index) => (
          <button
            key={song.id}
            onClick={() => togglePlay(song, index)}
            className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all text-left ${
              playingId === song.id
                ? "bg-primary/15 border-2 border-primary"
                : "bg-card border border-border"
            }`}
          >
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                playingId === song.id ? "bg-primary" : "bg-muted"
              }`}
            >
              {playingId === song.id ? (
                <Pause size={20} className="text-primary-foreground" />
              ) : (
                <Play size={20} className="text-foreground" />
              )}
            </div>

            <div className="flex-1">
              <p className="text-grandma-base font-bold text-foreground">
                {song.music_title || song.title}
              </p>
              <p className="text-grandma-sm text-muted-foreground">
                {song.occasion_type}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MusicPage;
