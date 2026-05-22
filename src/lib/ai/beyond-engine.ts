import { countryData } from "@/lib/personalization";

type AIProfile = {
  goal: string;
  country: string;
  education: string;
  budget: string;
  interest: string;
};

export type BeyondAIResult = {
  roadmap: string[];
  scholarshipMatches: string[];
  jobMatches: string[];
  visaEstimate: { score: number; rationale: string };
  skillGaps: string[];
};

export function generateBeyondPlan(profile: AIProfile): BeyondAIResult {
  const country = countryData[profile.country] ?? countryData["United Kingdom"];
  const score = Math.min(92, 55 + Math.floor(country.jobs / 300) + (profile.goal === "job" ? 8 : 3));

  return {
    roadmap: [
      `Week 1: calibrate CV + LinkedIn for ${profile.interest}`,
      `Week 2: shortlist ${profile.country} scholarships and job tracks`,
      `Week 3: run interview simulations + mentor review`,
      `Week 4: submit applications and prepare visa docs for ${country.visaPathway}`
    ],
    scholarshipMatches: [
      `${profile.country} Merit Excellence Grant`,
      `Global Talent Access Fund`,
      `${profile.interest} Future Leaders Scholarship`
    ],
    jobMatches: [
      `${profile.interest} Graduate Associate (${profile.country})`,
      `Visa Sponsored Analyst Program`,
      `International Early Career Fellowship`
    ],
    visaEstimate: {
      score,
      rationale: `Based on target ${profile.country}, pathway ${country.visaPathway}, and current profile readiness.`
    },
    skillGaps: ["Interview narrative", "Portfolio depth", `Market signal: ${country.hotSkills[0]}`]
  };
}
