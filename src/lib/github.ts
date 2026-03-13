import { RepoInput } from "@/lib/types";

type ParsedRepo = { owner: string; repo: string };

function parseRepoUrl(url: string): ParsedRepo | null {
  try {
    const parsed = new URL(url.trim());
    if (!parsed.hostname.includes("github.com")) {
      return null;
    }
    const segments = parsed.pathname.split("/").filter(Boolean);
    if (segments.length < 2) {
      return null;
    }
    return { owner: segments[0], repo: segments[1].replace(/\.git$/, "") };
  } catch {
    return null;
  }
}

async function githubGet(path: string) {
  const response = await fetch(`https://api.github.com${path}`, {
    headers: {
      Accept: "application/vnd.github+json",
      ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {})
    },
    next: { revalidate: 0 }
  });
  return response;
}

async function checkReadme(owner: string, repo: string) {
  const response = await githubGet(`/repos/${owner}/${repo}/readme`);
  return response.ok;
}

async function checkWorkflows(owner: string, repo: string) {
  const response = await githubGet(`/repos/${owner}/${repo}/contents/.github/workflows`);
  return response.ok;
}

async function checkTests(owner: string, repo: string) {
  const response = await githubGet(`/repos/${owner}/${repo}/contents`);
  if (!response.ok) {
    return false;
  }

  const root = (await response.json()) as Array<{ name?: string }>;
  return root.some((item) => {
    const filename = (item.name ?? "").toLowerCase();
    return filename.includes("test") || filename.includes("spec") || filename === "pytest.ini";
  });
}

export async function collectRepoSignals(repoUrls: string[]): Promise<RepoInput[]> {
  const repos = repoUrls.map(parseRepoUrl).filter((item): item is ParsedRepo => Boolean(item));

  const results = await Promise.all(
    repos.map(async ({ owner, repo }) => {
      const detailsRes = await githubGet(`/repos/${owner}/${repo}`);
      if (!detailsRes.ok) {
        return null;
      }

      const details = await detailsRes.json();
      const [hasReadme, hasCi, hasTests] = await Promise.all([
        checkReadme(owner, repo),
        checkWorkflows(owner, repo),
        checkTests(owner, repo)
      ]);

      const updated = typeof details.updated_at === "string" ? new Date(details.updated_at) : new Date();
      const days = Math.max(0, Math.floor((Date.now() - updated.getTime()) / (1000 * 60 * 60 * 24)));

      const description = typeof details.description === "string" ? details.description : "Repository project";
      const topics = Array.isArray(details.topics) ? details.topics.filter(Boolean).map(String) : [];
      const roleTags = [
        ...topics,
        typeof details.language === "string" ? details.language.toLowerCase() : "",
        ...description
          .toLowerCase()
          .split(/[^a-z0-9+#.-]+/)
          .filter((token: string) => token.length > 2)
          .slice(0, 8)
      ].filter(Boolean);

      return {
        name: details.name,
        description,
        roleTags,
        stars: Number(details.stargazers_count ?? 0),
        hasReadme,
        hasTests,
        hasCi,
        hasDemo: Boolean(details.homepage) || Boolean(details.has_pages),
        updatedDaysAgo: days
      } as RepoInput;
    })
  );

  return results.filter((item): item is RepoInput => Boolean(item));
}
