"use client";

import { create } from "zustand";

type AppState = {
  profile: any | null;
  savedJobs: string[];
  savedScholarships: string[];
  setProfile: (profile: any) => void;
  setSavedJobs: (ids: string[]) => void;
  setSavedScholarships: (ids: string[]) => void;
};

export const useAppStore = create<AppState>((set) => ({
  profile: null,
  savedJobs: [],
  savedScholarships: [],
  setProfile: (profile) => set({ profile }),
  setSavedJobs: (savedJobs) => set({ savedJobs }),
  setSavedScholarships: (savedScholarships) => set({ savedScholarships })
}));
