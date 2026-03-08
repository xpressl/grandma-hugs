import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type AccessRole = "admin" | "family" | null;

export type AccessSession = {
  code: string;
  name: string;
  role: AccessRole;
  familyMemberId: string | null;
};

const STORAGE_KEY = "grandmajoy_access_code";

export function useAccessCode() {
  const [storedCode, setStoredCode] = useState<string | null>(() => 
    localStorage.getItem(STORAGE_KEY)
  );

  const { data: session, isLoading } = useQuery({
    queryKey: ["access_session", storedCode],
    queryFn: async (): Promise<AccessSession | null> => {
      if (!storedCode) return null;
      const { data, error } = await supabase
        .from("access_codes")
        .select("*")
        .eq("code", storedCode)
        .single();
      if (error || !data) {
        localStorage.removeItem(STORAGE_KEY);
        return null;
      }
      return {
        code: data.code,
        name: data.name,
        role: data.role as AccessRole,
        familyMemberId: data.family_member_id,
      };
    },
    enabled: !!storedCode,
  });

  const login = (code: string) => {
    localStorage.setItem(STORAGE_KEY, code);
    setStoredCode(code);
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setStoredCode(null);
  };

  return {
    session: storedCode ? session ?? null : null,
    isLoading: !!storedCode && isLoading,
    isAdmin: session?.role === "admin",
    isLoggedIn: !!session,
    login,
    logout,
  };
}
