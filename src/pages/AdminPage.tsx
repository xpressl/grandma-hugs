import { useState, useRef } from "react";
import { useFamilyMembers, useAddFamilyMember, useUpdateFamilyMember, useDeleteFamilyMember, uploadFamilyPhoto, useOccasions, useAddOccasion, useDeleteOccasion, uploadMusicFile } from "@/hooks/useFamilyData";
import type { FamilyMember, Occasion } from "@/hooks/useFamilyData";
import { ArrowLeft, Plus, Trash2, Camera, Pencil, Music } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const AdminPage = () => {
  const navigate = useNavigate();
  const { data: members = [], isLoading } = useFamilyMembers();
  const addMember = useAddFamilyMember();
  const updateMember = useUpdateFamilyMember();
  const deleteMember = useDeleteFamilyMember();
  const { data: occasions = [] } = useOccasions();
  const addOccasion = useAddOccasion();
  const deleteOccasion = useDeleteOccasion();
  const [editing, setEditing] = useState<FamilyMember | null>(null);
  const [showForm, setShowForm] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const musicFileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [tab, setTab] = useState<"family" | "music">("family");

  // Music form state
  const [musicForm, setMusicForm] = useState({
    title: "",
    occasion_type: "Celebration",
    music_title: "",
    family_member_id: "",
  });
  const [musicFile, setMusicFile] = useState<File | null>(null);
  const [uploadingMusic, setUploadingMusic] = useState(false);

  const [form, setForm] = useState({
    name: "",
    hebrew_name: "",
    relationship: "",
    birthday_english: "",
    birthday_hebrew: "",
    birth_year: "",
    parent_id: "",
    spouse_id: "",
    generation: "1",
    photo_url: "",
    notes: "",
  });

  const resetForm = () => {
    setForm({ name: "", hebrew_name: "", relationship: "", birthday_english: "", birthday_hebrew: "", birth_year: "", parent_id: "", spouse_id: "", generation: "1", photo_url: "", notes: "" });
    setEditing(null);
    setShowForm(false);
  };

  const editMember = (m: FamilyMember) => {
    setForm({
      name: m.name,
      hebrew_name: m.hebrew_name || "",
      relationship: m.relationship,
      birthday_english: m.birthday_english || "",
      birthday_hebrew: m.birthday_hebrew || "",
      birth_year: m.birth_year?.toString() || "",
      parent_id: m.parent_id || "",
      spouse_id: m.spouse_id || "",
      generation: m.generation.toString(),
      photo_url: m.photo_url || "",
      notes: m.notes || "",
    });
    setEditing(m);
    setShowForm(true);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const tempId = editing?.id || "new-" + Date.now();
      const url = await uploadFamilyPhoto(file, tempId);
      setForm((f) => ({ ...f, photo_url: url }));
      toast.success("Photo uploaded!");
    } catch {
      toast.error("Failed to upload photo");
    }
    setUploading(false);
  };

  const handleSave = async () => {
    if (!form.name || !form.relationship) {
      toast.error("Name and relationship are required");
      return;
    }

    const payload = {
      name: form.name,
      hebrew_name: form.hebrew_name || null,
      relationship: form.relationship,
      birthday_english: form.birthday_english || null,
      birthday_hebrew: form.birthday_hebrew || null,
      birth_year: form.birth_year ? parseInt(form.birth_year) : null,
      parent_id: form.parent_id || null,
      spouse_id: form.spouse_id || null,
      generation: parseInt(form.generation) || 0,
      photo_url: form.photo_url || null,
      notes: form.notes || null,
    };

    try {
      if (editing) {
        await updateMember.mutateAsync({ id: editing.id, ...payload });
        toast.success(`${form.name} updated!`);
      } else {
        await addMember.mutateAsync(payload);
        toast.success(`${form.name} added!`);
      }
      resetForm();
    } catch {
      toast.error("Failed to save");
    }
  };

  const handleDelete = async (m: FamilyMember) => {
    if (!confirm(`Remove ${m.name}?`)) return;
    await deleteMember.mutateAsync(m.id);
    toast.success(`${m.name} removed`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-grandma-lg text-muted-foreground">Loading family...</p>
      </div>
    );
  }

  const handleSaveMusic = async () => {
    if (!musicForm.title) {
      toast.error("Title is required");
      return;
    }
    setUploadingMusic(true);
    try {
      let musicUrl: string | null = null;
      const tempId = "music-" + Date.now();
      if (musicFile) {
        musicUrl = await uploadMusicFile(musicFile, tempId);
      }
      await addOccasion.mutateAsync({
        title: musicForm.title,
        occasion_type: musicForm.occasion_type,
        music_title: musicForm.music_title || null,
        music_url: musicUrl,
        family_member_id: musicForm.family_member_id || null,
        date_english: null,
        date_hebrew: null,
      });
      toast.success("Music added!");
      setMusicForm({ title: "", occasion_type: "Celebration", music_title: "", family_member_id: "" });
      setMusicFile(null);
    } catch {
      toast.error("Failed to add music");
    }
    setUploadingMusic(false);
  };

  const handleDeleteOccasion = async (o: Occasion) => {
    if (!confirm(`Remove "${o.title}"?`)) return;
    await deleteOccasion.mutateAsync(o.id);
    toast.success("Removed!");
  };

  return (
    <div className="min-h-screen pb-28 px-4 pt-6 max-w-lg mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate("/")} className="p-3 rounded-2xl bg-card border border-border">
          <ArrowLeft size={24} className="text-foreground" />
        </button>
        <h1 className="font-display text-grandma-xl text-foreground flex-1">
          ⚙️ Admin
        </h1>
      </div>

      {/* Tab switcher */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setTab("family")}
          className={`flex-1 grandma-button rounded-2xl flex items-center justify-center gap-2 ${
            tab === "family" ? "bg-primary text-primary-foreground" : "bg-card border border-border text-foreground"
          }`}
        >
          👨‍👩‍👧 Family
        </button>
        <button
          onClick={() => setTab("music")}
          className={`flex-1 grandma-button rounded-2xl flex items-center justify-center gap-2 ${
            tab === "music" ? "bg-primary text-primary-foreground" : "bg-card border border-border text-foreground"
          }`}
        >
          <Music size={18} /> Music
        </button>
      </div>

      {tab === "family" && (
        <>
          {!showForm ? (
            <>
              <button
                onClick={() => { resetForm(); setShowForm(true); }}
                className="grandma-button w-full bg-primary text-primary-foreground rounded-2xl shadow-lg flex items-center justify-center gap-3 mb-6"
              >
                <Plus size={24} /> Add Family Member
              </button>

              <div className="space-y-3">
                {members.map((m) => (
                  <div key={m.id} className="bg-card rounded-2xl p-4 border border-border shadow-sm flex items-center gap-4">
                    {m.photo_url ? (
                      <img src={m.photo_url} alt={m.name} className="w-16 h-16 rounded-full object-cover border-2 border-primary/30" />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="text-grandma-lg font-display text-primary">{m.name[0]}</span>
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="text-grandma-base font-bold text-foreground">{m.name}</p>
                      <p className="text-grandma-sm text-muted-foreground">{m.hebrew_name} • {m.relationship}</p>
                      {m.parent_id && (
                        <p className="text-sm text-muted-foreground">
                          Parent: {members.find((p) => p.id === m.parent_id)?.name || "—"}
                        </p>
                      )}
                    </div>
                    <button onClick={() => editMember(m)} className="p-3 rounded-xl bg-muted" aria-label="Edit">
                      <Pencil size={18} className="text-foreground" />
                    </button>
                    <button onClick={() => handleDelete(m)} className="p-3 rounded-xl bg-destructive/10">
                      <Trash2 size={18} className="text-destructive" />
                    </button>
                  </div>
                ))}

                {members.length === 0 && (
                  <div className="bg-card rounded-3xl p-8 text-center border border-border">
                    <p className="text-grandma-xl mb-2">👨‍👩‍👧‍👦</p>
                    <p className="text-grandma-base text-muted-foreground">No family members yet. Add the grandparents first!</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <h2 className="font-display text-grandma-lg text-foreground">
                {editing ? `Edit ${editing.name}` : "Add Family Member"}
              </h2>

              {/* Photo */}
              <div className="flex flex-col items-center gap-3">
                {form.photo_url ? (
                  <img src={form.photo_url} alt="Profile" className="w-28 h-28 rounded-full object-cover border-4 border-primary/30" />
                ) : (
                  <div className="w-28 h-28 rounded-full bg-muted flex items-center justify-center">
                    <Camera size={36} className="text-muted-foreground" />
                  </div>
                )}
                <input type="file" ref={fileRef} accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                <button
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  className="grandma-button bg-muted text-foreground rounded-2xl text-grandma-sm"
                >
                  {uploading ? "Uploading..." : "📷 Upload Photo"}
                </button>
              </div>

              {/* Fields */}
              <div className="space-y-3">
                <FieldInput label="Name *" value={form.name} onChange={(v) => setForm((f) => ({ ...f, name: v }))} />
                <FieldInput label="Hebrew Name" value={form.hebrew_name} onChange={(v) => setForm((f) => ({ ...f, hebrew_name: v }))} dir="rtl" />
                <FieldInput label="Relationship" value={form.relationship} onChange={(v) => setForm((f) => ({ ...f, relationship: v }))} placeholder="e.g. Granddaughter, Son" />
                <FieldInput label="Birthday (English)" value={form.birthday_english} onChange={(v) => setForm((f) => ({ ...f, birthday_english: v }))} type="date" />
                <FieldInput label="Birthday (Hebrew)" value={form.birthday_hebrew} onChange={(v) => setForm((f) => ({ ...f, birthday_hebrew: v }))} placeholder="e.g. 8 Adar" />
                <FieldInput label="Birth Year" value={form.birth_year} onChange={(v) => setForm((f) => ({ ...f, birth_year: v }))} type="number" placeholder="e.g. 2018" />
                <FieldInput label="Generation" value={form.generation} onChange={(v) => setForm((f) => ({ ...f, generation: v }))} type="number" placeholder="0=Grandparents, 1=Children, 2=Grandchildren" />

                {/* Parent selector */}
                <div>
                  <label className="block text-grandma-sm font-bold text-foreground mb-1">
                    👨‍👩‍👧 Parent (Who is their parent?)
                  </label>
                  <p className="text-sm text-muted-foreground mb-2">
                    {members.length === 0
                      ? "💡 Add grandparents first — they don't need a parent."
                      : "Select who this person's parent is in the family."}
                  </p>
                  <select
                    value={form.parent_id}
                    onChange={(e) => setForm((f) => ({ ...f, parent_id: e.target.value }))}
                    className="w-full rounded-2xl border border-border bg-card p-4 text-grandma-sm text-foreground"
                  >
                    <option value="">— No parent (grandparent level) —</option>
                    {members.filter((m) => m.id !== editing?.id).map((m) => (
                      <option key={m.id} value={m.id}>↳ {m.name} ({m.relationship})</option>
                    ))}
                  </select>
                </div>

                {/* Spouse selector */}
                <div>
                  <label className="block text-grandma-sm font-bold text-foreground mb-1">Spouse</label>
                  <select
                    value={form.spouse_id}
                    onChange={(e) => setForm((f) => ({ ...f, spouse_id: e.target.value }))}
                    className="w-full rounded-2xl border border-border bg-card p-4 text-grandma-sm text-foreground"
                  >
                    <option value="">No spouse</option>
                    {members.filter((m) => m.id !== editing?.id).map((m) => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                </div>

                <FieldInput label="Notes" value={form.notes} onChange={(v) => setForm((f) => ({ ...f, notes: v }))} placeholder="Any special notes..." />
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={resetForm} className="grandma-button flex-1 bg-muted text-foreground rounded-2xl">
                  Cancel
                </button>
                <button onClick={handleSave} className="grandma-button flex-1 bg-primary text-primary-foreground rounded-2xl shadow-lg">
                  {editing ? "Update" : "Add"} ✓
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {tab === "music" && (
        <div className="space-y-6">
          {/* Add music form */}
          <div className="bg-card rounded-2xl p-5 border border-border space-y-3">
            <h2 className="font-display text-grandma-lg text-foreground">🎵 Add Music</h2>
            <FieldInput label="Title *" value={musicForm.title} onChange={(v) => setMusicForm((f) => ({ ...f, title: v }))} placeholder="e.g. Happy Birthday" />
            <FieldInput label="Song Name" value={musicForm.music_title} onChange={(v) => setMusicForm((f) => ({ ...f, music_title: v }))} placeholder="Display name for the song" />
            <div>
              <label className="block text-grandma-sm font-bold text-foreground mb-1">Type</label>
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
            </div>
            <div>
              <label className="block text-grandma-sm font-bold text-foreground mb-1">For family member (optional)</label>
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
            </div>
            <div>
              <label className="block text-grandma-sm font-bold text-foreground mb-1">🎶 Music File (MP3)</label>
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
            </div>
            <button
              onClick={handleSaveMusic}
              disabled={uploadingMusic}
              className="grandma-button w-full bg-primary text-primary-foreground rounded-2xl shadow-lg"
            >
              {uploadingMusic ? "Uploading..." : "Add Music ✓"}
            </button>
          </div>

          {/* Existing music list */}
          <div className="space-y-3">
            {occasions.map((o) => (
              <div key={o.id} className="bg-card rounded-2xl p-4 border border-border shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Music size={20} className="text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-grandma-base font-bold text-foreground">{o.music_title || o.title}</p>
                  <p className="text-grandma-sm text-muted-foreground">{o.occasion_type}</p>
                </div>
                <button onClick={() => handleDeleteOccasion(o)} className="p-3 rounded-xl bg-destructive/10">
                  <Trash2 size={18} className="text-destructive" />
                </button>
              </div>
            ))}

            {occasions.length === 0 && (
              <div className="bg-card rounded-3xl p-8 text-center border border-border">
                <p className="text-grandma-xl mb-2">🎶</p>
                <p className="text-grandma-base text-muted-foreground">No music yet. Add your first song above!</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

function FieldInput({ label, value, onChange, type = "text", placeholder = "", dir }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string; dir?: string;
}) {
  return (
    <div>
      <label className="block text-grandma-sm font-bold text-foreground mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        dir={dir}
        className="w-full rounded-2xl border border-border bg-card p-4 text-grandma-sm text-foreground placeholder:text-muted-foreground"
      />
    </div>
  );
}

export default AdminPage;
