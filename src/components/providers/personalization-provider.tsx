"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { defaultProfile, profileStorageKey, type UserProfile } from "@/lib/personalization";

type PersonalizationContextValue = {
  profile: UserProfile;
  hasCompletedOnboarding: boolean;
  setProfile: (profile: UserProfile) => void;
  completeOnboarding: (profile: UserProfile) => void;
};

const Ctx = createContext<PersonalizationContextValue | null>(null);

export function PersonalizationProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfileState] = useState<UserProfile>(defaultProfile);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(profileStorageKey);
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored) as UserProfile;
      setProfileState(parsed);
      setHasCompletedOnboarding(true);
    } catch {
      localStorage.removeItem(profileStorageKey);
    }
  }, []);

  const setProfile = (next: UserProfile) => setProfileState(next);

  const completeOnboarding = (next: UserProfile) => {
    setProfileState(next);
    setHasCompletedOnboarding(true);
    localStorage.setItem(profileStorageKey, JSON.stringify(next));
  };

  const value = useMemo(
    () => ({ profile, hasCompletedOnboarding, setProfile, completeOnboarding }),
    [profile, hasCompletedOnboarding]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function usePersonalization() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("usePersonalization must be used within PersonalizationProvider");
  return ctx;
}
