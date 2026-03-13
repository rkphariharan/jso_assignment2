import { RepoInput } from "@/lib/types";

export const sampleRepos: RepoInput[] = [
  {
    name: "expense-tracker-api",
    description: "REST API for expense management with auth and categories",
    roleTags: ["node", "api", "backend"],
    stars: 18,
    hasReadme: true,
    hasTests: false,
    hasCi: false,
    hasDemo: true,
    updatedDaysAgo: 9
  },
  {
    name: "react-kanban-board",
    description: "Kanban board with drag and drop and local persistence",
    roleTags: ["react", "frontend", "typescript"],
    stars: 11,
    hasReadme: true,
    hasTests: true,
    hasCi: false,
    hasDemo: true,
    updatedDaysAgo: 40
  },
  {
    name: "weather-widget",
    description: "Simple weather component project",
    roleTags: ["frontend", "demo"],
    stars: 2,
    hasReadme: false,
    hasTests: false,
    hasCi: false,
    hasDemo: false,
    updatedDaysAgo: 120
  }
];

export const rolePreference = "Software Developer";

export const recommendationBacklog = [
  "Rewrite flagship README with problem → approach → results and setup steps.",
  "Add a minimum test baseline for core service logic.",
  "Configure GitHub Actions CI for build + test checks.",
  "Add architecture section and API examples in docs.",
  "Capture demo screenshots and outcome metrics for recruiter scanability."
];
