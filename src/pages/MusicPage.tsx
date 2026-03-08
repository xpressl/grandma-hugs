import { useState } from "react";
import { Play, Pause, SkipForward, SkipBack, Music } from "lucide-react";

interface Song {
  id: string;
  title: string;
  occasion: string;
  duration: string;
}

const songs: Song[] = [
  { id: "1", title: "Happy Birthday 🎂", occasion: "Birthday", duration: "0:32" },
  { id: "2", title: "Hava Nagila 💃", occasion: "Celebration", duration: "3:15" },
  { id: "3", title: "Shabbat Shalom 🕯️", occasion: "Shabbat", duration: "2:45" },
  { id: "4", title: "Mazel Tov! 🎉", occasion: "Celebration", duration: "2:10" },
  { id: "5", title: "Oseh Shalom 🕊️", occasion: "Prayer", duration: "3:30" },
  { id: "6", title: "David Melech 👑", occasion: "Celebration", duration: "2:55" },
];

const MusicPage = () => {
  const [playing, setPlaying] = useState<string | null>(null);
  const [currentSong, setCurrentSong] = useState<Song>(songs[0]);

  const togglePlay = (song: Song) => {
    if (playing === song.id) {
      setPlaying(null);
    } else {
      setPlaying(song.id);
      setCurrentSong(song);
    }
  };

  return (
    <div className="min-h-screen pb-28 px-4 pt-6 max-w-lg mx-auto">
      <h1 className="font-display text-grandma-xl text-foreground text-center mb-6">
        🎵 Music
      </h1>

      {/* Now Playing */}
      <div className="bg-card rounded-3xl p-6 shadow-lg border border-border mb-6">
        <div className="flex items-center justify-center mb-4">
          <div
            className={`w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center ${
              playing ? "animate-warm-pulse" : ""
            }`}
          >
            <Music size={40} className="text-primary" />
          </div>
        </div>

        <p className="text-center font-display text-grandma-lg text-foreground mb-1">
          {currentSong.title}
        </p>
        <p className="text-center text-grandma-sm text-muted-foreground mb-6">
          {currentSong.occasion} • {currentSong.duration}
        </p>

        {/* Controls */}
        <div className="flex items-center justify-center gap-6">
          <button className="p-3 rounded-full bg-muted" aria-label="Previous">
            <SkipBack size={28} className="text-foreground" />
          </button>

          <button
            onClick={() => togglePlay(currentSong)}
            className="p-5 rounded-full bg-primary shadow-lg"
            aria-label={playing ? "Pause" : "Play"}
          >
            {playing === currentSong.id ? (
              <Pause size={36} className="text-primary-foreground" />
            ) : (
              <Play size={36} className="text-primary-foreground ml-1" />
            )}
          </button>

          <button className="p-3 rounded-full bg-muted" aria-label="Next">
            <SkipForward size={28} className="text-foreground" />
          </button>
        </div>
      </div>

      {/* Song List */}
      <div className="space-y-3">
        {songs.map((song) => (
          <button
            key={song.id}
            onClick={() => togglePlay(song)}
            className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all text-left ${
              playing === song.id
                ? "bg-primary/15 border-2 border-primary"
                : "bg-card border border-border"
            }`}
          >
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                playing === song.id ? "bg-primary" : "bg-muted"
              }`}
            >
              {playing === song.id ? (
                <Pause size={20} className="text-primary-foreground" />
              ) : (
                <Play size={20} className={playing === song.id ? "text-primary-foreground" : "text-foreground"} />
              )}
            </div>

            <div className="flex-1">
              <p className="text-grandma-base font-bold text-foreground">
                {song.title}
              </p>
              <p className="text-grandma-sm text-muted-foreground">
                {song.occasion} • {song.duration}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MusicPage;
