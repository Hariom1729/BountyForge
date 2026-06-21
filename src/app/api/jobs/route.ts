import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const jobs = await prisma.jobPost.findMany({
      where: { status: "OPEN" },
      include: {
        organization: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(jobs);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, description, type, location, salaryMin, salaryMax } = await req.json();

    // DEMO: If the user doesn't have an organization, create a mock one.
    let org = await prisma.organization.findFirst({
      where: { ownerId: session.user.id },
    });

    if (!org) {
      org = await prisma.organization.create({
        data: {
          name: `${session.user.name}'s Organization`,
          ownerId: session.user.id,
        },
      });
    }

    const job = await prisma.jobPost.create({
      data: {
        organizationId: org.id,
        title,
        description,
        type,
        location,
        salaryMin: salaryMin ? parseFloat(salaryMin) : null,
        salaryMax: salaryMax ? parseFloat(salaryMax) : null,
      },
    });

    return NextResponse.json(job, { status: 201 });
  } catch (error) {
    console.error("Error creating job:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
