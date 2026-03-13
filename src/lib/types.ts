export type SubScores = {
  relevance: number;
  complexity: number;
  codeQuality: number;
  engineeringMaturity: number;
  documentation: number;
};

export type RepoInput = {
  name: string;
  description: string;
  roleTags: string[];
  stars: number;
  hasReadme: boolean;
  hasTests: boolean;
  hasCi: boolean;
  hasDemo: boolean;
  updatedDaysAgo: number;
};

export type PortfolioResult = {
  portfolioScore: number;
  subScores: SubScores;
  flagshipProject: string;
  blockers: string[];
  nextBestActions: string[];
  expectedLift: string;
};
