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
const ACCESS_EVENT = "grandmajoy_access_changed";

export function useAccessCode() {
  const readStoredCode = () => localStorage.getItem(STORAGE_KEY);

  const [storedCode, setStoredCode] = useState<string | null>(() => readStoredCode());

  // Keep all hook instances in sync (LoginPage + AppRoutes)
  useEffect(() => {
    const sync = () => setStoredCode(readStoredCode());

    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) sync();
    };

    window.addEventListener(ACCESS_EVENT, sync);
    window.addEventListener("storage", onStorage);

    return () => {
      window.removeEventListener(ACCESS_EVENT, sync);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const { data: session, isLoading } = useQuery({
    queryKey: ["access_session", storedCode],
    queryFn: async (): Promise<AccessSession | null> => {
      if (!storedCode) return null;

      const { data, error } = await supabase
        .from("access_codes")
        .select("*")
        .eq("code", storedCode)
        .maybeSingle();

      if (error || !data) {
        localStorage.removeItem(STORAGE_KEY);
        window.dispatchEvent(new Event(ACCESS_EVENT));
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
    window.dispatchEvent(new Event(ACCESS_EVENT));
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setStoredCode(null);
    window.dispatchEvent(new Event(ACCESS_EVENT));
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
