import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type FamilyMember = {
  id: string;
  name: string;
  hebrew_name: string | null;
  photo_url: string | null;
  relationship: string;
  birthday_english: string | null;
  birthday_hebrew: string | null;
  birth_year: number | null;
  parent_id: string | null;
  spouse_id: string | null;
  generation: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export function useFamilyMembers() {
  return useQuery({
    queryKey: ["family_members"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("family_members")
        .select("*")
        .order("generation", { ascending: true });
      if (error) throw error;
      return data as FamilyMember[];
    },
  });
}

export function useAddFamilyMember() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (member: Omit<FamilyMember, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("family_members")
        .insert(member)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["family_members"] }),
  });
}

export function useUpdateFamilyMember() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<FamilyMember> & { id: string }) => {
      const { data, error } = await supabase
        .from("family_members")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["family_members"] }),
  });
}

export function useDeleteFamilyMember() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("family_members").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["family_members"] }),
  });
}

export async function uploadFamilyPhoto(file: File, memberId: string): Promise<string> {
  const ext = file.name.split(".").pop();
  const path = `${memberId}/${Date.now()}.${ext}`;
  const { error } = await supabase.storage.from("family-photos").upload(path, file);
  if (error) throw error;
  const { data } = supabase.storage.from("family-photos").getPublicUrl(path);
  return data.publicUrl;
}

export function getTodaysBirthdays(members: FamilyMember[]): FamilyMember[] {
  const today = new Date();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  return members.filter((m) => {
    if (!m.birthday_english) return false;
    const bday = m.birthday_english.slice(5); // "MM-DD" from "YYYY-MM-DD"
    return bday === `${mm}-${dd}`;
  });
}

export function getUpcomingBirthdays(members: FamilyMember[], count = 4): FamilyMember[] {
  const today = new Date();
  const todayNum = today.getMonth() * 31 + today.getDate();

  return [...members]
    .filter((m) => m.birthday_english)
    .sort((a, b) => {
      const aDate = new Date(a.birthday_english!);
      const bDate = new Date(b.birthday_english!);
      const aNum = aDate.getMonth() * 31 + aDate.getDate();
      const bNum = bDate.getMonth() * 31 + bDate.getDate();
      const aDiff = aNum >= todayNum ? aNum - todayNum : 365 - todayNum + aNum;
      const bDiff = bNum >= todayNum ? bNum - todayNum : 365 - todayNum + bNum;
      return aDiff - bDiff;
    })
    .slice(0, count);
}

export function getAge(birthYear: number | null): number | null {
  if (!birthYear) return null;
  return new Date().getFullYear() - birthYear;
}

// === Occasions / Music ===

export type Occasion = {
  id: string;
  title: string;
  occasion_type: string;
  date_english: string | null;
  date_hebrew: string | null;
  family_member_id: string | null;
  music_url: string | null;
  music_title: string | null;
  created_at: string;
};

export function useOccasions() {
  return useQuery({
    queryKey: ["occasions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("occasions")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Occasion[];
    },
  });
}

export function useAddOccasion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (occasion: Omit<Occasion, "id" | "created_at">) => {
      const { data, error } = await supabase
        .from("occasions")
        .insert(occasion)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["occasions"] }),
  });
}

export function useDeleteOccasion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("occasions").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["occasions"] }),
  });
}

export async function uploadMusicFile(file: File, occasionId: string): Promise<string> {
  const ext = file.name.split(".").pop();
  const path = `${occasionId}/${Date.now()}.${ext}`;
  const { error } = await supabase.storage.from("family-music").upload(path, file);
  if (error) throw error;
  const { data } = supabase.storage.from("family-music").getPublicUrl(path);
  return data.publicUrl;
}
