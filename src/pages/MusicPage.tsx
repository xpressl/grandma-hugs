import { useState, useRef, useEffect } from "react";
import { Play, Pause, SkipForward, SkipBack, Music, Plus, X } from "lucide-react";
import { useOccasions, useAddOccasion, uploadMusicFile, useFamilyMembers } from "@/hooks/useFamilyData";
import type { Occasion } from "@/hooks/useFamilyData";
import { useAccessCode } from "@/hooks/useAccessCode";
import { toast } from "sonner";

const MusicPage = () => {
  const { data: occasions = [], isLoading } = useOccasions();
  const { data: members = [] } = useFamilyMembers();
  const addOccasion = useAddOccasion();
  const { isLoggedIn } = useAccessCode();
  const songs = occasions.filter((o) => o.music_url);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const musicFileRef = useRef<HTMLInputElement>(null);

  // Add form state
  const [musicForm, setMusicForm] = useState({
    title: "",
    occasion_type: "Celebration",
    music_title: "",
    family_member_id: "",
  });
  const [musicFile, setMusicFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const currentSong = songs[currentIndex] || null;

  useEffect(() => {
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

  const handleAddSong = async () => {
    if (!musicForm.title) {
      toast.error("Title is required");
      return;
    }
    if (!musicFile) {
      toast.error("Please select an audio file");
      return;
    }
    setUploading(true);
    try {
      const tempId = "music-" + Date.now();
      const musicUrl = await uploadMusicFile(musicFile, tempId);
      await addOccasion.mutateAsync({
        title: musicForm.title,
        occasion_type: musicForm.occasion_type,
        music_title: musicForm.music_title || null,
        music_url: musicUrl,
        family_member_id: musicForm.family_member_id || null,
        date_english: null,
        date_hebrew: null,
      });
      toast.success("Song added! 🎵");
      setMusicForm({ title: "", occasion_type: "Celebration", music_title: "", family_member_id: "" });
      setMusicFile(null);
      setShowAddForm(false);
    } catch {
      toast.error("Failed to add song");
    }
    setUploading(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-grandma-lg text-muted-foreground">Loading music...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-28 px-4 pt-6 max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-grandma-xl text-foreground">
          🎵 Music
        </h1>
        {isLoggedIn && (
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="p-3 rounded-2xl bg-primary text-primary-foreground shadow-md"
            aria-label={showAddForm ? "Close" : "Add song"}
          >
            {showAddForm ? <X size={24} /> : <Plus size={24} />}
          </button>
        )}
      </div>

      {/* Add Song Form */}
      {showAddForm && (
        <div className="bg-card rounded-2xl p-5 border border-border space-y-3 mb-6">
          <h2 className="font-display text-grandma-lg text-foreground">Add a Song</h2>
          <input
            value={musicForm.title}
            onChange={(e) => setMusicForm((f) => ({ ...f, title: e.target.value }))}
            placeholder="Title *"
            className="w-full rounded-2xl border border-border bg-background p-4 text-grandma-sm text-foreground"
          />
          <input
            value={musicForm.music_title}
            onChange={(e) => setMusicForm((f) => ({ ...f, music_title: e.target.value }))}
            placeholder="Song display name"
            className="w-full rounded-2xl border border-border bg-background p-4 text-grandma-sm text-foreground"
          />
          <select
            value={musicForm.occasion_type}
            onChange={(e) => setMusicForm((f) => ({ ...f, occasion_type: e.target.value }))}
            className="w-full rounded-2xl border border-border bg-card p-4 text-grandma-sm text-foreground"
          >
            <option value="Birthday">Birthday</option>
            <option value="Celebration">Celebration</option>
            <option value="Shabbat">Shabbat</option>
            <option value="Prayer">Prayer</option>
            <option value="Holiday">Holiday</option>
            <option value="Other">Other</option>
          </select>
          <select
            value={musicForm.family_member_id}
            onChange={(e) => setMusicForm((f) => ({ ...f, family_member_id: e.target.value }))}
            className="w-full rounded-2xl border border-border bg-card p-4 text-grandma-sm text-foreground"
          >
            <option value="">— General —</option>
            {members.map((m) => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
          <input
            type="file"
            ref={musicFileRef}
            accept="audio/*"
            className="hidden"
            onChange={(e) => setMusicFile(e.target.files?.[0] || null)}
          />
          <button
            onClick={() => musicFileRef.current?.click()}
            className="grandma-button bg-muted text-foreground rounded-2xl text-grandma-sm w-full"
          >
            {musicFile ? `📎 ${musicFile.name}` : "🎵 Choose Audio File"}
          </button>
          <button
            onClick={handleAddSong}
            disabled={uploading}
            className="grandma-button w-full bg-primary text-primary-foreground rounded-2xl shadow-lg"
          >
            {uploading ? "Uploading..." : "Add Song ✓"}
          </button>
        </div>
      )}

      {songs.length === 0 && !showAddForm ? (
        <div className="bg-card rounded-3xl p-8 text-center border border-border">
          <p className="text-grandma-xl mb-3">🎶</p>
          <p className="text-grandma-base text-muted-foreground">
            No music yet!
          </p>
          {isLoggedIn && (
            <button
              onClick={() => setShowAddForm(true)}
              className="grandma-button bg-primary text-primary-foreground rounded-2xl mt-4"
            >
              <Plus size={18} className="inline mr-2" /> Add First Song
            </button>
          )}
        </div>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
};

export default MusicPage;
