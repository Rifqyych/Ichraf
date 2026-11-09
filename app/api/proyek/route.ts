import { NextResponse } from "next/server";
import { getTeamMembers } from "../../data/getTeamMembers";

export async function GET() {
  const members = await getTeamMembers();
  const projects = members.flatMap((member) =>
    member.projects.map((project, index) => ({
      id: `${member.slug}-${project.number}-${index}`,
      memberSlug: member.slug,
      memberName: member.name,
      ...project,
    })),
  );

  return NextResponse.json(projects);
}
