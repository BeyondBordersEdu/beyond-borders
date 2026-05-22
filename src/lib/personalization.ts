export type UserGoal = "study" | "scholarship" | "internship" | "job" | "migration";

export type UserProfile = {
  goal: UserGoal;
  country: string;
  education: string;
  budget: string;
  interest: string;
};

export const defaultProfile: UserProfile = {
  goal: "job",
  country: "United Kingdom",
  education: "Undergraduate",
  budget: "£15k-£30k",
  interest: "Software Engineering"
};

export const profileStorageKey = "bb_user_profile_v1";

export const countryData: Record<string, { jobs: number; scholarships: number; visaPathway: string; hotSkills: string[] }> = {
  "United Kingdom": { jobs: 4820, scholarships: 640, visaPathway: "Graduate Route + Skilled Worker", hotSkills: ["AI", "Data", "FinTech"] },
  Canada: { jobs: 3910, scholarships: 520, visaPathway: "PGWP + Express Entry", hotSkills: ["Cloud", "Healthcare", "Analytics"] },
  Australia: { jobs: 3275, scholarships: 415, visaPathway: "485 + 189/190", hotSkills: ["Cybersecurity", "Nursing", "Construction Tech"] },
  Germany: { jobs: 2840, scholarships: 350, visaPathway: "EU Blue Card", hotSkills: ["Automotive AI", "Embedded", "Product Design"] },
  UAE: { jobs: 2300, scholarships: 190, visaPathway: "Employment Visa", hotSkills: ["Hospitality", "Sales", "Digital Marketing"] },
  India: { jobs: 6100, scholarships: 780, visaPathway: "Global Employer Sponsorship", hotSkills: ["Software", "Operations", "EdTech"] }
};

export function deriveCareerLevel(xp: number) {
  if (xp < 300) return "Beginner";
  if (xp < 750) return "Explorer";
  if (xp < 1400) return "Skilled";
  if (xp < 2200) return "Global Ready";
  return "Sponsored Candidate";
}
