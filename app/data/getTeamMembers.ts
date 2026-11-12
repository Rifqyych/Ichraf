import { members as fallbackMembers, type TeamMember } from "./team";

const contentApiUrl = process.env.PORTFOLIO_CONTENT_API_URL
  ?? "http://127.0.0.1:8080/portfolio-api/content.php";

export async function getTeamMembers(): Promise<TeamMember[]> {
  try {
    const response = await fetch(contentApiUrl, {
      cache: "no-store",
      signal: AbortSignal.timeout(1500),
    });
    if (!response.ok) return fallbackMembers;

    const payload: { members?: TeamMember[] } = await response.json();
    return Array.isArray(payload.members) && payload.members.length > 0
      ? payload.members
      : fallbackMembers;
  } catch {
    return fallbackMembers;
  }
}

export async function getTeamMember(slug: string): Promise<TeamMember | undefined> {
  const members = await getTeamMembers();
  return members.find((member) => member.slug === slug);
}
